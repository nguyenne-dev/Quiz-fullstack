import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Users, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
    transition: 'all var(--transition-fast)',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 200,
          transition: 'transform var(--transition-normal)',
        }}
      >
        <div>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingLeft: '8px' }}>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
              }}>
                <ShieldCheck size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Admin<span className="gradient-text">Panel</span>
              </span>
            </Link>

            <button
              className="admin-close-btn"
              onClick={() => setSidebarOpen(false)}
              style={{ display: 'none', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <NavLink to="/admin" end style={navItemStyle} onClick={() => setSidebarOpen(false)}>
              <LayoutDashboard size={18} /> Tổng quan
            </NavLink>

            <NavLink to="/admin/topics" style={navItemStyle} onClick={() => setSidebarOpen(false)}>
              <BookOpen size={18} /> Quản lý Chủ đề
            </NavLink>

            <NavLink to="/admin/questions" style={navItemStyle} onClick={() => setSidebarOpen(false)}>
              <HelpCircle size={18} /> Quản lý Câu hỏi
            </NavLink>

            <NavLink to="/admin/users" style={navItemStyle} onClick={() => setSidebarOpen(false)}>
              <Users size={18} /> Quản lý Người dùng
            </NavLink>
          </nav>
        </div>

        {/* Bottom Sidebar Info */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} /> Về trang người dùng
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: '0.9rem',
              fontWeight: 500,
              textAlign: 'left',
              width: '100%'
            }}
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Navbar */}
        <header
          className="glass-nav"
          style={{
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', color: 'var(--text-main)', padding: '6px' }}
            >
              <Menu size={22} />
            </button>
            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Khu Vực Quản Trị Hệ Thống</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={toggleTheme}
              className="btn-icon btn-secondary"
              title="Chuyển theme"
              style={{ width: '38px', height: '38px' }}
            >
              {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="admin-user-info">
                <p style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>{user?.fullname}</p>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>ADMIN</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, padding: '32px 28px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: var(--shadow-lg);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-menu-toggle {
            display: inline-flex !important;
          }
          .admin-close-btn {
            display: inline-flex !important;
          }
          .admin-user-info {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
