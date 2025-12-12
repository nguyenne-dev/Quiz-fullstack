import React, { useState } from 'react';
import { useToast } from '../../components/common/Toast';
import { Mail, MessageSquare, Send, Phone, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullname || !email || !message) {
      addToast('Vui lòng điền đầy đủ các thông tin bắt buộc', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast('Tin nhắn của bạn đã được gửi thành công!', 'success');
      setFullname('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '960px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', margin: '30px 0 50px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> HỖ TRỢ & ĐÓNG GÓP Ý KIẾN
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
          Liên Hệ Với <span className="gradient-text">Chúng Tôi</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Mọi thắc mắc hoặc đề xuất tính năng, xin vui lòng gửi tin nhắn cho đội ngũ phát triển.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
        }}
      >
        {/* Left: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Thông Tin Liên Hệ</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Email hỗ trợ</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@eduexam.dev</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--info-bg)', color: 'var(--info)', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Hotline</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+84 (0) 987 654 321</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Trụ sở</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hà Nội, Việt Nam</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px' }}>Thời gian phản hồi</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Đội ngũ hỗ trợ làm việc từ Thứ 2 đến Thứ 7 (8:00 - 18:00) và thường phản hồi trong vòng 24 giờ làm việc.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="glass-card" style={{ padding: '36px', backgroundColor: 'var(--bg-surface)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>Cảm Ơn Bạn!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Tin nhắn của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm">
                Gửi thêm tin nhắn khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Gửi Tin Nhắn</h3>

              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nguyễn Văn A"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email của bạn *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu đề</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Góp ý đề thi / Báo lỗi kỹ thuật..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nội dung tin nhắn *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Nhập nội dung chi tiết..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem', marginTop: '10px' }}
                disabled={loading}
              >
                <Send size={18} /> {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default ContactPage;
