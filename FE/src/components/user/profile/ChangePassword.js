"use client"
import { useState } from 'react';
import { updateInfo } from '../../../services/authService';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePassword() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [message, setMessage] = useState("!");
  const [severity, setSeverity] = useState("success"); // success | error

  const [formData, setFormData] = useState({
    password: "",
    rePassword: ""
  });

  //Xác nhận cập nhật mật khẩu
  const handleSubmit = () => {
    // Kiểm tra 2 mật khẩu đã nhập chưa
    if (formData.password === "" || formData.rePassword === "") {
      setSeverity("error");
      setMessage("Vui lòng thông tin đầy đủ để cập nhật!");
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      return;
    }
    // Kiểm tra 2 mật khẩu đã giống
    if (formData.password !== formData.rePassword) {
      setSeverity("error");
      setMessage("Mật khẩu xác nhận không chính xác!");
      setShowNotify(true);
      setTimeout(() => setShowNotify(false), 3000);
      return;
    }

    // Gội API đổi thông tin
    console.log(formData)
    const fetchApi = async () => {
      const newData = { password: formData.password }
      const result = await updateInfo(newData)
      if (result.success) {
        setFormData(result);
        setSeverity("success");
        setMessage("Cập nhật thành công!");
        setShowNotify(true);
        setFormData({ password: "", rePassword: "" });
      } else {
        setSeverity("error");
        setMessage("Cập nhật thất bại!");
        setShowNotify(true);
      }
      setTimeout(() => setShowNotify(false), 3000);
    }; fetchApi();
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value?.trim() || ""
    }));
  };

  return (
    <div className="profile">
      {showNotify && (
        <div className={`notify notify--${severity}`}>
          {message}
        </div>
      )}

      <h2 className="profile__title">Đổi mật khẩu</h2>

      <div className="profile__form">
        <div className="profile__group">
          <label className="profile__label">Mật khẩu mới</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className="profile__input"
          />
          <button className='toggle-password-btn' onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
        </div>

        <div className="profile__group">
          <label className="profile__label">Nhập lại mật khẩu</label>
          <input
            name="rePassword"
            type={showPassword ? "text" : "password"}
            value={formData.rePassword || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className="profile__input"
          />
        </div>

        {!isEditing && (
          <button className="profile__button profile__button--edit" onClick={() => { setIsEditing(true); }}>
            Chỉnh sửa
          </button>
        )}
        {isEditing && (
          <div className='profile__button--groupEdit'>
            <button className="profile__button profile__button--exit" onClick={() => {
              setFormData({ password: "", rePassword: "" }); setIsEditing(false)
            }}>
              Hủy
            </button>
            <button className="profile__button profile__button--save" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;