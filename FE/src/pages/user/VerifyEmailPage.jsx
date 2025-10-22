import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus({
          success: false,
          message: 'Không tìm thấy mã xác thực token. Vui lòng kiểm tra lại liên kết email.',
        });
        setLoading(false);
        return;
      }

      try {
        const res = await authService.verifyEmail(token);
        setStatus({
          success: true,
          message: res.message || 'Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay.',
        });
      } catch (err) {
        setStatus({
          success: false,
          message: err.message || 'Liên kết xác thực không hợp lệ hoặc đã hết hạn (5 phút).',
        });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px 36px',
          backgroundColor: 'var(--bg-surface)',
          textAlign: 'center',
        }}
      >
        {loading ? (
          <LoadingSpinner size="large" message="Đang tiến hành xác thực tài khoản..." />
        ) : status.success ? (
          <div>
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

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
              Xác Thực Thành Công!
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
              {status.message}
            </p>

            <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Đăng nhập ngay <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid var(--danger-border)',
              }}
            >
              <XCircle size={36} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
              Xác Thực Thất Bại
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
              {status.message}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>
                Đăng ký lại tài khoản
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                Về trang đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
