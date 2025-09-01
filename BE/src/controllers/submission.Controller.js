const Submission = require("../models/Submission");
const SubmissionAnswer = require("../models/SubmissionAnswer");
const Question = require("../models/Question");


exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id }).populate("topicId");

    // Dùng Promise.all để lấy thêm answers cho từng submission
    const submissionsWithDetails = await Promise.all(
      submissions.map(async (submission) => {
        const answers = await SubmissionAnswer.find({ submissionId: submission._id });
        return {
          ...submission.toObject(),
          totalQuestions: answers.length,
        };
      })
    );

    res.json(submissionsWithDetails);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy submissions", error: err.message });
  }
};

// Lấy chi tiết 1 submission theo id
exports.getSubmissions = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy submission kèm topic (_id, title)
    const submission = await Submission.findById(id)
      .populate("topicId", "_id title");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Không tìm thấy submission" });
    }

    // Kiểm tra quyền sở hữu submission
    if (submission.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
    }

    // Lấy answers của submission này, populate thêm thông tin question
    const submissionAnswers = await SubmissionAnswer.find({ submissionId: id })
      .populate("questionId", "question answers correctAnswer");
    // question: nội dung câu hỏi, answers: các đáp án, correctAnswer: đáp án đúng

    // Format lại dữ liệu
    const answers = submissionAnswers.map(ans => ({
      questionId: ans.questionId._id,
      selectedAnswer: ans.selectedAnswer,
    }));

    const questions = submissionAnswers.map(ans => ({
      _id: ans.questionId._id,
      question: ans.questionId.question,
      answers: ans.questionId.answers,
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
        topicId: submission.topicId._id,
        topicTitle: submission.topicId.title,
        questions,
        score: submission.score,
        totalQuestions: submissionAnswers.length,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy submission", error: err.message });
  }
};


// Tạo submission mới (nộp bài)
exports.createSubmission = async (req, res) => {
  try {
    // Lấy dữ liệu từ body
    const { topicId, answers, startedAt, submittedAt } = req.body;

    const submission = new Submission({
      userId: req.user.id,
      topicId,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
    });

    // Lưu submission
    await submission.save();

    // Tạo 1 biến đếm đáp án đúng
    let correctCount = 0;

    // Lặp qua từng câu trả lời người dùng gửi lên
    for (const ans of answers) {
      // Tìm câu hỏi gốc trong database
      const question = await Question.findById(ans.questionId);
      // Nếu không tìm thấy câu hỏi thì bỏ qua
      if (!question) continue;

      const isCorrect = ans.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      /* Tạo đối tượng SubmissionAnswer để lưu từng câu trả lời đầy đủ thông tin
      tránh sau này sửa câu hỏi làm lỗi cho bài làm hiện tại*/
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

    submission.score = correctCount;
    await submission.save();

    res.status(201).json({
      success: true,
      message: "Nộp bài thành công",
      submissionId: submission._id,
      score: correctCount,
    });
  } catch (err) {
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