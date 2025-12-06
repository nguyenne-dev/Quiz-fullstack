import api from '../api/client';

export const submissionService = {
  // Lấy danh sách bài làm của user hiện tại
  getAllSubmissions: async () => {
    const res = await api.get('submission');
    return res.data || [];
  },

  // Lấy chi tiết bài làm của user
  getSubmissionById: async (id) => {
    const res = await api.get(`submission/${id}`);
    return res.data || null;
  },

  // Nộp bài thi
  createSubmission: async (submissionData) => {
    return await api.post('submission', submissionData);
  },

  // ===================================
  // ADMIN API SERVICES
  // ===================================

  // Lấy danh sách toàn bộ bài thi kèm bộ lọc (Admin)
  getAllSubmissionsAdmin: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.topicId) query.append('topicId', params.topicId);
    if (params.grade) query.append('grade', params.grade);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString();
    const endpoint = queryString ? `submission/admin/all?${queryString}` : 'submission/admin/all';
    const res = await api.get(endpoint);
    return res.data || [];
  },

  // Lấy thống kê báo cáo toàn diện (Admin)
  getAdminSubmissionStats: async () => {
    const res = await api.get('submission/admin/stats');
    return res.data || null;
  },

  // Lấy chi tiết bài làm của bất kỳ thí sinh nào (Admin)
  getAdminSubmissionDetail: async (id) => {
    const res = await api.get(`submission/admin/${id}`);
    return res.data || null;
  },

  // Xóa lượt làm bài thi (Admin)
  deleteSubmissionAdmin: async (id) => {
    return await api.delete(`submission/admin/${id}`);
  },
};

export default submissionService;

