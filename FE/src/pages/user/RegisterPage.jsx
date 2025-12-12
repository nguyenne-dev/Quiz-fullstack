import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/Toast';
import { 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  Eye, 
  EyeOff, 
  UserPlus, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';

export const RegisterPage = () => {
  const { addToast } = useToast();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullname || !email || !password || !gender || !dob) {
      addToast('Vui lòng điền đầy đủ tất cả thông tin', 'warning');
      return;
    }

    if (password.length < 6) {
      addToast('Mật khẩu phải có ít nhất 6 ký tự', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      addToast('Mật khẩu xác nhận không trùng khớp', 'warning');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        fullname,
        email,
        password,
        gender,
        dob,
      });

      setIsSuccess(true);
      addToast('Email kích hoạt đã được gửi!', 'success');
    } catch (err) {
      console.error('Register error:', err);
      addToast(err.message || 'Đăng ký thất bại. Vui lòng thử lại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '40px 36px',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid var(--success-border)',
              }}
            >
              <Send size={32} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>
              Kiểm Tra Hộp Thư Email Của Bạn
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Chúng tôi đã gửi một liên kết xác thực đến <strong>{email}</strong>. Vui lòng nhấp vào liên kết trong email để kích hoạt tài khoản của bạn (hết hạn sau 5 phút).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Quay lại trang Đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
                }}
              >
                <Sparkles size={24} />
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Tạo Tài Khoản</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Đăng ký ngay để bắt đầu tham gia thi trắc nghiệm cùng EduExam Platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Fullname */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} /> Họ và tên
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nguyễn Văn A"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} /> Địa chỉ Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Gender & DOB row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} /> Ngày sinh
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={16} /> Mật khẩu (ít nhất 6 ký tự)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '44px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-subtle)',
                      padding: '4px',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={16} /> Xác nhận mật khẩu
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Nhập lại mật khẩu..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem', marginTop: '12px' }}
                disabled={loading}
              >
                <UserPlus size={18} /> {loading ? 'Đang gửi mã kích hoạt...' : 'Tạo Tài Khoản'}
              </button>
            </form>

            {/* Footer Link */}
            <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Đã có tài khoản?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Đăng nhập ngay <ArrowRight size={14} />
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
