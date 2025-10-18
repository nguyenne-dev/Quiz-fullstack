import api from '../api/client';

export const questionService = {
  // Public / Member: Lấy câu hỏi theo topic để làm bài
  getQuestionsByTopic: async (topicId) => {
    const res = await api.get(`question/${topicId}`, { public: true });
    return res.questions || [];
  },

  // Admin: Lấy tất cả câu hỏi
  getAllQuestions: async () => {
    const res = await api.get('question/all');
    return res.questions || [];
  },

  createQuestion: async (data) => {
    return await api.post('question', data);
  },

  updateQuestion: async (id, data) => {
    return await api.patch(`question/${id}`, data);
  },

  deleteQuestion: async (id) => {
    return await api.delete(`question/${id}`);
  },
};

export default questionService;
