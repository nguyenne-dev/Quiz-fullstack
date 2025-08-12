const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  startedAt: { type: Date, default: Date.now },  // thời điểm bắt đầu làm bài
  submittedAt: { type: Date },                   // thời điểm nộp bài
  score: { type: Number },                       // tổng điểm đạt được
});

module.exports = mongoose.model("Submission", submissionSchema);