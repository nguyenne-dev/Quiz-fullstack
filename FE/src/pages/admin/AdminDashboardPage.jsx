import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topicService } from '../../services/topicService';
import { questionService } from '../../services/questionService';
import { authService } from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  BookOpen, 
  HelpCircle, 
  Users, 
  ArrowRight, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    topicsCount: 0,
    questionsCount: 0,
    usersCount: 0,
  });
  const [recentTopics, setRecentTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [topics, questions, users] = await Promise.all([
          topicService.getAllTopics().catch(() => []),
          questionService.getAllQuestions().catch(() => []),
          authService.getAllUsers().catch(() => []),
        ]);

        setStats({
          topicsCount: topics?.length || 0,
          questionsCount: questions?.length || 0,
          usersCount: users?.length || 0,
        });

        setRecentTopics((topics || []).slice(0, 5));
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu tổng quan admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" message="Đang tải dữ liệu bảng điều khiển..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            Bảng Điều Khiển Quản Trị
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Tổng quan số liệu và quản lý toàn bộ hệ sinh thái bài thi QuizMaster.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/questions" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Thêm câu hỏi
          </Link>
          <Link to="/admin/topics" className="btn btn-secondary btn-sm">
            <PlusCircle size={16} /> Thêm chủ đề
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Card 1: Topics */}
        <div className="glass-card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <BookOpen size={24} />
            </div>
            <Link to="/admin/topics" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý <ArrowRight size={14} />
            </Link>
          </div>
          <h3 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '4px' }}>{stats.topicsCount}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>TỔNG SỐ CHỦ ĐỀ</p>
        </div>

        {/* Card 2: Questions */}
        <div className="glass-card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
              <HelpCircle size={24} />
            </div>
            <Link to="/admin/questions" style={{ fontSize: '0.85rem', color: 'var(--info)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý <ArrowRight size={14} />
            </Link>
          </div>
          <h3 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '4px' }}>{stats.questionsCount}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>TỔNG SỐ CÂU HỎI</p>
        </div>

        {/* Card 3: Users */}
        <div className="glass-card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <Users size={24} />
            </div>
            <Link to="/admin/users" style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý <ArrowRight size={14} />
            </Link>
          </div>
          <h3 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '4px' }}>{stats.usersCount}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>TỔNG SỐ NGƯỜI DÙNG</p>
        </div>
      </div>

      {/* Recent Topics List */}
      <div className="glass-card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Chủ Đề Gần Đây</h2>
          </div>
          <Link to="/admin/topics" className="btn btn-outline btn-sm">
            Xem tất cả
          </Link>
        </div>

        {recentTopics.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có chủ đề nào.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTopics.map((t) => (
              <div
                key={t._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>{t.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.description}</p>
                </div>
                <Link to={`/admin/questions?topicId=${t._id}`} className="btn btn-secondary btn-sm">
                  Xem câu hỏi
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboardPage;
