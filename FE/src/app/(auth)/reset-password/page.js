"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './rePass.css';
import { reset_password } from "../../../services/authService";

function ResetPassword() {
  const navigation = useRouter();
  const params = useSearchParams();
  const token = params.get("token");


  const [showPassword, setShowPassword] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [message, setMessage] = useState("!");
  const [severity, setSeverity] = useState("success"); // success | error

  const [formData, setFormData] = useState({
    password: "",
    rePassword: ""
  })
  console.log(token)

  if (!token) {
    navigation.push("/login")
  }
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value?.trim() || ""
    }));
  };
  // console.log(formData)

  // Cập nhật newpass
  const handleSubmit = async () => {
    if (formData.password !== formData.rePassword) {
      setShowNotify(true);
      setMessage("Mật khẩu xác nhận không giống nhau");
      setSeverity("error");
      setTimeout(() => {
        setShowNotify(false);
      }, 3000);
      return;
    }
    else {
      const newPassword = formData.password;
      const result = await reset_password(token, { password: newPassword })
      console.log(result)
      if (result.success) {
        setShowNotify(true);
        setMessage("Cập nhật mật khẩu thành công");
        setSeverity("success");
        setTimeout(() => {
          setShowNotify(false);
          navigation.push("/login")
        }, 3000);
        return;
      }
      setShowNotify(true);
      setMessage(`Lỗi: ${result.message}`);
      setSeverity("error");
      setTimeout(() => {
        setShowNotify(false);
      }, 3000);
      return;
    }
  }

  return (
    <div className="rePass-wrapper">
      <div className="rePass">
        {showNotify && (
          <div className={`notify notify--${severity}`}>
            {message}
          </div>
        )}

        <h2 className="rePass__title">Đặt lại mật khẩu</h2>

        <div className="rePass__form">
          <div className="rePass__group">
            <label className="rePass__label">Mật khẩu mới</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={handleChange}
              className="rePass__input"
            />
            <button className='toggle-password-btn' onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>

          <div className="rePass__group">
            <label className="rePass__label">Nhập lại mật khẩu</label>
            <input
              name="rePassword"
              type={showPassword ? "text" : "password"}
              value={formData.rePassword || ""}
              onChange={handleChange}
              className="rePass__input"
            />
          </div>
          <div className="rePass__group" style={{ display: "flex", justifyContent: "end" }}>
            <button className="rePass__button" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword;