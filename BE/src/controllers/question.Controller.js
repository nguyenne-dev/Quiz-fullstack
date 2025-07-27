const Question = require("../models/Question")

const addQuestion = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Lỗi khi lấy thêm câu hỏi:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
}

module.exports = {
  addQuestion
}