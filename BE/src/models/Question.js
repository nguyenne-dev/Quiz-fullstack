// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
//   question: { type: String, required: true },
//   answers: { type: [String], required: true },
//   correctAnswer: { type: Number, required: true, min: 0 }
// });

// module.exports = mongoose.model("Question", questionSchema);
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },

  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      questionText: { type: String, required: true },
      answers: { type: [String], required: true },        // danh sách đáp án hiển thị
      correctAnswer: { type: Number, required: true },     // chỉ số đúng
      userAnswer: { type: Number, required: true },        // chỉ số người dùng chọn
      isCorrect: { type: Boolean, required: true }
    }
  ],

  score: { type: Number, required: true },   // tổng điểm (hoặc số câu đúng)
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);
