'use client'
import './layout.css'
import Cookies from 'js-cookie';
import { FaUser } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
export default function LayoutUser({ children }) {

  const [isLogin, setIsLogin] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = Cookies.get('token');
  const _id = Cookies.get('_id');
  const userMenuRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pathname = usePathname(); // Lấy đường dẫn /URL

  useEffect(() => {
    setIsLogin(token && _id);
  }, [token, _id]);

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  // 👉 Hàm logout
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('_id');
    window.location.href = '/login';
  };

  // 👉 Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLinkClick = (e, href) => {
    if (pathname !== href) {
      setLoading(true);
    } else {
      e.preventDefault(); // chặn tải lại nếu bấm trang đang mở
    }
  };


  return (
    <>
      {loading && <div className="result-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>}
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <a href="/" className="logo">
            <div className="logo-icon">🧠</div>
            QUIZ
          </a>
          <nav>
            <ul className="nav-menu">
              <li>
                <a href="/" onClick={(e) => handleLinkClick(e, "/")} className={pathname === "/" ? "active" : ""}>Trang chủ</a>
              </li>
              <li>
                <a href="/topic" onClick={(e) => handleLinkClick(e, "/topic")} className={pathname.startsWith("/topic") ? "active" : ""}>Danh mục</a>
              </li>
              <li>
                <a href="/#about" onClick={(e) => handleLinkClick(e, "/")} className={pathname.includes("#about") ? "active" : ""}>Giới thiệu</a>
              </li>
              <li>
                <a href="/#contact" onClick={(e) => handleLinkClick(e, "/")} className={pathname.includes("#contact") ? "active" : ""}>Liên hệ</a>
              </li>
            </ul>
            <div
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </nav>
          {isLogin ?
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className="cta-button user-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <FaUser style={{ fontSize: "16px" }} />
              </button>

              {isUserMenuOpen && (
                <div className={`user-dropdown ${isUserMenuOpen ? "show" : ""}`}>
                  <a href="/profile">Trang cá nhân</a>
                  <a href="/submissions">Danh sách bài làm</a>
                  <hr />
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
            :
            <a href="/login" className="cta-button">Đăng nhập</a>
          }

        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="./" onClick={() => setIsMenuOpen(false)}>Trang chủ</a>
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
              <h3>QUIZ</h3>
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
