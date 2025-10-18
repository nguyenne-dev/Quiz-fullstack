import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  User, 
  History, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  BookOpen
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
    transition: 'all var(--transition-fast)',
  });

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Quiz<span className="gradient-text">Master</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          <NavLink to="/" style={navLinkStyle}>Trang chủ</NavLink>
          <NavLink to="/topics" style={navLinkStyle}>Chủ đề</NavLink>
          {isAuthenticated && (
            <NavLink to="/submissions" style={navLinkStyle}>Lịch sử thi</NavLink>
          )}
          <NavLink to="/about" style={navLinkStyle}>Giới thiệu</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Liên hệ</NavLink>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn-icon btn-secondary"
            title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            style={{ width: '40px', height: '40px' }}
          >
            {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-secondary"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                  {user?.fullname || 'Tài khoản'}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="glass-card animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '220px',
                    padding: '8px',
                    backgroundColor: 'var(--bg-surface)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{user?.fullname}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                    {isAdmin && (
                      <span className="badge badge-primary" style={{ marginTop: '6px' }}>
                        Quản trị viên
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <User size={16} color="var(--primary)" />
                    Thông tin cá nhân
                  </Link>

                  <Link
                    to="/submissions"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <History size={16} color="var(--info)" />
                    Lịch sử làm bài
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ShieldCheck size={16} color="var(--warning)" />
                      Trang Quản trị
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '6px', paddingTop: '6px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        width: '100%',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--danger)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="btn-icon btn-secondary mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ width: '40px', height: '40px' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="glass-card animate-fade-in"
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            padding: '20px',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Trang chủ</NavLink>
          <NavLink to="/topics" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Chủ đề</NavLink>
          {isAuthenticated && (
            <NavLink to="/submissions" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Lịch sử thi</NavLink>
          )}
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Giới thiệu</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Liên hệ</NavLink>
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Quản trị viên</NavLink>
          )}
        </div>
      )}

      {/* Responsive Media Query Style */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
