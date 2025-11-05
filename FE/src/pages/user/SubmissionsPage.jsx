import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submissionService } from '../../services/submissionService';
import { 
  History, 
  Search, 
  Calendar, 
  Trophy, 
  ArrowRight, 
  RotateCcw, 
  BookOpen,
  CheckCircle2,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await submissionService.getAllSubmissions();
        setSubmissions(data || []);
      } catch (err) {
        console.error('Lỗi khi tải lịch sử làm bài:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((sub) =>
    (sub.topicTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', margin: '20px 0 32px' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            <History size={14} /> TIẾN ĐỘ HỌC TẬP
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Lịch Sử Làm Bài</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Theo dõi tất cả các bài kiểm tra trắc nghiệm bạn đã hoàn thành
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo tên chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', height: '44px', borderRadius: 'var(--radius-md)' }}
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <LoadingSpinner message="Đang tải lịch sử thi..." />
      ) : filteredSubmissions.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            maxWidth: '500px',
            margin: '40px auto',
          }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}>
            <History size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Chưa có bài làm nào</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
            {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : 'Bạn chưa tham gia bài thi trắc nghiệm nào. Hãy bắt đầu ngay!'}
          </p>
          <Link to="/topics" className="btn btn-primary">
            <BookOpen size={16} /> Khám phá các chủ đề thi
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredSubmissions.map((sub) => {
            const total = sub.totalQuestions || 1;
            const score = sub.score || 0;
            const percentage = Math.round((score / total) * 100);
            const dateStr = sub.submittedAt
              ? new Date(sub.submittedAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Gần đây';

            return (
              <div
                key={sub._id}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                {/* Left info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      backgroundColor: percentage >= 70 ? 'var(--success-bg)' : 'var(--primary-light)',
                      color: percentage >= 70 ? 'var(--success)' : 'var(--primary)',
                      border: `1px solid ${percentage >= 70 ? 'var(--success-border)' : 'rgba(99, 102, 241, 0.2)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      flexShrink: 0,
                    }}
                  >
                    {score}/{total}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                      {sub.topicTitle || 'Chủ đề thi'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} /> {dateStr}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Trophy size={14} /> Tỷ lệ đúng: <strong style={{ color: percentage >= 70 ? 'var(--success)' : 'var(--text-main)' }}>{percentage}%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {sub.topicId && (
                    <Link
                      to={`/quiz/${sub.topicId}`}
                      className="btn btn-secondary btn-sm"
                      title="Làm lại chủ đề này"
                    >
                      <RotateCcw size={14} /> Làm lại
                    </Link>
                  )}
                  <Link
                    to={`/result/${sub._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Xem chi tiết <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default SubmissionsPage;
