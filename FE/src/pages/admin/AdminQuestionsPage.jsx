import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import { topicService } from '../../services/topicService';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const AdminQuestionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopicId = searchParams.get('topicId') || '';

  const { addToast } = useToast();
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [formData, setFormData] = useState({
    topicId: '',
    question: '',
    answers: [
      { key: 'A', text: '' },
      { key: 'B', text: '' },
      { key: 'C', text: '' },
      { key: 'D', text: '' },
    ],
    correctAnswer: 'A',
  });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [questionsData, topicsData] = await Promise.all([
        questionService.getAllQuestions(),
        topicService.getAllTopics(),
      ]);

      setQuestions(questionsData || []);
      setTopics(topicsData || []);
    } catch (err) {
      console.error('Lỗi khi tải câu hỏi:', err);
      addToast('Lỗi khi tải danh sách câu hỏi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setFormData({
      topicId: selectedTopicId || (topics[0]?._id || ''),
      question: '',
      answers: [
        { key: 'A', text: '' },
        { key: 'B', text: '' },
        { key: 'C', text: '' },
        { key: 'D', text: '' },
      ],
      correctAnswer: 'A',
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (q) => {
    setCurrentQuestion(q);
    const answers = ['A', 'B', 'C', 'D'].map((key) => {
      const found = q.answers?.find((a) => a.key === key);
      return { key, text: found ? found.text : '' };
    });

    setFormData({
      topicId: q.topicId?._id || q.topicId || '',
      question: q.question || '',
      answers,
      correctAnswer: q.correctAnswer || 'A',
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (q) => {
    setCurrentQuestion(q);
    setIsDeleteOpen(true);
  };

  const handleAnswerTextChange = (key, text) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((ans) => (ans.key === key ? { ...ans, text } : ans)),
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.topicId || !formData.question.trim()) {
      addToast('Vui lòng chọn chủ đề và nhập nội dung câu hỏi', 'warning');
      return;
    }

    const emptyAns = formData.answers.some((a) => !a.text.trim());
    if (emptyAns) {
      addToast('Vui lòng nhập đầy đủ 4 đáp án A, B, C, D', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      await questionService.createQuestion(formData);
      addToast('Tạo câu hỏi thành công!', 'success');
      setIsCreateOpen(false);
      fetchData();
    } catch (err) {
      console.error('Create question error:', err);
      addToast(err.message || 'Tạo câu hỏi thất bại', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.topicId || !formData.question.trim()) {
      addToast('Vui lòng chọn chủ đề và nhập nội dung câu hỏi', 'warning');
      return;
    }

    const emptyAns = formData.answers.some((a) => !a.text.trim());
    if (emptyAns) {
      addToast('Vui lòng nhập đầy đủ 4 đáp án A, B, C, D', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      await questionService.updateQuestion(currentQuestion._id, formData);
      addToast('Cập nhật câu hỏi thành công!', 'success');
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      console.error('Update question error:', err);
      addToast(err.message || 'Cập nhật thất bại', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await questionService.deleteQuestion(currentQuestion._id);
      addToast('Xóa câu hỏi thành công!', 'success');
      setIsDeleteOpen(false);
      fetchData();
    } catch (err) {
      console.error('Delete question error:', err);
      addToast(err.message || 'Xóa câu hỏi thất bại', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const qTopicId = q.topicId?._id || q.topicId;
    const matchesTopic = selectedTopicId ? qTopicId === selectedTopicId : true;
    const matchesSearch = (q.question || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Quản Lý Câu Hỏi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Soạn thảo, thiết lập đáp án trắc nghiệm và phân loại theo chủ đề
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Thêm Câu Hỏi Mới
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm kiếm nội dung câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', height: '44px' }}
          />
        </div>

        {/* Topic Filter Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select
            className="form-select"
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            style={{ height: '44px', width: '240px' }}
          >
            <option value="">-- Tất cả chủ đề ({questions.length}) --</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
        {loading ? (
          <LoadingSpinner message="Đang tải danh sách câu hỏi..." />
        ) : filteredQuestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            Không tìm thấy câu hỏi nào.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredQuestions.map((q, idx) => (
              <div
                key={q._id}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Card Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className="badge badge-primary">CÂU {idx + 1}</span>
                      <span className="badge badge-info">{q.topicId?.title || 'Chủ đề'}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {q.question}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => openEditModal(q)}
                      className="btn-icon btn-secondary"
                      style={{ width: '34px', height: '34px' }}
                      title="Chỉnh sửa câu hỏi"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(q)}
                      className="btn-icon btn-danger"
                      style={{ width: '34px', height: '34px' }}
                      title="Xóa câu hỏi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Answers Grid Preview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    borderTop: '1px solid var(--border-card)',
                    paddingTop: '12px',
                  }}
                >
                  {q.answers?.map((ans) => {
                    const isCorrect = q.correctAnswer === ans.key;
                    return (
                      <div
                        key={ans.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isCorrect ? 'var(--success-bg)' : 'var(--bg-surface)',
                          border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                          fontSize: '0.85rem',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 800,
                            color: isCorrect ? 'var(--success)' : 'var(--text-muted)',
                            width: '20px',
                          }}
                        >
                          {ans.key}.
                        </span>
                        <span style={{ color: 'var(--text-main)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ans.text}
                        </span>
                        {isCorrect && <CheckCircle2 size={14} color="var(--success)" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Create Question */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Thêm Câu Hỏi Mới" maxWidth="640px">
        <form onSubmit={handleCreate}>
          {/* Topic Select */}
          <div className="form-group">
            <label className="form-label">Chọn Chủ Đề *</label>
            <select
              className="form-select"
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              required
            >
              <option value="">-- Chọn một chủ đề --</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div className="form-group">
            <label className="form-label">Nội dung câu hỏi *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="VD: Thuộc tính nào dùng để căn giữa phần tử trong Flexbox?"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
            />
          </div>

          {/* 4 Answers */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
              Danh sách đáp án & Chọn đáp án đúng *
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.answers.map((ans) => {
                const isSelected = formData.correctAnswer === ans.key;

                return (
                  <div
                    key={ans.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--success-bg)' : 'var(--bg-subtle)',
                      border: `1px solid ${isSelected ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {/* Radio */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, minWidth: '46px' }}>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, correctAnswer: ans.key })}
                      />
                      {ans.key}
                    </label>

                    {/* Text Input */}
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Nội dung đáp án ${ans.key}...`}
                      value={ans.text}
                      onChange={(e) => handleAnswerTextChange(ans.key, e.target.value)}
                      style={{ padding: '8px 12px', height: '38px' }}
                      required
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Đang tạo...' : 'Tạo Câu Hỏi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Edit Question */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Chỉnh Sửa Câu Hỏi" maxWidth="640px">
        <form onSubmit={handleUpdate}>
          {/* Topic Select */}
          <div className="form-group">
            <label className="form-label">Chọn Chủ Đề *</label>
            <select
              className="form-select"
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              required
            >
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div className="form-group">
            <label className="form-label">Nội dung câu hỏi *</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
            />
          </div>

          {/* 4 Answers */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
              Danh sách đáp án & Chọn đáp án đúng *
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.answers.map((ans) => {
                const isSelected = formData.correctAnswer === ans.key;

                return (
                  <div
                    key={ans.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--success-bg)' : 'var(--bg-subtle)',
                      border: `1px solid ${isSelected ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, minWidth: '46px' }}>
                      <input
                        type="radio"
                        name="correctAnswerEdit"
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, correctAnswer: ans.key })}
                      />
                      {ans.key}
                    </label>

                    <input
                      type="text"
                      className="form-input"
                      value={ans.text}
                      onChange={(e) => handleAnswerTextChange(ans.key, e.target.value)}
                      style={{ padding: '8px 12px', height: '38px' }}
                      required
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsEditOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Delete Question */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Xác nhận xóa câu hỏi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}>
            <AlertTriangle size={24} color="var(--danger)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Bạn có chắc chắn muốn xóa câu hỏi này khỏi hệ thống không?
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button onClick={() => setIsDeleteOpen(false)} className="btn btn-secondary">
              Hủy bỏ
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={actionLoading}>
              {actionLoading ? 'Đang xóa...' : 'Xóa Câu Hỏi'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminQuestionsPage;
