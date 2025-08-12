const mongoose = require("mongoose");

const submissionAnswerSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  // Lưu câu hỏi và đáp án khi, câu hỏi khi trả lời tránh khi thêm/sửa/xóa câu hỏi sẽ thay đổi dữ liệu
  question: { type: String, required: true },
  answers: [
    {
      key: { type: String, enum: ["A", "B", "C", "D"], required: true },
      text: { type: String, required: true }
    }
  ],
  selectedAnswer: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  correctAnswer: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  isCorrect: { type: Boolean, required: true }
});

module.exports = mongoose.model("SubmissionAnswer", submissionAnswerSchema);