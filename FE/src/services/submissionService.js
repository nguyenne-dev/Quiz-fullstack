import api from '../api/client';

export const submissionService = {
  // Lấy danh sách bài làm của user hiện tại
  getAllSubmissions: async () => {
    const res = await api.get('submission');
    return res.data || [];
  },

  // Lấy chi tiết bài làm
  getSubmissionById: async (id) => {
    const res = await api.get(`submission/${id}`);
    return res.data || null;
  },

  // Nộp bài thi
  createSubmission: async (submissionData) => {
    return await api.post('submission', submissionData);
  },
};

export default submissionService;
