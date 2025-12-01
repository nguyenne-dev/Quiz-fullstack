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