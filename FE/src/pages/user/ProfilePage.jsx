import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/Toast';
import { User, Mail, Calendar, Lock, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const { addToast } = useToast();

  const [fullname, setFullname] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '');
      setGender(user.gender || 'Nam');
      if (user.dob) {
        setDob(new Date(user.dob).toISOString().split('T')[0]);
      }
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!fullname.trim()) {
      addToast('Vui lòng nhập họ và tên', 'warning');
      return;
    }

    if (password) {
      if (password.length < 6) {
        addToast('Mật khẩu mới phải có ít nhất 6 ký tự', 'warning');
        return;
      }
      if (password !== confirmPassword) {
        addToast('Mật khẩu xác nhận không khớp', 'warning');
        return;
      }
    }

    try {
      setLoading(true);
      const payload = {
        fullname,
        gender,
        dob,
      };
      if (password) {
        payload.password = password;
      }

      const res = await authService.updateProfile(payload);
      if (res.data) {
        updateUserData(res.data);
      }
      addToast('Cập nhật thông tin thành công!', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Lỗi khi cập nhật profile:', err);
      addToast(err.message || 'Cập nhật thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', maxWidth: '720px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', margin: '20px 0 36px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            marginBottom: '16px'
          }}
        >
          {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Hồ Sơ Cá Nhân</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Quản lý thông tin tài khoản và bảo mật
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card" style={{ padding: '36px', backgroundColor: 'var(--bg-surface)' }}>
        <form onSubmit={handleUpdateProfile}>
          
          {/* Email (Read Only) */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> Địa chỉ Email
            </label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.7, backgroundColor: 'var(--bg-subtle)', cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
              Email dùng để đăng nhập và không thể thay đổi
            </span>
          </div>

          {/* Fullname */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> Họ và tên
            </label>
            <input
              type="text"
              className="form-input"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nhập họ và tên đầy đủ..."
              required
            />
          </div>

          {/* Gender & DOB row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

          {/* Role badge */}
          <div style={{ margin: '12px 0 24px', padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Vai trò người dùng:</span>
            <span className={user?.role === 'ADMIN' ? 'badge badge-primary' : 'badge badge-info'}>
              {user?.role === 'ADMIN' ? 'Quản Trị Viên (ADMIN)' : 'Thành Viên (USER)'}
            </span>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '24px 0 20px', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Đổi mật khẩu mới</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Để trống nếu bạn không muốn thay đổi mật khẩu hiện tại
            </p>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} /> Mật khẩu mới
              </label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập ít nhất 6 ký tự..."
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} /> Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem', marginTop: '10px' }}
            disabled={loading}
          >
            <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ProfilePage;
