import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import { topicService } from '../../services/topicService';
import { submissionService } from '../../services/submissionService';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  RotateCcw,
  Check,
  Lock
} from 'lucide-react';

export const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quiz execution states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { [questionId]: boolean }
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch topic & questions
  useEffect(() => {
    const initQuiz = async () => {
      try {
        setLoading(true);
        const [topicData, questionsData] = await Promise.all([
          topicService.getTopicById(topicId),
          questionService.getQuestionsByTopic(topicId)
        ]);

        setTopic(topicData);
        setQuestions(questionsData || []);
        setStartedAt(new Date().toISOString());
      } catch (err) {
        console.error('Lỗi khi chuẩn bị đề thi:', err);
        addToast('Không thể tải câu hỏi của chủ đề này', 'error');
      } finally {
        setLoading(false);
      }
    };

    initQuiz();
  }, [topicId]);

  // Live Timer
  useEffect(() => {
    if (loading || questions.length === 0) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (key) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ._id]: key
    }));
  };

  const toggleFlagQuestion = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ._id]: !prev[currentQ._id]
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;
  const unansweredCount = totalQuestions - answeredCount;

  // Jump to first unanswered question
  const jumpToFirstUnanswered = () => {
    const firstUnansweredIndex = questions.findIndex((q) => !selectedAnswers[q._id]);
    if (firstUnansweredIndex !== -1) {
      setCurrentIndex(firstUnansweredIndex);
      setShowSubmitModal(false);
      addToast(`Đã chuyển tới câu ${firstUnansweredIndex + 1} chưa làm`, 'info');
    }
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;

    // Strict validation: Bắt buộc hoàn thành 100% câu hỏi
    if (unansweredCount > 0) {
      addToast(`Bạn bắt buộc phải hoàn thành toàn bộ ${totalQuestions} câu hỏi trước khi nộp bài! (Còn ${unansweredCount} câu chưa làm)`, 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const submittedAt = new Date().toISOString();

      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      // Gọi API nộp bài
      const res = await submissionService.createSubmission({
        topicId,
        answers: formattedAnswers,
        startedAt,
        submittedAt
      });

      addToast('Nộp bài thành công!', 'success');
      setShowSubmitModal(false);
      navigate(`/result/${res.submissionId}`);
    } catch (err) {
      console.error('Lỗi khi nộp bài:', err);
      addToast(err.message || 'Lỗi khi nộp bài thi', 'error');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Đang chuẩn bị đề thi..." />;
  }

  if (questions.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px', backgroundColor: 'var(--bg-surface)' }}>
          <AlertTriangle size={48} color="var(--warning)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Chưa có câu hỏi</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Chủ đề này hiện tại chưa có câu hỏi nào để làm bài.
          </p>
          <Link to="/topics" className="btn btn-primary">
            <ArrowLeft size={16} /> Quay lại danh sách chủ đề
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedKey = currentQuestion ? selectedAnswers[currentQuestion._id] : null;
  const isFlagged = currentQuestion ? !!flaggedQuestions[currentQuestion._id] : false;

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      
      {/* 1. Header Bar: Topic Name, Progress, Timer, Submit CTA */}
      <div
        className="glass-card"
        style={{
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/topics" className="btn-icon btn-secondary" title="Thoát bài thi">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {topic?.title || 'Bài thi trắc nghiệm'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Đã trả lời <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{answeredCount}</span>/{totalQuestions} câu
              {unansweredCount > 0 ? (
                <span style={{ color: 'var(--warning)', marginLeft: '8px', fontWeight: 600 }}>
                  (Còn {unansweredCount} câu chưa làm)
                </span>
              ) : (
                <span style={{ color: 'var(--success)', marginLeft: '8px', fontWeight: 600 }}>
                  (Đã hoàn thành đủ 100%)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Timer & Submit CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--primary)'
            }}
          >
            <Clock size={18} />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className={`btn ${unansweredCount === 0 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)' }}
            title={unansweredCount > 0 ? `Bắt buộc làm đủ ${totalQuestions} câu mới có thể nộp bài` : 'Nộp bài ngay'}
          >
            <Send size={16} /> Nộp bài {unansweredCount > 0 && `(${answeredCount}/${totalQuestions})`}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: '3px',
          marginBottom: '32px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${((answeredCount) / totalQuestions) * 100}%`,
            height: '100%',
            background: 'var(--primary-gradient)',
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>

      {/* 2. Main Layout: Question Area + Side Navigator */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '30px',
          alignItems: 'start',
        }}
        className="quiz-grid-layout"
      >
        
        {/* Left: Question Box */}
        <div
          className="glass-card"
          style={{
            padding: '36px',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {/* Question Title Top */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                CÂU HỎI {currentIndex + 1} / {totalQuestions}
              </span>
            </div>

            {/* Flag Button */}
            <button
              onClick={toggleFlagQuestion}
              className={`btn btn-sm ${isFlagged ? 'btn-warning' : 'btn-outline'}`}
              style={{
                backgroundColor: isFlagged ? 'var(--warning-bg)' : 'transparent',
                borderColor: isFlagged ? 'var(--warning)' : 'var(--border-subtle)',
                color: isFlagged ? 'var(--warning)' : 'var(--text-muted)'
              }}
              title="Đánh dấu câu hỏi cần xem lại"
            >
              <Flag size={15} fill={isFlagged ? 'currentColor' : 'none'} />
              {isFlagged ? 'Đã đánh dấu' : 'Đánh dấu'}
            </button>
          </div>

          {/* Question Content */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.6, color: 'var(--text-main)' }}>
              {currentQuestion?.question}
            </h3>
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentQuestion?.answers?.map((option) => {
              const isSelected = selectedKey === option.key;

              return (
                <div
                  key={option.key}
                  onClick={() => handleSelectAnswer(option.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-subtle)',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'border-color var(--transition-fast), background-color var(--transition-fast)',
                    boxShadow: isSelected ? '0 2px 8px rgba(99, 102, 241, 0.15)' : 'none',
                  }}
                >
                  {/* Key badge */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      border: isSelected ? 'none' : '1px solid var(--border-card)',
                      flexShrink: 0,
                    }}
                  >
                    {option.key}
                  </div>

                  {/* Option Text */}
                  <div style={{ flex: 1, fontSize: '1rem', fontWeight: isSelected ? 600 : 400, color: 'var(--text-main)' }}>
                    {option.text}
                  </div>

                  {/* Check Indicator */}
                  {isSelected && (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginTop: '10px' }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} /> Câu trước
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="btn btn-primary"
              >
                Câu tiếp theo <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className={`btn ${unansweredCount === 0 ? 'btn-success' : 'btn-secondary'}`}
              >
                <Send size={16} /> {unansweredCount === 0 ? 'Nộp bài thi' : `Xem lại bài (${answeredCount}/${totalQuestions})`}
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Matrix Navigator */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'sticky',
            top: '90px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Danh Sách Câu Hỏi</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{answeredCount}/{totalQuestions} đã làm</span>
          </div>

          {/* Grid Numbers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px',
            }}
          >
            {questions.map((q, idx) => {
              const isAnswered = !!selectedAnswers[q._id];
              const isFlag = !!flaggedQuestions[q._id];
              const isCurrent = idx === currentIndex;

              let bgColor = 'var(--bg-subtle)';
              let borderColor = 'var(--border-subtle)';
              let textColor = 'var(--text-main)';

              if (isAnswered) {
                bgColor = 'var(--primary-light)';
                borderColor = 'var(--primary)';
                textColor = 'var(--primary)';
              }

              if (isFlag) {
                bgColor = 'var(--warning-bg)';
                borderColor = 'var(--warning)';
                textColor = 'var(--warning)';
              }

              if (isCurrent) {
                borderColor = 'var(--text-main)';
              }

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: bgColor,
                    border: `2px solid ${borderColor}`,
                    color: textColor,
                    fontWeight: isCurrent ? 800 : 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: isCurrent ? '0 0 0 2px var(--border-focus)' : 'none',
                    transition: 'border-color var(--transition-fast)',
                  }}
                  title={`Câu ${idx + 1}: ${isAnswered ? 'Đã làm' : 'Chưa làm'}`}
                >
                  {idx + 1}
                  {isFlag && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--warning)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)' }} />
              <span>Đã trả lời ({answeredCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning)' }} />
              <span>Đánh dấu xem lại</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }} />
              <span>Chưa trả lời ({unansweredCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Confirm Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Xác nhận nộp bài thi"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {unansweredCount > 0 ? (
            <div
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--text-main)',
              }}
            >
              <Lock size={24} color="var(--danger)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--danger)' }}>
                  Chưa thể nộp bài thi!
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  Bạn bắt buộc phải trả lời đủ <strong style={{ color: 'var(--danger)' }}>{totalQuestions}/{totalQuestions}</strong> câu hỏi trước khi nộp bài. Hiện tại còn <strong>{unansweredCount} câu</strong> chưa chọn đáp án.
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-bg)',
                border: '1px solid var(--success-border)',
              }}
            >
              <CheckCircle2 size={24} color="var(--success)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--success)' }}>
                  Đã hoàn thành 100% câu hỏi!
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Bạn đã trả lời đầy đủ {totalQuestions}/{totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài để xem điểm số ngay bây giờ không?
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            {unansweredCount > 0 ? (
              <>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="btn btn-secondary"
                >
                  Đóng
                </button>
                <button
                  onClick={jumpToFirstUnanswered}
                  className="btn btn-primary"
                >
                  Đi tới câu chưa làm
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Xem lại bài làm
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Đang chấm điểm...' : 'Nộp bài ngay'}
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .quiz-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;
