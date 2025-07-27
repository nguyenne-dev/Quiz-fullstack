"use client";
import React, { useState } from "react";
import "./register.css";
import { send_verify_mail } from "../../../services/authService";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const router = useRouter();
  const [isloading, setIsloading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    gender: "",
    dob: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const result = await send_verify_mail(formData);
      console.log(result);
      if(result.success){
        alert("Vui lòng kiểm tra email để xác nhận!");
        router.push("/verify")
      }else{
        alert(`Đăng ký thất bại! Lỗi: ${result.message}`);
        setIsloading(false);
      }
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      setIsloading(false);
    }
  };
  
  console.log(formData)

  return (
    <div className="minimal-container">
      <form onSubmit={handleSubmit} className="minimal-form">
        <h2 className="form-title">Đăng Ký</h2>

        <input type="text" name="fullname" placeholder="Họ và tên" required onChange={handleChange} />
        <select name="gender" required onChange={handleChange}>
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
        <input type="date" name="dob" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Mật khẩu" required onChange={handleChange} />

        {!isloading?<button type="submit" className="submit-button">Đăng ký</button>:
        <p className="submit-button" style={{ textAlign:"center", userSelect:"none", cursor:"not-allowed" }}>Loading . . .</p>}
        
        <a href="/login">Đã có tài khoản? Đăng nhập ngay</a>
      </form>
    </div>
  );
}