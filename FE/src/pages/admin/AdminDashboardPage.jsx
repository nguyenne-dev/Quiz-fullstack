import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topicService } from '../../services/topicService';
import { questionService } from '../../services/questionService';
import { authService } from '../../services/authService';
import { submissionService } from '../../services/submissionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  BookOpen, 
  HelpCircle, 
  Users, 
  ArrowRight, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp,
  Activity,
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    topicsCount: 0,
    questionsCount: 0,
    usersCount: 0,
    submissionsCount: 0,
    averageScore: 0,
    passRate: 0,
  });
  const [recentTopics, setRecentTopics] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [topics, questions, users, submissionStats] = await Promise.all([
          topicService.getAllTopics().catch(() => []),
          questionService.getAllQuestions().catch(() => []),
          authService.getAllUsers().catch(() => []),
          submissionService.getAdminSubmissionStats().catch(() => null),
        ]);

        setStats({
          topicsCount: topics?.length || 0,
          questionsCount: questions?.length || 0,
          usersCount: users?.length || 0,
          submissionsCount: submissionStats?.totalSubmissions || 0,
          averageScore: submissionStats?.averageScorePercent || 0,
          passRate: submissionStats?.passRate || 0,
        });

        setRecentTopics((topics || []).slice(0, 4));
        setRecentSubmissions(submissionStats?.recentAttempts || []);
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
            Tổng quan số liệu và quản lý toàn bộ hệ sinh thái khảo thí EduExam Platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/submissions" className="btn btn-primary btn-sm">
            <Award size={16} /> Quản lý bài thi
          </Link>
          <Link to="/admin/questions" className="btn btn-secondary btn-sm">
            <PlusCircle size={16} /> Thêm câu hỏi
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1: Topics */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <BookOpen size={22} />
            </div>
            <Link to="/admin/topics" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý <ArrowRight size={14} />
            </Link>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '4px' }}>{stats.topicsCount}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>TỔNG SỐ CHỦ ĐỀ</p>
        </div>

        {/* Card 2: Questions */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
              <HelpCircle size={22} />
            </div>
            <Link to="/admin/questions" style={{ fontSize: '0.85rem', color: 'var(--info)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý <ArrowRight size={14} />
            </Link>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '4px' }}>{stats.questionsCount}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>TỔNG SỐ CÂU HỎI</p>
        </div>

        {/* Card 3: Submissions & Performance */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <Award size={22} />
            </div>
            <Link to="/admin/submissions" style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý <ArrowRight size={14} />
            </Link>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '4px' }}>{stats.submissionsCount}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>LƯỢT LÀM BÀI (ĐTB: {stats.averageScore}%)</p>
        </div>

        {/* Card 4: Users */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <Users size={22} />
            </div>
            <Link to="/admin/users" style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Quản lý <ArrowRight size={14} />
            </Link>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '4px' }}>{stats.usersCount}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>TỔNG SỐ NGƯỜI DÙNG</p>
        </div>
      </div>

      {/* Grid: Recent Topics & Recent Exam Attempts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Box 1: Recent Topics */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} color="var(--primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Chủ Đề Gần Đây</h2>
            </div>
            <Link to="/admin/topics" className="btn btn-outline btn-sm">
              Xem tất cả
            </Link>
          </div>

          {recentTopics.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có chủ đề nào.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentTopics.map((t) => (
                <div
                  key={t._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>{t.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.description}</p>
                  </div>
                  <Link to={`/admin/questions?topicId=${t._id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                    Câu hỏi
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Box 2: Recent Exam Attempts */}
        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={18} color="#ec4899" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Lượt Thi Mới Nhất</h2>
            </div>
            <Link to="/admin/submissions" className="btn btn-outline btn-sm">
              Quản lý chi tiết
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có lượt thi nào hoàn thành.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>{sub.candidateName}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {sub.topicTitle} • {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`badge ${sub.percentage >= 80 ? 'badge-success' : sub.percentage >= 50 ? 'badge-primary' : 'badge-danger'}`}
                      style={{ fontWeight: 700 }}
                    >
                      {sub.score}/{sub.totalQuestions} ({sub.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;

