import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { putTopic } from "../../../services/topicService";

function EditTopic({ item, onClose, onReload, setShowNotify, setMessage, setSeverity }) {
  const [btnLoading, setBtnLoading] = useState(false)

  const [title, setTitle] = useState(""); // title - tên chủ đề
  const [description, setDescription] = useState(""); // description - mô tả

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    }
  }, [item]);

  const handleSubmit = async () => {
    setBtnLoading(true);
    try {
      const result = await putTopic(item._id, { title, description });

      setShowNotify(true);
      setMessage(result.message);
      setSeverity(result.success ? "success" : "error");

      setTimeout(() => {
        setShowNotify(false);
      }, 3000);

      if (result.success) {
        onReload?.();
        onClose?.();
      } else {
        setBtnLoading(false);
      }

    } catch (error) {
      console.error("Lỗi:", error);
      setShowNotify(true);
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
      setSeverity("error");

      setTimeout(() => {
        setShowNotify(false);
      }, 3000);
      setBtnLoading(false);
    }
  };

  return (
    <>
      <div className="overlay">
        <div className="form-container">
          <h2 className="form-title">Sửa chủ đề</h2>

          <div className="form-group">
            <label className="form-label">Tên chủ đề</label>
            <input
              type="text"
              placeholder="Nhập tên chủ đề"
              className="form-input"
              value={title}
              onChange={(e) => { setTitle(e.target.value); console.log(e.target.value) }}
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

export default EditTopic;