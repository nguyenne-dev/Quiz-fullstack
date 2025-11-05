import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topicService } from '../../services/topicService';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Brain, 
  Zap, 
  Trophy, 
  Users, 
  BookOpen, 
  TrendingUp,
  Award
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const HomePage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await topicService.getAllTopics();
        setTopics(data.slice(0, 6)); // Lấy tối đa 6 chủ đề nổi bật
      } catch (err) {
        console.error('Lỗi khi tải chủ đề trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '40px' }}>
      
      {/* 1. Hero Section */}
      <section className="container" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '50px',
        }}>
          <div>
            {/* Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '24px',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              <Sparkles size={16} /> NỀN TẢNG THI TRẮC NGHIỆM THẾ HỆ MỚI
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px' }}>
              Kiểm Tra Kiến Thức, <br />
              <span className="gradient-text">Bứt Phá Giới Hạn</span> Của Bạn
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '520px' }}>
              Trải nghiệm các bài thi trắc nghiệm đa lĩnh vực với giao diện mượt mà, phản hồi tức thì và bảng phân tích điểm số chi tiết từng câu hỏi.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link to="/topics" className="btn btn-primary btn-lg">
                Bắt đầu làm bài <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                Tìm hiểu thêm
              </Link>
            </div>

            {/* Micro checklist */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--success)" /> Hoàn toàn miễn phí
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--success)" /> Kết quả chuẩn xác 100%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--success)" /> Lưu lại toàn bộ lịch sử
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '36px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-subtle) 100%)',
                position: 'relative',
                boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {/* Floating feature pills */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
                  }}>
                    <Brain size={24} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>QuizMaster IQ</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thử thách hôm nay</p>
                  </div>
                </div>
                <span className="badge badge-success">MỚI CẬP NHẬT</span>
              </div>

              {/* Sample Question Preview */}
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '14px' }}>
                  ❓ Câu hỏi: JavaScript có phải là ngôn ngữ đơn luồng (Single-threaded) không?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>A. Đúng, chạy trên Event Loop</span>
                    <CheckCircle2 size={16} color="var(--primary)" />
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}>
                    B. Sai, luôn đa luồng song song
                  </div>
                </div>
              </div>

              {/* Bottom stats inside hero card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>100%</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TỐC ĐỘ XỬ LÝ</p>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>Trực quan</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>BÁO CÁO ĐIỂM</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Stats */}
      <section className="container">
        <div
          className="glass-card"
          style={{
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '12px' }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>10+</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Chủ đề đa dạng</p>
          </div>

          <div>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '14px', backgroundColor: 'var(--info-bg)', color: 'var(--info)', marginBottom: '12px' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>500+</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Câu hỏi tuyển chọn</p>
          </div>

          <div>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '14px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', marginBottom: '12px' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>1,000+</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Thí sinh tham gia</p>
          </div>

          <div>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '14px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', marginBottom: '12px' }}>
              <Trophy size={24} />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>99.8%</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Hài lòng về chất lượng</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Topics */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>DANH MỤC HẤP DẪN</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Chủ Đề Thi Nổi Bật</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>Lựa chọn bài thi phù hợp với chuyên môn của bạn</p>
          </div>
          <Link to="/topics" className="btn btn-outline">
            Xem tất cả chủ đề <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Đang tải danh sách chủ đề..." />
        ) : topics.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chưa có chủ đề nào được tạo.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {topics.map((topic, index) => (
              <div
                key={topic._id}
                className="glass-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: index % 2 === 0 ? 'var(--primary-gradient)' : 'var(--accent-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                      <BookOpen size={20} />
                    </div>
                    <span className="badge badge-primary">TRẮC NGHIỆM</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                    {topic.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {topic.description || 'Bài thi trắc nghiệm kiến thức tổng quát và chuyên sâu.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    Thử thách ngay
                  </span>
                  <Link to={`/quiz/${topic._id}`} className="btn btn-primary btn-sm">
                    Làm bài <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Why Choose QuizMaster */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 50px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>TÍNH NĂNG VƯỢT TRỘI</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Tại Sao Nên Chọn QuizMaster?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '10px' }}>
            Được xây dựng với các tiêu chuẩn công nghệ hiện đại, mang lại trải nghiệm ôn luyện và đánh giá năng lực tối ưu nhất.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div className="glass-card" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Tốc Độ & Độ Trễ Bằng 0</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Kiến trúc SPA được tối ưu hóa giúp chuyển câu hỏi, lưu bài và chấm điểm mượt mà tức thì.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Phân Tích Chi Tiết</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Xem lại từng câu trả lời đúng/sai sau khi nộp bài để củng cố kiến thức và phát hiện lỗ hổng.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Bảng Điểm Minh Bạch</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Lịch sử thi được lưu trữ vĩnh viễn theo tài khoản, dễ dàng theo dõi sự tiến bộ qua từng ngày.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section className="container">
        <div
          className="glass-card"
          style={{
            padding: '60px 40px',
            background: 'var(--primary-gradient)',
            color: '#fff',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
              Sẵn Sàng Chinh Phục Kiến Thức?
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '32px' }}>
              Hàng ngàn câu hỏi thú vị đang chờ bạn khám phá. Bắt đầu ngay hôm nay để nâng cao trình độ!
            </p>
            <Link
              to="/topics"
              className="btn btn-lg"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}
            >
              Khám Phá Các Bài Thi Ngay <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
