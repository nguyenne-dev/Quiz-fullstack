import api, { setToken, clearToken } from '../api/client';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('auth/login', credentials, { public: true });
    if (res.token) {
      setToken(res.token);
      localStorage.setItem('quiz_user', JSON.stringify(res.user));
    }
    return res;
  },

  register: async (userData) => {
    return await api.post('auth/send-verify-mail', userData, { public: true });
  },

  verifyEmail: async (token) => {
    return await api.get(`auth/verify?token=${encodeURIComponent(token)}`, { public: true });
  },

  getMe: async () => {
    const res = await api.get('auth/me');
    return res.data || res.user || res;
  },

  updateProfile: async (data) => {
    return await api.patch('auth/me', data);
  },

  sendResetPasswordEmail: async (email) => {
    return await api.post('auth/send-repass-email', { email }, { public: true });
  },

  resetPassword: async (token, password) => {
    return await api.post(`auth/reset-password?token=${encodeURIComponent(token)}`, { password }, { public: true });
  },

  // Admin APIs
  getAllUsers: async () => {
    const res = await api.get('auth/alluser');
    return res.data || [];
  },

  updateUserStatus: async (userId, status) => {
    return await api.patch(`auth/status/${userId}`, { status });
  },

  updateUserRole: async (userId, role) => {
    return await api.patch(`auth/role/${userId}`, { role });
  },

  logout: () => {
    clearToken();
  },
};

export default authService;
