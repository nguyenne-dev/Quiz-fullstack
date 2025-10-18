import api from '../api/client';

export const topicService = {
  getAllTopics: async () => {
    const res = await api.get('topic', { public: true });
    return res.topics || [];
  },

  getTopicById: async (id) => {
    const res = await api.get(`topic/${id}`, { public: true });
    return res.topic || null;
  },

  createTopic: async (data) => {
    return await api.post('topic', data);
  },

  updateTopic: async (id, data) => {
    return await api.put(`topic/${id}`, data);
  },

  deleteTopic: async (id) => {
    return await api.delete(`topic/${id}`);
  },
};

export default topicService;
