import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Ban, 
  CheckCircle2, 
  Mail, 
  Calendar 
} from 'lucide-react';

export const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách user:', err);
      addToast('Lỗi khi tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setActionLoadingId(userId);
      await authService.updateUserStatus(userId, newStatus);
      addToast(`Đã chuyển trạng thái thành ${newStatus}`, 'success');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      addToast(err.message || 'Cập nhật trạng thái thất bại', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?._id) {
      addToast('Bạn không thể tự hạ quyền quản trị của chính mình', 'warning');
      return;
    }

    try {
      setActionLoadingId(userId);
      await authService.updateUserRole(userId, newRole);
      addToast(`Đã thay đổi vai trò thành ${newRole}`, 'success');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Lỗi cập nhật vai trò:', err);
      addToast(err.message || 'Cập nhật vai trò thất bại', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.fullname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Quản Lý Người Dùng</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Theo dõi danh sách tài khoản, phân quyền quản trị và quản lý trạng thái hoạt động
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', height: '44px' }}
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
        {loading ? (
          <LoadingSpinner message="Đang tải danh sách người dùng..." />
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            Không tìm thấy người dùng nào.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Họ và tên</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Giới tính</th>
                  <th style={{ padding: '12px 16px' }}>Ngày tạo</th>
                  <th style={{ padding: '12px 16px' }}>Vai trò</th>
                  <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isCurrent = u._id === currentUser?._id;
                  const isActing = actionLoadingId === u._id;
                  const dateStr = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : '-';

                  const isBanned = u.status === 'BANNED';
                  const isInactive = u.status === 'INACTIVE';
                  const isActive = !isBanned && !isInactive;

                  return (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s',
                        opacity: isActing ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Name */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--bg-muted)',
                              color: u.role === 'ADMIN' ? '#fff' : 'var(--text-main)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            {u.fullname ? u.fullname.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                              {u.fullname} {isCurrent && <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>(Bạn)</span>}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {u.email}
                      </td>

                      {/* Gender */}
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {u.gender || '-'}
                      </td>

                      {/* Created Date */}
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {dateStr}
                      </td>

                      {/* Role Badge */}
                      <td style={{ padding: '16px' }}>
                        <span className={u.role === 'ADMIN' ? 'badge badge-primary' : 'badge badge-info'}>
                          {u.role}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '16px' }}>
                        <span
                          className={
                            isBanned
                              ? 'badge badge-danger'
                              : isInactive
                              ? 'badge badge-warning'
                              : 'badge badge-success'
                          }
                        >
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {/* Toggle Status Select */}
                          <select
                            className="form-select"
                            value={u.status || 'ACTIVE'}
                            onChange={(e) => handleStatusChange(u._id, e.target.value)}
                            disabled={isCurrent || isActing}
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.8rem',
                              height: '32px',
                              width: '110px',
                            }}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                            <option value="BANNED">BANNED</option>
                          </select>

                          {/* Toggle Role Button */}
                          <button
                            onClick={() => handleRoleChange(u._id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                            disabled={isCurrent || isActing}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.8rem', padding: '4px 10px', height: '32px' }}
                            title={u.role === 'ADMIN' ? 'Chuyển sang USER' : 'Nâng cấp lên ADMIN'}
                          >
                            {u.role === 'ADMIN' ? 'Gỡ Admin' : 'Lên Admin'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminUsersPage;
