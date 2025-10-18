const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const getToken = () => {
  return localStorage.getItem('quiz_token') || '';
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('quiz_token', token);
  } else {
    localStorage.removeItem('quiz_token');
  }
};

export const clearToken = () => {
  localStorage.removeItem('quiz_token');
  localStorage.removeItem('quiz_user');
};

async function request(endpoint, options = {}) {
  const token = getToken();
  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token && !options.public) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If token expired or unauthorized, clear storage if on 401
      if (response.status === 401 && !options.public) {
        // Clear expired token
        // clearToken();
      }
      const errorMsg = data.message || `Lỗi yêu cầu: ${response.statusText}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
