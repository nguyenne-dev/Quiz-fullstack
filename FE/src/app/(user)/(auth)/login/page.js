"use client"
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import "./login.css"
import { UserLogin } from "../../../../services/authService";
import { useRouter } from 'next/navigation';
import FormForGot from "./FormForGet"
function Login() {
  const [showNotify, setShowNotify] = useState(false);
  const [showFFG, setShowFFG] = useState(false);
  const [message, setMessage] = useState("!");
  const [severity, setSeverity] = useState("success"); // success | error
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();


  useEffect(() => {
    const token = Cookies.get('token');
    const _id = Cookies.get('_id');
    if (token && _id) {
      window.location.href = './'
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault()
    if (formData.email === "" || formData.password === "") {
      setSeverity("error");
      setMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
      setShowNotify(true);
      setIsLoading(false);
      setTimeout(() => setShowNotify(false), 3000);
      return;
    }

    if (formData.password.length < 6) {
      setSeverity("error")
      setMessage("Mật khẩu phải có ít nhất 6 kí tự.")
      setShowNotify(true);
      setIsLoading(false);
      setTimeout(() => setShowNotify(false), 3000);
      return;
    }

    try {
      const result = await UserLogin(formData);
      if (result.success) {
        const { token, user } = result;

        // Lưu token trả về vào cookie
        Cookies.set('token', token, {
          expires: 7,            // lưu trong 7 ngày
          path: '/',
          secure: true,
          sameSite: 'Strict'
        });

        // Lưu user ID
        Cookies.set('_id', user.id, {
          expires: 7,
          path: '/',
          secure: true,
          sameSite: 'Strict'
        });
        setSeverity("success");
        setMessage("Đăng nhập thành công!");
        setShowNotify(true);

        setTimeout(() => {
          setShowNotify(false);
          router.push('/');
        }, 1500);
      } else {
        setIsLoading(false);
        setSeverity("error");
        setMessage(`Sai tài khoản hoặc mật khẩu!`);
        setShowNotify(true);

        setTimeout(() => {
          setShowNotify(false);
        }, 1500);
      }

    } catch (error) {
      setIsLoading(false);
    }
  }
  return (
    <>
      {isLoading && <div className="result-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>}
      <div className="minimal-container">
        {!showFFG &&
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Đăng nhập</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Nhập email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <a href="#" onClick={() => { setShowFFG(true) }}>Quên mật khẩu?</a>

            <hr />
            <a className="register-btn" href="/register">Chưa có tài khoản? Đăng ký ngay</a>
          </form>
        }

        {/* Thông báo lỗi */}
        {showNotify && (
          <div className={`notify notify--${severity}`}>
            {message}
          </div>
        )}

        {/* Form quên mật khẩu */}
        {showFFG &&
          <FormForGot setShow={setShowFFG} />
        }
      </div>
    </>
  )
}

export default Login;