const Submission = require("../models/Submission");
const SubmissionAnswer = require("../models/SubmissionAnswer");
const Question = require("../models/Question");


// Lấy tất cả submissions (bài nộp) của người dùng đang đăng nhập
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).populate("topicId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy submissions", error: err.message });
  }
};


// Tạo submission mới (nộp bài)
exports.createSubmission = async (req, res) => {
  try {
    // Lấy dữ liệu từ body
    const { topicId, answers, startedAt, submittedAt } = req.body;

    const submission = new Submission({
      userId: req.user._id,
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

exports.updateSubmission = async (req, res) => {
  try {
    const updated = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật submission", error: err.message });
  }
};