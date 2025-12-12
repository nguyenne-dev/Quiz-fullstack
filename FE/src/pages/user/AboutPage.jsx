import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Zap, Shield, Heart, ArrowRight, BookOpen, Users } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '880px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', margin: '30px 0 50px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> VỀ CHÚNG TÔI
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
          Đổi Mới Trải Nghiệm <br />
          <span className="gradient-text">Học Tập & Đánh Giá Năng Lực</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
          EduExam Platform được xây dựng với mục tiêu cung cấp một nền tảng thi trắc nghiệm trực tuyến chuẩn mực, nhanh chóng, chính xác và trực quan nhất cho mọi người học.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        <div className="glass-card" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Target size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Sứ Mệnh</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Cung cấp công cụ ôn luyện, tự kiểm tra kiến thức hiệu quả và không giới hạn, giúp người học phát hiện lỗ hổng và nâng cao trình độ từng ngày.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--info-bg)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Zap size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Công Nghệ Tiên Tiến</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Ứng dụng kiến trúc hiện đại, xử lý tức thì, giao diện tối ưu trên mọi kích thước màn hình và bảng thống kê kết quả trực quan.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="glass-card" style={{ padding: '40px', backgroundColor: 'var(--bg-surface)', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
          Giá Trị Cốt Lõi
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
              1. Minh Bạch & Chính Xác
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Mọi câu hỏi và đáp án đều được rà soát kỹ lưỡng, thuật toán chấm điểm tự động tức thời và rõ ràng.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--success)', marginBottom: '8px' }}>
              2. Tối Ưu Trải Nghiệm
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Không quảng cáo phiền toái, tốc độ tải trang cực nhanh, giao diện thân thiện với mắt người dùng.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '8px' }}>
              3. Phát Triển Bền Vững
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Liên tục cập nhật thêm nhiều chủ đề mới và các tính năng hỗ trợ học tập đắc lực.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>
          Bắt đầu hành trình kiểm tra kiến thức của bạn ngay hôm nay!
        </h3>
        <Link to="/topics" className="btn btn-primary btn-lg">
          Khám phá danh mục bài thi <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;
