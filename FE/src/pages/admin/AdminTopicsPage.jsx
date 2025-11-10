import React, { useState, useEffect } from 'react';
import { topicService } from '../../services/topicService';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  HelpCircle, 
  AlertTriangle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminTopicsPage = () => {
  const { addToast } = useToast();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentTopic, setCurrentTopic] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await topicService.getAllTopics();
      setTopics(data || []);
    } catch (err) {
      console.error('Lỗi khi tải topics:', err);
      addToast('Lỗi khi tải danh sách chủ đề', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setIsCreateOpen(true);
  };

  const openEditModal = (topic) => {
    setCurrentTopic(topic);
    setTitle(topic.title);
    setDescription(topic.description);
    setIsEditOpen(true);
  };

  const openDeleteModal = (topic) => {
    setCurrentTopic(topic);
    setIsDeleteOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('Vui lòng nhập đầy đủ tiêu đề và mô tả', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      await topicService.createTopic({ title, description });
      addToast('Tạo chủ đề mới thành công!', 'success');
      setIsCreateOpen(false);
      fetchTopics();
    } catch (err) {
      console.error('Create topic error:', err);
      addToast(err.message || 'Tạo chủ đề thất bại', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('Vui lòng nhập đầy đủ tiêu đề và mô tả', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      await topicService.updateTopic(currentTopic._id, { title, description });
      addToast('Cập nhật chủ đề thành công!', 'success');
      setIsEditOpen(false);
      fetchTopics();
    } catch (err) {
      console.error('Update topic error:', err);
      addToast(err.message || 'Cập nhật thất bại', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await topicService.deleteTopic(currentTopic._id);
      addToast('Đã xóa chủ đề thành công!', 'success');
      setIsDeleteOpen(false);
      fetchTopics();
    } catch (err) {
      console.error('Delete topic error:', err);
      addToast(err.message || 'Không thể xóa chủ đề', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTopics = topics.filter((t) =>
    (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Quản Lý Chủ Đề</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tạo mới, chỉnh sửa và cấu hình các danh mục bộ đề thi
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Thêm Chủ Đề Mới
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '360px' }}>
        <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Tìm kiếm chủ đề..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '40px', height: '44px' }}
        />
      </div>

      {/* Topics Table Card */}
      <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
        {loading ? (
          <LoadingSpinner message="Đang tải danh sách chủ đề..." />
        ) : filteredTopics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            Không có chủ đề nào được tìm thấy.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>STT</th>
                  <th style={{ padding: '12px 16px' }}>Tiêu đề chủ đề</th>
                  <th style={{ padding: '12px 16px' }}>Mô tả</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((topic, idx) => (
                  <tr
                    key={topic._id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {topic.title}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.9rem' }}>
                      {topic.description}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          to={`/admin/questions?topicId=${topic._id}`}
                          className="btn-icon btn-secondary"
                          style={{ width: '34px', height: '34px' }}
                          title="Xem câu hỏi của chủ đề"
                        >
                          <HelpCircle size={16} />
                        </Link>
                        <button
                          onClick={() => openEditModal(topic)}
                          className="btn-icon btn-secondary"
                          style={{ width: '34px', height: '34px' }}
                          title="Chỉnh sửa chủ đề"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(topic)}
                          className="btn-icon btn-danger"
                          style={{ width: '34px', height: '34px' }}
                          title="Xóa chủ đề"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Create Topic */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Thêm Chủ Đề Mới">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Tiêu đề chủ đề *</label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: Lập trình JavaScript căn bản"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả ngắn gọn *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Nhập mô tả cho chủ đề này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Đang tạo...' : 'Tạo Chủ Đề'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Edit Topic */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Chỉnh Sửa Chủ Đề">
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Tiêu đề chủ đề *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả *</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsEditOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Delete Confirmation */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Xác nhận xóa chủ đề">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}>
            <AlertTriangle size={24} color="var(--danger)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Bạn có chắc chắn muốn xóa chủ đề <strong>"{currentTopic?.title}"</strong> không? Lưu ý: Không thể xóa nếu chủ đề đang chứa câu hỏi.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button onClick={() => setIsDeleteOpen(false)} className="btn btn-secondary">
              Hủy bỏ
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={actionLoading}>
              {actionLoading ? 'Đang xóa...' : 'Xóa Chủ Đề'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminTopicsPage;
