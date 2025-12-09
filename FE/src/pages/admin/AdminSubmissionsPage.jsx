import React, { useState, useEffect } from 'react';
import { submissionService } from '../../services/submissionService';
import { topicService } from '../../services/topicService';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Award,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  BookOpen,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  X,
  Sparkles,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminSubmissionsPage = () => {
  const { addToast } = useToast();

  // Data states
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState('ALL'); // 'ALL' | 'CORRECT' | 'WRONG'

  // Fetch initial data
  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [submissionsData, statsData, topicsData] = await Promise.all([
        submissionService.getAllSubmissionsAdmin({
          search: searchQuery,
          topicId: selectedTopic,
          grade: selectedGrade,
          sortBy: sortBy,
        }),
        submissionService.getAdminSubmissionStats(),
        topicService.getAllTopics().catch(() => []),
      ]);

      setSubmissions(submissionsData || []);
      setStats(statsData || null);
      setTopics(topicsData || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu bài thi admin:', err);
      addToast('Lỗi khi tải dữ liệu quản lý bài thi', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTopic, selectedGrade, sortBy]);

  // Handle manual search trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
    setCurrentPage(1);
  };

  // View detail of a submission
  const handleViewDetail = async (submissionId) => {
    try {
      setDetailLoadingId(submissionId);
      const detail = await submissionService.getAdminSubmissionDetail(submissionId);
      setSelectedSubmission(detail);
      setModalFilter('ALL');
    } catch (err) {
      console.error('Lỗi khi xem chi tiết bài thi:', err);
      addToast('Không thể tải chi tiết bài làm của thí sinh', 'error');
    } finally {
      setDetailLoadingId(null);
    }
  };

  // Confirm delete submission
  const handleDeleteSubmission = async () => {
    if (!deletingId) return;
    try {
      await submissionService.deleteSubmissionAdmin(deletingId);
      addToast('Đã xóa lượt làm bài thành công', 'success');
      setSubmissions((prev) => prev.filter((item) => item._id !== deletingId));
      setDeleteModalOpen(false);
      setDeletingId(null);
      // Reload stats
      const newStats = await submissionService.getAdminSubmissionStats();
      setStats(newStats);
    } catch (err) {
      console.error('Lỗi khi xóa bài thi:', err);
      addToast(err.message || 'Lỗi khi xóa bài thi', 'error');
    }
  };

  // Export to CSV / Excel (with UTF-8 BOM)
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      addToast('Không có dữ liệu bài thi để xuất báo cáo', 'warning');
      return;
    }

    try {
      const headers = ['STT', 'Họ và tên thí sinh', 'Email', 'Chủ đề bài thi', 'Điểm số', 'Tổng câu hỏi', 'Tỉ lệ đúng (%)', 'Xếp loại', 'Thời lượng (giây)', 'Ngày làm bài'];
      const rows = submissions.map((sub, index) => [
        index + 1,
        `"${sub.user?.fullname || 'Ẩn danh'}"`,
        `"${sub.user?.email || 'N/A'}"`,
        `"${sub.topic?.title || 'N/A'}"`,
        sub.score,
        sub.totalQuestions,
        `${sub.percentage}%`,
        sub.gradeType === 'excellent' ? 'Xuất sắc' : sub.gradeType === 'passed' ? 'Đạt' : 'Chưa đạt',
        sub.durationSeconds,
        `"${new Date(sub.submittedAt).toLocaleString('vi-VN')}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const dateStr = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `Bao_cao_ket_qua_thi_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Đã xuất báo cáo CSV thành công!', 'success');
    } catch (err) {
      console.error('Lỗi khi xuất CSV:', err);
      addToast('Lỗi khi xuất file báo cáo', 'error');
    }
  };

  // Format helpers
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '< 1 phút';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} giây`;
    return `${mins}p ${secs}s`;
  };

  const getGradeBadge = (gradeType) => {
    switch (gradeType) {
      case 'excellent':
        return <span className="badge badge-success" style={{ fontWeight: 700 }}>Xuất sắc (≥ 80%)</span>;
      case 'passed':
        return <span className="badge badge-primary" style={{ fontWeight: 700 }}>Đạt (≥ 50%)</span>;
      default:
        return <span className="badge badge-danger" style={{ fontWeight: 700 }}>Chưa đạt (&lt; 50%)</span>;
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(submissions.length / itemsPerPage);
  const currentSubmissions = submissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter questions for Modal
  const modalQuestions = (selectedSubmission?.questions || []).filter((q) => {
    if (modalFilter === 'CORRECT') return q.isCorrect;
    if (modalFilter === 'WRONG') return !q.isCorrect;
    return true;
  });

  const modalCorrectCount = (selectedSubmission?.questions || []).filter((q) => q.isCorrect).length;
  const modalWrongCount = (selectedSubmission?.questions || []).length - modalCorrectCount;

  if (loading && !refreshing) {
    return <LoadingSpinner size="large" message="Đang tải dữ liệu bài thi & thống kê..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header & Export Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.12) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Award size={26} color="var(--primary)" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Quản Lý Lượt Làm Bài & Thống Kê Điểm Số
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Theo dõi chi tiết thí sinh tham gia làm bài kiểm tra, phân tích xếp loại điểm số và xuất báo cáo kết quả.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => loadData(true)}
            className="btn btn-secondary btn-sm"
            title="Làm mới dữ liệu"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'spinning' : ''} /> Làm mới
          </button>

          <button
            onClick={handleExportCSV}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Xuất Báo Cáo (CSV/Excel)
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Metric 1: Total Submissions */}
        <div className="glass-card" style={{ padding: '22px 24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <BookOpen size={22} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>LƯỢT THI</span>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2px' }}>
            {stats?.totalSubmissions || submissions.length}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tổng số bài nộp hoàn thành</p>
        </div>

        {/* Metric 2: Unique Candidates */}
        <div className="glass-card" style={{ padding: '22px 24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
              <Users size={22} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>THÍ SINH</span>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2px' }}>
            {stats?.totalCandidates || 0}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Thí sinh đã tham gia thi</p>
        </div>

        {/* Metric 3: System Average Score */}
        <div className="glass-card" style={{ padding: '22px 24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
              <TrendingUp size={22} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ĐIỂM TRUNG BÌNH</span>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2px', color: '#eab308' }}>
            {stats?.averageScorePercent || 0}%
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Trung bình toàn hệ thống</p>
        </div>

        {/* Metric 4: Pass Rate */}
        <div className="glass-card" style={{ padding: '22px 24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <CheckCircle2 size={22} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>TỈ LỆ ĐẠT CHUẨN</span>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2px', color: 'var(--success)' }}>
            {stats?.passRate || 0}%
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Xuất sắc: {stats?.excellentRate || 0}%</p>
        </div>
      </div>

      {/* Analytics Breakdown: Score Distribution & Topic Breakdown */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          
          {/* Box 1: Score Distribution */}
          <div className="glass-card" style={{ padding: '22px 24px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BarChart3 size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Phổ Điểm Toàn Hệ Thống</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '81% - 100% (Xuất sắc)', count: stats.scoreBrackets?.bracket81_100 || 0, color: '#10b981' },
                { label: '61% - 80% (Khá)', count: stats.scoreBrackets?.bracket61_80 || 0, color: '#6366f1' },
                { label: '41% - 60% (Trung bình)', count: stats.scoreBrackets?.bracket41_60 || 0, color: '#f59e0b' },
                { label: '21% - 40% (Yếu)', count: stats.scoreBrackets?.bracket21_40 || 0, color: '#f97316' },
                { label: '0% - 20% (Kém)', count: stats.scoreBrackets?.bracket0_20 || 0, color: '#ef4444' },
              ].map((item, idx) => {
                const total = stats.totalSubmissions || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ fontWeight: 700 }}>{item.count} bài ({pct}%)</span>
                    </div>
                    <div style={{ height: '7px', width: '100%', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Box 2: Topic Breakdown */}
          <div className="glass-card" style={{ padding: '22px 24px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BookOpen size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Hiệu Suất Theo Chủ Đề</h3>
            </div>

            {stats.topicStats && stats.topicStats.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto' }}>
                {stats.topicStats.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{t.topicTitle}</p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.attempts} lượt làm bài</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>ĐTB: {t.avgPercentage}%</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Tỉ lệ đạt: {t.passRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có đủ dữ liệu thống kê chủ đề.</p>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '18px 22px',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1 1 280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo tên học sinh, email, bài thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px', width: '100%', height: '42px' }}
          />
        </form>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Topic filter */}
          <select
            className="form-select"
            value={selectedTopic}
            onChange={(e) => { setSelectedTopic(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto', minWidth: '170px', height: '42px' }}
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>{t.title}</option>
            ))}
          </select>

          {/* Grade filter */}
          <select
            className="form-select"
            value={selectedGrade}
            onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto', minWidth: '150px', height: '42px' }}
          >
            <option value="all">Tất cả xếp loại</option>
            <option value="excellent">Xuất sắc (≥ 80%)</option>
            <option value="passed">Đạt (≥ 50%)</option>
            <option value="failed">Chưa đạt (&lt; 50%)</option>
          </select>

          {/* Sort selector */}
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto', minWidth: '160px', height: '42px' }}
          >
            <option value="newest">Mới nhất trước</option>
            <option value="oldest">Cũ nhất trước</option>
            <option value="score_desc">Điểm cao nhất</option>
            <option value="score_asc">Điểm thấp nhất</option>
            <option value="duration_asc">Làm nhanh nhất</option>
            <option value="duration_desc">Làm lâu nhất</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="glass-card" style={{ padding: '0', backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
            Danh Sách Lượt Làm Bài ({submissions.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Trang {currentPage} / {Math.max(1, totalPages)}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '14px 20px' }}>Thí Sinh</th>
                <th style={{ padding: '14px 16px' }}>Đề Thi / Chủ Đề</th>
                <th style={{ padding: '14px 16px' }}>Điểm Số & Tỉ Lệ</th>
                <th style={{ padding: '14px 16px' }}>Xếp Loại</th>
                <th style={{ padding: '14px 16px' }}>Thời Gian</th>
                <th style={{ padding: '14px 20px', textAlign: 'center' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <AlertCircle size={32} color="var(--text-muted)" />
                      <p style={{ fontSize: '1rem', fontWeight: 600 }}>Không tìm thấy bài làm nào phù hợp bộ lọc.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentSubmissions.map((sub) => (
                  <tr
                    key={sub._id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    className="table-row-hover"
                  >
                    {/* Candidate info */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'var(--primary-gradient)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            flexShrink: 0,
                          }}
                        >
                          {sub.user?.fullname ? sub.user.fullname.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{sub.user?.fullname}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Topic */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        className="badge badge-secondary"
                        style={{ fontWeight: 600, fontSize: '0.85rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block' }}
                      >
                        {sub.topic?.title}
                      </span>
                    </td>

                    {/* Score & Progress bar */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 800 }}>{sub.score} / {sub.totalQuestions} câu</span>
                          <span style={{ fontWeight: 700, color: sub.percentage >= 80 ? 'var(--success)' : sub.percentage >= 50 ? 'var(--primary)' : 'var(--danger)' }}>
                            {sub.percentage}%
                          </span>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${sub.percentage}%`,
                              backgroundColor: sub.percentage >= 80 ? 'var(--success)' : sub.percentage >= 50 ? 'var(--primary)' : 'var(--danger)',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Grade */}
                    <td style={{ padding: '14px 16px' }}>
                      {getGradeBadge(sub.gradeType)}
                    </td>

                    {/* Timing */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: 600 }}>{new Date(sub.submittedAt).toLocaleDateString('vi-VN')} {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {formatDuration(sub.durationSeconds)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => handleViewDetail(sub._id)}
                          className="btn btn-secondary btn-sm"
                          title="Xem chi tiết bài làm"
                          style={{ padding: '6px 10px' }}
                          disabled={detailLoadingId === sub._id}
                        >
                          {detailLoadingId === sub._id ? (
                            <RefreshCw size={15} className="spinning" />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setDeletingId(sub._id);
                            setDeleteModalOpen(true);
                          }}
                          className="btn btn-icon btn-sm"
                          style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '6px 8px' }}
                          title="Xóa bài làm này"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, submissions.length)} trong tổng số {submissions.length} bài
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} /> Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '34px', padding: '4px 8px' }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Review Exam Submission Detail */}
      {selectedSubmission && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '840px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              position: 'relative',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                  {selectedSubmission.topic?.title || 'Bài thi trắc nghiệm'}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Chi Tiết Bài Làm Của Thí Sinh</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Thí sinh: <strong>{selectedSubmission.user?.fullname}</strong> ({selectedSubmission.user?.email})
                </p>
              </div>
              <button
                className="btn-icon btn-secondary"
                onClick={() => setSelectedSubmission(null)}
                style={{ width: '36px', height: '36px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Score Overview Panel */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '14px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                marginBottom: '20px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Điểm số</span>
                <p style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {selectedSubmission.score} / {selectedSubmission.totalQuestions}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Tỉ lệ đúng</span>
                <p style={{ fontSize: '1.3rem', fontWeight: 900, color: selectedSubmission.percentage >= 50 ? 'var(--success)' : 'var(--danger)' }}>
                  {selectedSubmission.percentage}%
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Thời gian làm</span>
                <p style={{ fontSize: '1.3rem', fontWeight: 900 }}>
                  {formatDuration(selectedSubmission.durationSeconds)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ngày nộp bài</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>
                  {new Date(selectedSubmission.submittedAt).toLocaleDateString('vi-VN')} {new Date(selectedSubmission.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Filter Buttons for Questions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Danh Sách Câu Hỏi ({modalQuestions.length})
              </h3>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setModalFilter('ALL')}
                  className={`btn btn-sm ${modalFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  Tất cả ({(selectedSubmission.questions || []).length})
                </button>
                <button
                  onClick={() => setModalFilter('CORRECT')}
                  className={`btn btn-sm ${modalFilter === 'CORRECT' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.8rem', backgroundColor: modalFilter === 'CORRECT' ? 'var(--success)' : '' }}
                >
                  Đúng ({modalCorrectCount})
                </button>
                <button
                  onClick={() => setModalFilter('WRONG')}
                  className={`btn btn-sm ${modalFilter === 'WRONG' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 10px', fontSize: '0.8rem', backgroundColor: modalFilter === 'WRONG' ? 'var(--danger)' : '' }}
                >
                  Sai ({modalWrongCount})
                </button>
              </div>
            </div>

            {/* Questions Review List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {modalQuestions.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Không có câu hỏi nào thuộc bộ lọc này.
                </div>
              ) : (
                modalQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${q.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      backgroundColor: q.isCorrect ? 'rgba(16, 185, 129, 0.04)' : 'rgba(239, 68, 68, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>
                        Câu {idx + 1}: {q.question}
                      </h4>
                      {q.isCorrect ? (
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <CheckCircle2 size={14} /> Đúng (+1.0)
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <XCircle size={14} /> Sai (0)
                        </span>
                      )}
                    </div>

                    {/* Answers choices safely handling object or string items */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.85rem' }}>
                      {q.answers && q.answers.map((ans, ansIdx) => {
                        const optKey = (typeof ans === 'object' && ans !== null) ? (ans.key || ['A', 'B', 'C', 'D'][ansIdx]) : ['A', 'B', 'C', 'D'][ansIdx];
                        const optText = (typeof ans === 'object' && ans !== null) ? (ans.text || '') : String(ans || '');
                        
                        const isCandidateChoice = q.selectedAnswer === optKey;
                        const isCorrectAnswer = q.correctAnswer === optKey;

                        let borderColor = 'var(--border-subtle)';
                        let bg = 'var(--bg-surface)';
                        let textTag = null;

                        if (isCorrectAnswer && isCandidateChoice) {
                          borderColor = '#10b981';
                          bg = 'rgba(16, 185, 129, 0.14)';
                          textTag = <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.75rem' }}>✓ Thí sinh chọn đúng</span>;
                        } else if (isCorrectAnswer) {
                          borderColor = '#10b981';
                          bg = 'rgba(16, 185, 129, 0.10)';
                          textTag = <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.75rem' }}>★ Đáp án đúng</span>;
                        } else if (isCandidateChoice) {
                          borderColor = '#ef4444';
                          bg = 'rgba(239, 68, 68, 0.12)';
                          textTag = <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>✗ Thí sinh chọn sai</span>;
                        }

                        return (
                          <div
                            key={ansIdx}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: `1px solid ${borderColor}`,
                              backgroundColor: bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, width: '20px' }}>{optKey}.</span>
                              <span>{optText}</span>
                            </div>
                            {textTag}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Modal */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedSubmission(null)} className="btn btn-secondary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '450px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Trash2 size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Xác Nhận Xóa Lượt Thi?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Hành động này sẽ xóa vĩnh viễn bài làm và toàn bộ chi tiết câu trả lời của thí sinh. Thao tác này không thể hoàn tác.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
                Hủy bỏ
              </button>
              <button className="btn btn-danger" onClick={handleDeleteSubmission}>
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: var(--bg-subtle) !important;
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminSubmissionsPage;
