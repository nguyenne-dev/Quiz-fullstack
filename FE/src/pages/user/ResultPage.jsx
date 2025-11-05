import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionService } from '../../services/submissionService';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  History, 
  ArrowLeft,
  Calendar,
  Percent,
  Check,
  X,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const ResultPage = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'CORRECT' | 'WRONG'

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const data = await submissionService.getSubmissionById(submissionId);
        setSubmission(data);

        // Calculate score percentage
        const total = data?.totalQuestions || data?.questions?.length || 1;
        const score = data?.score || 0;
        const percentage = Math.round((score / total) * 100);

        // Trigger confetti if high score (>= 70%)
        if (percentage >= 70) {
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.warn('Confetti effect failed', e);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải kết quả:', err);
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) {
      fetchResult();
    }
  }, [submissionId]);

  if (loading) {
    return <LoadingSpinner size="large" message="Đang tổng hợp bảng điểm kết quả..." />;
  }

  if (!submission) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px', backgroundColor: 'var(--bg-surface)' }}>
          <XCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Không tìm thấy kết quả</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Bài làm này không tồn tại hoặc đã bị gỡ khỏi hệ thống.
          </p>
          <Link to="/submissions" className="btn btn-primary">
            <ArrowLeft size={16} /> Xem lịch sử làm bài
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = submission.totalQuestions || submission.questions?.length || 0;
  const score = submission.score || 0;
  const wrongCount = Math.max(0, totalQuestions - score);
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Elapsed Time calculation
  const startTime = new Date(submission.startedAt || Date.now()).getTime();
  const endTime = new Date(submission.submittedAt || Date.now()).getTime();
  const elapsedSecs = Math.max(1, Math.round((endTime - startTime) / 1000));
  const timeFormatted = `${Math.floor(elapsedSecs / 60)} phút ${elapsedSecs % 60} giây`;
  
  const formattedDate = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '-';

  // Status configuration
  let statusBadge = "badge-success";
  let statusTitle = "Chúc mừng bạn!";
  let statusColor = "var(--success)";
  let statusDesc = "Bạn đã hoàn thành tốt bài thi trắc nghiệm này.";

  if (percentage >= 85) {
    statusTitle = "Xuất sắc! 🎉";
    statusBadge = "badge-success";
    statusColor = "var(--success)";
    statusDesc = "Kiến thức của bạn rất vững chắc. Hãy tiếp tục phát huy ở các chủ đề nâng cao!";
  } else if (percentage >= 60) {
    statusTitle = "Đạt yêu cầu 👍";
    statusBadge = "badge-info";
    statusColor = "var(--info)";
    statusDesc = "Bạn đã vượt qua bài thi với kết quả tốt. Hãy xem lại các câu sai để hoàn thiện hơn.";
  } else {
    statusTitle = "Cần cố gắng thêm 💪";
    statusBadge = "badge-warning";
    statusColor = "var(--warning)";
    statusDesc = "Đừng nản lòng! Hãy xem kỹ đáp án giải thích bên dưới và thử sức làm lại bài thi nhé.";
  }

  // Filter questions list
  const filteredQuestions = (submission.questions || []).filter((q) => {
    if (activeFilter === 'CORRECT') return q.isCorrect;
    if (activeFilter === 'WRONG') return !q.isCorrect;
    return true;
  });

  return (
    <div className="container" style={{ paddingBottom: '80px', paddingTop: '20px' }}>
      
      {/* Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Trang chủ</Link>
        <span>/</span>
        <Link to="/submissions" style={{ color: 'var(--text-muted)' }}>Lịch sử thi</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Kết quả chi tiết</span>
      </div>

      {/* 1. Score Showcase Card */}
      <div
        className="glass-card"
        style={{
          padding: '40px',
          maxWidth: '860px',
          margin: '0 auto 40px',
          backgroundColor: 'var(--bg-surface)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '16px' }}>
          <Trophy size={36} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <span className={`badge ${statusBadge}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            {statusTitle}
          </span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
          {submission.topicTitle || 'Bài thi trắc nghiệm'}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          {statusDesc}
        </p>

        {/* 4 Stat Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Điểm số */}
          <div style={{ padding: '18px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1.2 }}>
              {score} / {totalQuestions}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>SỐ CÂU ĐÚNG</p>
          </div>

          {/* Tỷ lệ chính xác */}
          <div style={{ padding: '18px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '1.85rem', fontWeight: 900, color: statusColor, lineHeight: 1.2 }}>
              {percentage}%
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>TỶ LỆ CHÍNH XÁC</p>
          </div>

          {/* Thời gian làm bài */}
          <div style={{ padding: '18px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}>
              <Clock size={18} color="var(--text-main)" />
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {timeFormatted}
              </p>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '6px' }}>THỜI GIAN LÀM</p>
          </div>

          {/* Thời gian nộp */}
          <div style={{ padding: '18px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
              <Calendar size={16} color="var(--text-subtle)" />
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {formattedDate.split(' ')[0] || formattedDate}
              </p>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '6px' }}>NGÀY NỘP BÀI</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {submission.topicId && (
            <Link to={`/quiz/${submission.topicId}`} className="btn btn-primary">
              <RotateCcw size={16} /> Làm lại bài thi
            </Link>
          )}
          <Link to="/topics" className="btn btn-secondary">
            <BookOpen size={16} /> Chọn chủ đề khác
          </Link>
          <Link to="/submissions" className="btn btn-outline">
            <History size={16} /> Lịch sử bài làm
          </Link>
        </div>
      </div>

      {/* 2. Detailed Question-by-Question Breakdown */}
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Section Header & Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Chi Tiết Từng Câu Hỏi</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Đối chiếu đáp án đã chọn và đáp án chuẩn xác của từng câu hỏi
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`btn btn-sm ${activeFilter === 'ALL' ? 'btn-primary' : ''}`}
              style={{
                backgroundColor: activeFilter === 'ALL' ? 'var(--primary)' : 'transparent',
                color: activeFilter === 'ALL' ? '#ffffff' : 'var(--text-muted)',
                padding: '4px 12px',
                fontSize: '0.8rem'
              }}
            >
              Tất cả ({totalQuestions})
            </button>
            <button
              onClick={() => setActiveFilter('CORRECT')}
              className={`btn btn-sm ${activeFilter === 'CORRECT' ? 'btn-primary' : ''}`}
              style={{
                backgroundColor: activeFilter === 'CORRECT' ? 'var(--success)' : 'transparent',
                color: activeFilter === 'CORRECT' ? '#ffffff' : 'var(--text-muted)',
                padding: '4px 12px',
                fontSize: '0.8rem'
              }}
            >
              Đúng ({score})
            </button>
            <button
              onClick={() => setActiveFilter('WRONG')}
              className={`btn btn-sm ${activeFilter === 'WRONG' ? 'btn-primary' : ''}`}
              style={{
                backgroundColor: activeFilter === 'WRONG' ? 'var(--danger)' : 'transparent',
                color: activeFilter === 'WRONG' ? '#ffffff' : 'var(--text-muted)',
                padding: '4px 12px',
                fontSize: '0.8rem'
              }}
            >
              Sai ({wrongCount})
            </button>
          </div>
        </div>

        {/* Questions Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredQuestions.length === 0 ? (
            <div className="glass-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Không có câu hỏi nào thuộc bộ lọc này.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isCorrect = q.isCorrect;
              const userAnswerKey = q.selectedAnswer;
              const correctAnswerKey = q.correctAnswer;

              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '24px 28px',
                    backgroundColor: 'var(--bg-surface)',
                    borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                  }}
                >
                  {/* Header of Question Review */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                        CÂU HỎI {idx + 1}
                      </span>
                    </div>

                    {isCorrect ? (
                      <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                        <CheckCircle2 size={14} /> Chính xác (+1.0 điểm)
                      </span>
                    ) : (
                      <span className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                        <XCircle size={14} /> Chưa đúng (0 điểm)
                      </span>
                    )}
                  </div>

                  {/* Question Content */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', lineHeight: 1.5, color: 'var(--text-main)' }}>
                    {q.question}
                  </h3>

                  {/* 4 Options Grid/List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {q.answers?.map((opt) => {
                      const isUserChoice = userAnswerKey === opt.key;
                      const isCorrectChoice = correctAnswerKey === opt.key;

                      let rowBg = 'var(--bg-subtle)';
                      let rowBorder = 'var(--border-subtle)';
                      let badgeBg = 'var(--bg-surface)';
                      let badgeColor = 'var(--text-main)';
                      let statusText = null;

                      if (isCorrectChoice && isUserChoice) {
                        // Trả lời đúng
                        rowBg = 'var(--success-bg)';
                        rowBorder = 'var(--success-border)';
                        badgeBg = 'var(--success)';
                        badgeColor = '#ffffff';
                        statusText = (
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={14} /> Đáp án đúng (Bạn đã chọn)
                          </span>
                        );
                      } else if (isCorrectChoice && !isUserChoice) {
                        // Đáp án đúng mà thí sinh bỏ lỡ
                        rowBg = 'var(--success-bg)';
                        rowBorder = 'var(--success-border)';
                        badgeBg = 'var(--success)';
                        badgeColor = '#ffffff';
                        statusText = (
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={14} /> Đáp án chính xác
                          </span>
                        );
                      } else if (isUserChoice && !isCorrectChoice) {
                        // Đáp án thí sinh chọn sai
                        rowBg = 'var(--danger-bg)';
                        rowBorder = 'var(--danger-border)';
                        badgeBg = 'var(--danger)';
                        badgeColor = '#ffffff';
                        statusText = (
                          <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <X size={14} /> Bạn đã chọn câu này
                          </span>
                        );
                      }

                      return (
                        <div
                          key={opt.key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '12px 18px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: rowBg,
                            border: `1px solid ${rowBorder}`,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {/* Option Badge */}
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: badgeBg,
                              color: badgeColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              flexShrink: 0,
                              border: isCorrectChoice || isUserChoice ? 'none' : '1px solid var(--border-card)',
                            }}
                          >
                            {opt.key}
                          </div>

                          {/* Option text */}
                          <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: isCorrectChoice || isUserChoice ? 600 : 400, color: 'var(--text-main)' }}>
                            {opt.text}
                          </div>

                          {/* Status Flag */}
                          {statusText}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

export default ResultPage;
