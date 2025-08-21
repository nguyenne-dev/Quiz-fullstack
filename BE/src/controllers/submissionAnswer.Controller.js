const SubmissionAnswer = require("../models/SubmissionAnswer");

exports.getAllSubmissionAnswers = async (req, res) => {
  try {
    const answers = await SubmissionAnswer.find({}).populate("questionId").populate("submissionId");
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy answers", error: err.message });
  }
};

exports.createSubmissionAnswer = async (req, res) => {
  try {
    const answer = new SubmissionAnswer(req.body);
    await answer.save();
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo answer", error: err.message });
  }
};

exports.updateSubmissionAnswer = async (req, res) => {
  try {
    const updated = await SubmissionAnswer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật answer", error: err.message });
  }
};