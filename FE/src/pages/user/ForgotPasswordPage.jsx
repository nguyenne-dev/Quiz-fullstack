import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/Toast';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, CheckCircle2, Sparkles, Send } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { addToast } = useToast();

  // Mode 1: Request reset link by Email
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Mode 2: Reset with token
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Vui lòng nhập địa chỉ email', 'warning');
      return;
    }

    try {
      setLoading(true);
      await authService.sendResetPasswordEmail(email);
      setEmailSent(true);
      addToast('Đã gửi email khôi phục mật khẩu!', 'success');
    } catch (err) {
      console.error('Send reset email error:', err);
      addToast(err.message || 'Không thể gửi email. Vui lòng kiểm tra lại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      addToast('Mật khẩu mới phải có ít nhất 6 ký tự', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('Mật khẩu xác nhận không khớp', 'warning');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      setResetSuccess(true);
      addToast('Đặt lại mật khẩu thành công!', 'success');
    } catch (err) {
      console.error('Reset password error:', err);
      addToast(err.message || 'Đặt lại mật khẩu thất bại. Token có thể đã hết hạn!', 'error');
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
          maxWidth: '460px',
          padding: '40px 36px',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        {token ? (
          // Mode 2: Reset Password Form
          resetSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
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
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>
                Đổi Mật Khẩu Thành Công!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
                Mật khẩu tài khoản của bạn đã được cập nhật. Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay bây giờ.
              </p>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Đăng nhập ngay <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
                  }}
                >
                  <KeyRound size={24} />
                </div>
                <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Tạo Mật Khẩu Mới</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Vui lòng nhập mật khẩu mới cho tài khoản của bạn
                </p>
              </div>

              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={16} /> Mật khẩu mới
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Ít nhất 6 ký tự..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingRight: '44px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={16} /> Xác nhận mật khẩu mới
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

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem', marginTop: '14px' }}
                  disabled={loading}
                >
                  <KeyRound size={18} /> {loading ? 'Đang cập nhật...' : 'Lưu Mật Khẩu Mới'}
                </button>
              </form>
            </div>
          )
        ) : (
          // Mode 1: Enter Email Form
          emailSent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <Send size={32} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>
                Đã Gửi Email Khôi Phục
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
                Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư (hiệu lực 15 phút).
              </p>
              <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                Quay lại trang Đăng nhập
              </Link>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
                  }}
                >
                  <KeyRound size={24} />
                </div>
                <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Quên Mật Khẩu?</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Nhập email đăng ký của bạn để nhận liên kết đặt lại mật khẩu
                </p>
              </div>

              <form onSubmit={handleSendEmail}>
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

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem', marginTop: '14px' }}
                  disabled={loading}
                >
                  <Send size={18} /> {loading ? 'Đang gửi email...' : 'Gửi Liên Kết Khôi Phục'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
                <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  ← Quay lại Đăng nhập
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
