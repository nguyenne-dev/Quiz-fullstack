const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },

  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  questionText: { type: String, required: true },

  answers: { type: [String], required: true }, // danh sách đáp án hiển thị khi người dùng làm
  correctAnswer: { type: Number, required: true }, // chỉ số đáp án đúng (ví dụ 1)(index: 1)
  userAnswer: { type: Number, required: true }, // chỉ số người dùng chọn

  isCorrect: { type: Boolean, required: true }, // tiện cho lọc đúng/sai nhanh
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Answer", answerSchema);