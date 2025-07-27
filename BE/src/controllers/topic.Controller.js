const Topic = require("../models/Topic");
const Question = require("../models/Question");

const getAllTopic = async (req, res) => {
  try {
    // Lấy danh sách topic
    const topics = await Topic.find();
    return res.status(200).json({ success: true, message: "Lấy dữ liệu thành công", topics });

  } catch (error) {
    console.error("Lỗi khi lấy danh sách chủ đề:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const addTopic = async (req, res) => {
  try {
    // Kiểm tra đầu vào
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Thiếu tiêu đề hoặc mô tả, vui lòng nhập đầy đủ" });
    }

    // Thêm chủ đề
    const newTopic = new Topic({
      title: title,
      description: description
    });
    await newTopic.save()
    return res.status(201).json({ success: true, message: "Đã thêm thành công" })
  } catch (error) {
    console.error("Lỗi khi thêm chủ đề:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" })
  }
}

const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Kiểm tra đầu vào
    if (!id || !title || !description) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ tiêu đề và mô tả" });
    }

    // Cập nhật chủ đề
    const updated = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy chủ đề cần cập nhật" });
    }

    return res.status(200).json({ success: true, message: "Cập nhật thành công", topic: updated });

  } catch (error) {
    console.error("Lỗi khi cập nhật chủ đề:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Thiếu ID chủ đề cần xóa" });
    }

    // Kiểm tra xem có câu hỏi nào đang dùng topic này không
    const questionCount = await Question.countDocuments({ topicId: id });
    if (questionCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa. Chủ đề này đang được sử dụng trong câu hỏi."
      });
    }

    // Xóa chủ đề
    const updated = await Topic.findByIdAndDelete(id);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy chủ đề cần xóa" });
    }

    return res.status(200).json({ success: true, message: "Xóa thành công" });

  } catch (error) {
    console.error("Lỗi khi xóa chủ đề:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


module.exports = {
  getAllTopic,
  addTopic,
  updateTopic,
  deleteTopic,
}