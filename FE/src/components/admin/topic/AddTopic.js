import { useState } from "react";
import { createTopic } from "../../../services/topicService";
import { Button, CircularProgress } from "@mui/material";

function AddTopicForm({ onClose, onReload, setShowNotify, setMessage, setSeverity }) {

  const [btnLoading, setBtnLoading] = useState(false)

  // State để lưu tên chủ đề và mô tả
  const [title, setTitle] = useState(""); // title - tên chủ đề
  const [description, setDescription] = useState(""); // description - mô tả

  // // Hàm xử lý khi bấm nút xác nhận
  const handleSubmit = () => {
    setBtnLoading(true);
    if (!title.trim()) {
      setSeverity("error");
      setMessage("Vui lòng nhập tên chủ đề!");
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      setBtnLoading(false);
      return;
    }

    if (!description.trim()) {
      setSeverity("error");
      setMessage("Vui lòng nhập mô tả!");
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      setBtnLoading(false);
      return;
    }

    const fetchApi = async () => {
      const result = await createTopic({ title, description });
      if (result.success) {
        setSeverity("success");
        setMessage(result.message || "Thêm thành công!");
        setShowNotify(true);

        // Reload lại danh sách
        onReload();
        onClose();
        setTimeout(() => { setShowNotify(false); setBtnLoading(false); }, 3000);
      } else {
        setSeverity("error");
        setMessage(result.message || "Đã xảy ra lỗi!");
        setShowNotify(true);
        setTimeout(() => setShowNotify(false), 3000);
        setBtnLoading(false);
      }
    };
    fetchApi();
  };

  return (
    <>
      <div className="overlay">
        <div className="form-container">
          <h2 className="form-title">Thêm chủ đề</h2>

          <div className="form-group">
            <label className="form-label">Tên chủ đề</label>
            <input
              type="text"
              placeholder="Nhập tên chủ đề"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả"
              rows="4"
              className="form-input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-buttons">
            <button className="btn cancel-btn" onClick={onClose}>
              ✖ Hủy bỏ
            </button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={btnLoading}
              sx={{
                padding: '8px 16px',
                width: '150px',
                fontSize: '14px',
                borderRadius: '8px',
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              {btnLoading ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                '✔ Xác nhận'
              )}
            </Button>
          </div>
        </div>
      </div >
    </>
  )
}

export default AddTopicForm;