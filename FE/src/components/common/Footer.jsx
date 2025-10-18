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
                Quiz<span className="gradient-text">Master</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Nền tảng kiểm tra kiến thức trắc nghiệm trực tuyến thông minh, tốc độ cao, hỗ trợ đa dạng chủ đề và bảng tổng kết chi tiết.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://github.com/nguyenne-dev/Quiz-fullstack"
                target="_blank"
                rel="noreferrer"
                className="btn-icon btn-secondary"
                style={{ width: '36px', height: '36px' }}
                title="GitHub Repo"
              >
                <Github size={16} />
              </a>
              <Link
                to="/contact"
                className="btn-icon btn-secondary"
                style={{ width: '36px', height: '36px' }}
                title="Liên hệ"
              >
                <Mail size={16} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Khám phá</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/topics" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                Tất cả chủ đề
              </Link>
              <Link to="/submissions" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Lịch sử thi
              </Link>
              <Link to="/profile" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Tài khoản cá nhân
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Thông tin</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Giới thiệu dự án
              </Link>
              <Link to="/contact" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Hỗ trợ & Liên hệ
              </Link>
              <Link to="/verify" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Kích hoạt tài khoản
              </Link>
            </div>
          </div>

          {/* Quick Newsletter / CTA */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Bắt đầu làm bài</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Tham gia ngay hôm nay để thử thách kiến thức và theo dõi sự tiến bộ!
            </p>
            <Link to="/topics" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              Luyện tập ngay <ArrowRight size={16} />
            </Link>
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
          <p>© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Xây dựng với <Heart size={14} color="var(--danger)" fill="var(--danger)" /> bởi Đội ngũ QuizMaster
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
