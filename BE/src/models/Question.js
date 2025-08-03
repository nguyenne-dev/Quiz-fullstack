const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  question: { type: String, required: true },
  answers: {
    type: [
      {
        key: { type: String, enum: ["A", "B", "C", "D"], required: true },
        text: { type: String, required: true }
      }
    ],
    validate: [arr => arr.length >= 2, 'Phải có ít nhất 2 đáp án']
  },
  correctAnswer: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  }
});

module.exports = mongoose.model("Question", questionSchema);