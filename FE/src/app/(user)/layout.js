'use client'
import './layout.css'
import Cookies from 'js-cookie';
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from 'react';
export default function LayoutUser({ children }) {

  const [isLogin, setIsLogin] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = Cookies.get('token');
  const _id = Cookies.get('_id');

  useEffect(() => {
    setIsLogin(token && _id);
  }, [token, _id]);
  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <a href="/" className="logo">
            <div className="logo-icon">🧠</div>
            QuizMasterVN
          </a>
          <nav>
            <ul className="nav-menu">
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/topic">Danh mục</a></li>
              <li><a href="/#about">Giới thiệu</a></li>
              <li><a href="/#contact">Liên hệ</a></li>
            </ul>
            {/* <div className="hamburger" id="hamburger">
             */}
            <div
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </nav>
          {isLogin ? <a href="/profile" className="cta-button"><FaUser style={{ fontSize: "16px" }} /></a> : <a href="/login" className="cta-button">Đăng nhập</a>}
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="" onClick={() => setIsMenuOpen(false)}>Trang chủ</a>
          <a href="/topic" onClick={() => setIsMenuOpen(false)}>Danh mục</a>
          <a href="/#about" onClick={() => setIsMenuOpen(false)}>Giới thiệu</a>
          <a href="/#contact" onClick={() => setIsMenuOpen(false)}>Liên hệ</a>
        </div>
      </header>


      <main>
        {children}
      </main>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>QuizMasterVN</h3>
              <p style={{ color: '#d1d5db', marginBottom: '20px' }}>Nền tảng học tập trực tuyến hàng đầu Việt Nam, giúp bạn nâng
                cao kiến thức một cách hiệu quả.</p>
            </div>
            <div className="footer-section">
              <h3>Sản phẩm</h3>
              <ul>
                <li><a href="#">Bài thi trắc nghiệm</a></li>
                <li><a href="#">Khóa học online</a></li>
                <li><a href="#">Chứng chỉ</a></li>
                <li><a href="#">Ứng dụng mobile</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Hỗ trợ</h3>
              <ul>
                <li><a href="#">Trung tâm trợ giúp</a></li>
                <li><a href="#">Hướng dẫn sử dụng</a></li>
                <li><a href="#">Liên hệ</a></li>
                <li><a href="#">Báo lỗi</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Công ty</h3>
              <ul>
                <li><a href="#">Về chúng tôi</a></li>
                <li><a href="#">Tuyển dụng</a></li>
                <li><a href="#">Tin tức</a></li>
                <li><a href="#">Đối tác</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Nguyễn Trung Nguyên. Tất cả quyền được bảo lưu. | Điều khoản sử dụng | Chính sách bảo mật</p>
          </div>
        </div>
      </footer>
    </>
  );
}
