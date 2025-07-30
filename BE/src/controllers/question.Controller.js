const mongoose = require("mongoose");
const Question = require("../models/Question")
const Topic = require("../models/Topic");


// Lấy câu hỏi theo chủ đề
const getQuestionTopic = async (req, res) => {
  try {
    const { topicId } = req.query;

    // Kiểm tra thiếu topicId
    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu topicId"
      });
    }

    // Kiểm tra topicId có phải ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ success: false, message: "topicId không hợp lệ" });
    }

    // Kiểm tra topicId có tồn tại không
    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return res.status(404).json({ success: false, message: "Không tìm thấy chủ đề" });
    }

    // Lấy danh sách câu hỏi theo topic
    const questions = await Question.find({ topicId });

    return res.status(200).json({ success: true, message: "Lấy dữ liệu thành công", questions });

  } catch (error) {
    console.error("Lỗi khi lấy danh sách câu hỏi:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
};


// Lấy tất cả câu hỏi cho admin
const getQuestion = async (req, res) => {
  try {

    // Lấy danh sách tất cả câu hỏi
    const questions = await Question.find();

    return res.status(200).json({ success: true, message: "Lấy dữ liệu thành công", questions });

  } catch (error) {
    console.error("Lỗi khi lấy danh sách câu hỏi:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { topicId, question, answers, correctAnswer } = req.body;

    // Kiểm tra đầu vào
    if (!topicId || !question || !Array.isArray(answers) || !correctAnswer) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    if (answers.length < 2) {
      return res.status(400).json({ success: false, message: "Phải có ít nhất 2 đáp án" });
    }

    if (answers.length > 4) {
      return res.status(400).json({ success: false, message: "Tối đa có 4 đáp án" });
    }

    const validKeys = ["A", "B", "C", "D"];

    for (const answer of answers) {
      if (!validKeys.includes(answer.key)) {
        return res.status(400).json({ success: false, message: "Đáp án chỉ có thể là A, B, C hoặc D" });
      }
    }

    // Kiểm tra correctAnswer có tồn tại trong danh sách answers
    const answerKeys = answers.map(a => a.key);
    if (!answerKeys.includes(correctAnswer)) {
      return res.status(400).json({ success: false, message: "Đáp án đúng không hợp lệ" });
    }

    // Tạo câu hỏi
    const newQuestion = new Question({
      topicId,
      question,
      answers,
      correctAnswer
    });

    await newQuestion.save();

    return res.status(201).json({ success: true, message: "Thêm câu hỏi thành công", data: newQuestion });

  } catch (error) {
    console.error("Lỗi khi thêm câu hỏi:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Thiếu id câu hỏi" });
    }

    const result = await Question.findByIdAndUpdate(id, req.body, { new: true });

    if (result) {
      return res.status(200).json({ success: true, message: "Đã sửa thành công!", data: result });
    } else {
      return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật câu hỏi:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};



const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Thiếu id câu hỏi" });
    }

    const result = await Question.findByIdAndDelete(id);

    if (result) {
      return res.status(200).json({ success: true, message: "Đã xóa thành công!" });
    } else {
      return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
    }
  } catch (error) {
    console.error("Lỗi khi xóa câu hỏi:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = {
  getQuestion, // Lấy all chỉ admin
  getQuestionTopic,
  addQuestion,
  updateQuestion,
  deleteQuestion
}