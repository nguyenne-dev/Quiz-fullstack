import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, Mail, Globe, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '80px',
        paddingTop: '60px',
        paddingBottom: '30px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '50px',
          }}
        >
          {/* Brand Col */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
              }}>
                <Sparkles size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                Edu<span className="gradient-text">Exam</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Nền tảng kiểm tra kiến thức trắc nghiệm trực tuyến thông minh, tốc độ cao, hỗ trợ đa dạng chủ đề và bảng tổng kết chi tiết.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px' }}>Điều Hướng</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Link to="/" style={{ transition: 'color var(--transition-fast)' }}>Trang chủ</Link>
              <Link to="/topics" style={{ transition: 'color var(--transition-fast)' }}>Chủ đề thi trắc nghiệm</Link>
              <Link to="/about" style={{ transition: 'color var(--transition-fast)' }}>Về chúng tôi</Link>
              <Link to="/contact" style={{ transition: 'color var(--transition-fast)' }}>Hỗ trợ & Liên hệ</Link>
            </div>
          </div>

          {/* Topics Preview */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px' }}>Chủ Đề Nổi Bật</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Link to="/topics">Lập Trình Web (HTML, CSS, JS)</Link>
              <Link to="/topics">React & Frontend Ecosystem</Link>
              <Link to="/topics">Node.js & Backend Architecture</Link>
              <Link to="/topics">Cơ Sở Dữ Liệu & SQL/NoSQL</Link>
            </div>
          </div>

          {/* System Info */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px' }}>Hệ Thống</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot online"></span>
                <span>Trạng thái: <strong>Hoạt động ổn định</strong></span>
              </div>
              <p>Phiên bản: <strong>EduExam v2.0</strong></p>
              <p>Thời gian phản hồi: <strong>&lt; 50ms</strong></p>
              <p>Bảo mật: <strong>JWT Authentication</strong></p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            color: 'var(--text-subtle)',
            fontSize: '0.85rem',
          }}
        >
          <p>© {new Date().getFullYear()} EduExam Platform. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Xây dựng với <Heart size={14} color="var(--danger)" fill="var(--danger)" /> bởi Đội ngũ EduExam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
