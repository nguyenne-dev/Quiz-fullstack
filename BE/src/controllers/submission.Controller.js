const Submission = require("../models/Submission");
const SubmissionAnswer = require("../models/SubmissionAnswer");
const Question = require("../models/Question");


exports.getAllSubmissions = async (req, res) => {
  try {
    // Lấy submissions theo userId và sort theo submittedAt giảm dần
    const submissions = await Submission.find({ userId: req.user.id })
      .populate("topicId", "_id title description") // Lấy tiêu đề + mô tả
      .sort({ submittedAt: -1 }); // -1 : mới nhất trước

    // Gắn thêm totalQuestions cho từng submission
    const submissionsWithDetails = await Promise.all(
      submissions.map(async (submission) => {
        const answers = await SubmissionAnswer.find({ submissionId: submission._id });

        return {
          _id: submission._id,
          startedAt: submission.startedAt,
          submittedAt: submission.submittedAt,
          score: submission.score,
          totalQuestions: answers.length,
          topicId: submission.topicId?._id || "",
          topicTitle: submission.topicId?.title || "",
          topicDescription: submission.topicId?.description || "",
        };
      })
    );

    res.json({
      success: true,
      data: submissionsWithDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy submissions",
      error: err.message,
    });
  }
};


// Lấy chi tiết 1 submission theo id
exports.getSubmissions = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy submission kèm topic (_id, title, description)
    const submission = await Submission.findById(id)
      .populate("topicId", "_id title description");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài làm này" });
    }

    // Lấy answers của submission này
    const submissionAnswers = await SubmissionAnswer.find({ submissionId: id });

    // Format lại dữ liệu an toàn từ snapshot đã lưu trong SubmissionAnswer
    const questions = submissionAnswers.map(ans => ({
      _id: ans.questionId || ans._id,
      question: ans.question,
      answers: ans.answers || [],
      correctAnswer: ans.correctAnswer,
      selectedAnswer: ans.selectedAnswer,
      isCorrect: ans.isCorrect,
    }));

    res.json({
      success: true,
      data: {
        _id: submission._id,
        startedAt: submission.startedAt,
        submittedAt: submission.submittedAt,
        topicId: submission.topicId?._id || "",
        topicTitle: submission.topicId?.title || "Bài thi trắc nghiệm",
        topicDescription: submission.topicId?.description || "",
        questions,
        score: submission.score,
        totalQuestions: submissionAnswers.length,
      },
    });

  } catch (err) {
    console.error("Lỗi khi lấy chi tiết submission:", err);
    res.status(500).json({ success: false, message: "Lỗi khi lấy chi tiết bài làm", error: err.message });
  }
};


// Tạo submission mới (nộp bài)
exports.createSubmission = async (req, res) => {
  try {
    const { topicId, answers, startedAt, submittedAt } = req.body;

    if (!topicId) {
      return res.status(400).json({ success: false, message: "Thiếu topicId của bài thi" });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Dữ liệu câu trả lời không hợp lệ" });
    }

    // 1. Lấy tất cả câu hỏi của chủ đề này từ cơ sở dữ liệu
    const totalQuestions = await Question.find({ topicId });
    if (totalQuestions.length === 0) {
      return res.status(400).json({ success: false, message: "Chủ đề này hiện chưa có câu hỏi nào" });
    }

    // 2. Kiểm tra ràng buộc: BẮT BUỘC thí sinh phải trả lời đầy đủ 100% câu hỏi
    const answeredMap = new Map();
    for (const ans of answers) {
      if (ans.questionId && ans.selectedAnswer) {
        answeredMap.set(ans.questionId.toString(), ans.selectedAnswer);
      }
    }

    const uncompletedQuestions = totalQuestions.filter(
      (q) => !answeredMap.has(q._id.toString()) || !['A', 'B', 'C', 'D'].includes(answeredMap.get(q._id.toString()))
    );

    if (uncompletedQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Bạn bắt buộc phải hoàn thành toàn bộ ${totalQuestions.length} câu hỏi trước khi nộp bài. Còn ${uncompletedQuestions.length} câu chưa trả lời.`,
        remainingCount: uncompletedQuestions.length,
      });
    }

    // 3. Khởi tạo và lưu submission
    const submission = new Submission({
      userId: req.user.id,
      topicId,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
    });

    await submission.save();

    let correctCount = 0;

    // 4. Lưu chi tiết từng câu trả lời theo snapshot
    for (const question of totalQuestions) {
      const selectedAnswer = answeredMap.get(question._id.toString());
      const isCorrect = selectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      const submissionAnswer = new SubmissionAnswer({
        submissionId: submission._id,
        questionId: question._id,
        question: question.question,
        answers: question.answers,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });

      await submissionAnswer.save();
    }

    submission.score = correctCount;
    await submission.save();

    res.status(201).json({
      success: true,
      message: "Nộp bài thành công",
      submissionId: submission._id,
      score: correctCount,
      totalQuestions: totalQuestions.length,
    });
  } catch (err) {
    console.error("Lỗi khi nộp bài:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi nộp bài",
      error: err.message,
    });
  }
};

// exports.updateSubmission = async (req, res) => {
//   try {
//     const updated = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi khi cập nhật submission", error: err.message });
//   }
// };

exports.updateSubmission = async (req, res) => {
  try {
    const { id } = req.params; // submissionId
    const { answers, score } = req.body;

    // Tìm submission theo id
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Không tìm thấy submission" });
    }

    // Nếu có cập nhật điểm (score) thì cho phép cập nhật
    if (typeof score === "number") {
      submission.score = score;
    }

    // Nếu có cập nhật đáp án (answers) thì xử lý
    if (answers && Array.isArray(answers)) {
      // Xóa toàn bộ đáp án cũ của submission
      await SubmissionAnswer.deleteMany({ submissionId: submission._id });

      let correctCount = 0;

      // Tạo lại đáp án mới dựa trên input
      for (const ans of answers) {
        const question = await Question.findById(ans.questionId);
        if (!question) continue;

        const isCorrect = ans.selectedAnswer === question.correctAnswer;
        if (isCorrect) correctCount++;

        const submissionAnswer = new SubmissionAnswer({
          submissionId: submission._id,
          questionId: question._id,
          question: question.question,
          answers: question.answers,
          selectedAnswer: ans.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect
        });

        await submissionAnswer.save();
      }

      // Nếu không gửi score thủ công thì tự tính lại
      if (score === undefined) {
        submission.score = correctCount;
      }
    }

    await submission.save();

    res.json({
      success: true,
      message: "Cập nhật submission thành công",
      submissionId: submission._id,
      score: submission.score
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi cập nhật submission",
      error: err.message
    });
  }
};

// ==========================================
// ADMIN CONTROLLERS: Quản lý bài thi & Thống kê
// ==========================================

// Lấy danh sách toàn bộ bài thi của tất cả học sinh (có tìm kiếm, lọc, sắp xếp)
exports.getAllSubmissionsAdmin = async (req, res) => {
  try {
    const { search, topicId, grade, sortBy } = req.query;

    const query = {};
    if (topicId) {
      query.topicId = topicId;
    }

    const submissions = await Submission.find(query)
      .populate("userId", "_id fullname email role avatar")
      .populate("topicId", "_id title description")
      .sort({ submittedAt: -1 });

    // Gắn thêm thông tin chi tiết: số câu hỏi, thời gian làm, xếp loại
    let results = await Promise.all(
      submissions.map(async (sub) => {
        const answers = await SubmissionAnswer.find({ submissionId: sub._id });
        const totalQuestions = answers.length || 1;
        const score = typeof sub.score === "number" ? sub.score : 0;
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        let gradeType = "failed";
        if (percentage >= 80) gradeType = "excellent";
        else if (percentage >= 50) gradeType = "passed";

        let durationSeconds = 0;
        if (sub.startedAt && sub.submittedAt) {
          durationSeconds = Math.max(0, Math.round((new Date(sub.submittedAt) - new Date(sub.startedAt)) / 1000));
        }

        return {
          _id: sub._id,
          user: {
            _id: sub.userId?._id || "",
            fullname: sub.userId?.fullname || "Học sinh ẩn danh",
            email: sub.userId?.email || "N/A",
            role: sub.userId?.role || "USER",
            avatar: sub.userId?.avatar || "",
          },
          topic: {
            _id: sub.topicId?._id || "",
            title: sub.topicId?.title || "Chủ đề đã xóa",
            description: sub.topicId?.description || "",
          },
          score,
          totalQuestions,
          percentage,
          gradeType, // 'excellent' | 'passed' | 'failed'
          startedAt: sub.startedAt,
          submittedAt: sub.submittedAt,
          durationSeconds,
        };
      })
    );

    // Lọc theo từ khóa tìm kiếm (tên, email, chủ đề)
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      results = results.filter((item) =>
        item.user.fullname.toLowerCase().includes(s) ||
        item.user.email.toLowerCase().includes(s) ||
        item.topic.title.toLowerCase().includes(s)
      );
    }

    // Lọc theo xếp loại
    if (grade && grade !== "all") {
      results = results.filter((item) => item.gradeType === grade);
    }

    // Sắp xếp
    if (sortBy === "score_asc") {
      results.sort((a, b) => a.percentage - b.percentage);
    } else if (sortBy === "score_desc") {
      results.sort((a, b) => b.percentage - a.percentage);
    } else if (sortBy === "duration_asc") {
      results.sort((a, b) => a.durationSeconds - b.durationSeconds);
    } else if (sortBy === "duration_desc") {
      results.sort((a, b) => b.durationSeconds - a.durationSeconds);
    } else if (sortBy === "oldest") {
      results.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    } else {
      // default: newest
      results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    res.json({
      success: true,
      total: results.length,
      data: results,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách submissions admin:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bài làm của người dùng",
      error: err.message,
    });
  }
};

// Tổng hợp báo cáo thống kê kết quả thi toàn hệ thống
exports.getAdminSubmissionStats = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("userId", "_id fullname email")
      .populate("topicId", "_id title")
      .sort({ submittedAt: -1 });

    const totalSubmissions = submissions.length;
    const uniqueUserIds = new Set();
    let totalScoreSum = 0;
    let totalQuestionsSum = 0;
    let passCount = 0;
    let excellentCount = 0;

    const topicStatsMap = new Map();
    const scoreBrackets = {
      bracket0_20: 0,
      bracket21_40: 0,
      bracket41_60: 0,
      bracket61_80: 0,
      bracket81_100: 0,
    };

    const details = await Promise.all(
      submissions.map(async (sub) => {
        if (sub.userId?._id) {
          uniqueUserIds.add(sub.userId._id.toString());
        }

        const answers = await SubmissionAnswer.find({ submissionId: sub._id });
        const totalQuestions = answers.length || 1;
        const score = typeof sub.score === "number" ? sub.score : 0;
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        totalScoreSum += score;
        totalQuestionsSum += totalQuestions;

        if (percentage >= 50) passCount++;
        if (percentage >= 80) excellentCount++;

        // Phân bố phổ điểm
        if (percentage <= 20) scoreBrackets.bracket0_20++;
        else if (percentage <= 40) scoreBrackets.bracket21_40++;
        else if (percentage <= 60) scoreBrackets.bracket41_60++;
        else if (percentage <= 80) scoreBrackets.bracket61_80++;
        else scoreBrackets.bracket81_100++;

        // Thống kê theo từng chủ đề
        const tId = sub.topicId?._id ? sub.topicId._id.toString() : "unknown";
        const tTitle = sub.topicId?.title || "Chủ đề khác";

        if (!topicStatsMap.has(tId)) {
          topicStatsMap.set(tId, {
            topicId: tId,
            topicTitle: tTitle,
            attempts: 0,
            totalScore: 0,
            totalQuestions: 0,
            passedAttempts: 0,
          });
        }
        const tStat = topicStatsMap.get(tId);
        tStat.attempts++;
        tStat.totalScore += score;
        tStat.totalQuestions += totalQuestions;
        if (percentage >= 50) tStat.passedAttempts++;

        return {
          _id: sub._id,
          candidateName: sub.userId?.fullname || "Học sinh ẩn danh",
          candidateEmail: sub.userId?.email || "N/A",
          topicTitle: tTitle,
          score,
          totalQuestions,
          percentage,
          submittedAt: sub.submittedAt,
        };
      })
    );

    const averageScorePercent = totalQuestionsSum > 0
      ? Math.round((totalScoreSum / totalQuestionsSum) * 100)
      : 0;

    const passRate = totalSubmissions > 0
      ? Math.round((passCount / totalSubmissions) * 100)
      : 0;

    const excellentRate = totalSubmissions > 0
      ? Math.round((excellentCount / totalSubmissions) * 100)
      : 0;

    const topicStats = Array.from(topicStatsMap.values()).map((t) => ({
      topicId: t.topicId,
      topicTitle: t.topicTitle,
      attempts: t.attempts,
      avgPercentage: t.totalQuestions > 0 ? Math.round((t.totalScore / t.totalQuestions) * 100) : 0,
      passRate: t.attempts > 0 ? Math.round((t.passedAttempts / t.attempts) * 100) : 0,
    }));

    res.json({
      success: true,
      data: {
        totalSubmissions,
        totalCandidates: uniqueUserIds.size,
        averageScorePercent,
        passRate,
        excellentRate,
        scoreBrackets,
        topicStats,
        recentAttempts: details.slice(0, 5),
      },
    });
  } catch (err) {
    console.error("Lỗi khi lấy thống kê admin submissions:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy dữ liệu thống kê bài thi",
      error: err.message,
    });
  }
};

// Xem chi tiết bài thi của thí sinh
exports.getAdminSubmissionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate("userId", "_id fullname email role avatar")
      .populate("topicId", "_id title description");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài làm này" });
    }

    const submissionAnswers = await SubmissionAnswer.find({ submissionId: id });

    const questions = submissionAnswers.map((ans) => ({
      _id: ans.questionId || ans._id,
      question: ans.question,
      answers: ans.answers || [],
      correctAnswer: ans.correctAnswer,
      selectedAnswer: ans.selectedAnswer,
      isCorrect: ans.isCorrect,
    }));

    const totalQuestions = submissionAnswers.length;
    const score = submission.score || 0;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    let durationSeconds = 0;
    if (submission.startedAt && submission.submittedAt) {
      durationSeconds = Math.max(0, Math.round((new Date(submission.submittedAt) - new Date(submission.startedAt)) / 1000));
    }

    res.json({
      success: true,
      data: {
        _id: submission._id,
        user: {
          _id: submission.userId?._id || "",
          fullname: submission.userId?.fullname || "Học sinh ẩn danh",
          email: submission.userId?.email || "N/A",
          avatar: submission.userId?.avatar || "",
        },
        topic: {
          _id: submission.topicId?._id || "",
          title: submission.topicId?.title || "Bài thi trắc nghiệm",
          description: submission.topicId?.description || "",
        },
        startedAt: submission.startedAt,
        submittedAt: submission.submittedAt,
        durationSeconds,
        score,
        totalQuestions,
        percentage,
        questions,
      },
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết bài làm admin:", err);
    res.status(500).json({ success: false, message: "Lỗi khi lấy chi tiết bài làm", error: err.message });
  }
};

// Xóa bài làm của thí sinh
exports.deleteSubmissionAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài làm cần xóa" });
    }

    await SubmissionAnswer.deleteMany({ submissionId: id });
    await Submission.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Đã xóa lượt làm bài thi thành công",
    });
  } catch (err) {
    console.error("Lỗi khi xóa submission admin:", err);
    res.status(500).json({ success: false, message: "Lỗi khi xóa bài làm", error: err.message });
  }
};