// API Service for backend communication
import logger from '../utils/logger';

// Use full backend URL in development to bypass proxy issues
// If REACT_APP_API_URL is set, use it (should include /api)
// Otherwise, use localhost in dev or /api in production
let API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  // Fallback: use localhost in dev, or /api in production
  API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/api' 
    : '/api';
} else {
  // If REACT_APP_API_URL is set, ensure it ends with /api
  // Remove trailing slash if present, then add /api
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '');
  if (!API_BASE_URL.endsWith('/api')) {
    API_BASE_URL = `${API_BASE_URL}/api`;
  }
}

class APIService {
  constructor() {
    this.token = localStorage.getItem('acceptly_token');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('acceptly_token', token);
    } else {
      localStorage.removeItem('acceptly_token');
    }
  }

  // Get headers with auth token
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(),
    };

    const method = config.method || 'GET';
    logger.api(method, endpoint, 'pending');

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      logger.api(method, endpoint, response.status);

      if (!response.ok) {
        logger.error('API request failed:', {
          endpoint,
          status: response.status,
          message: data.message
        });
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      logger.error('API Error:', {
        endpoint,
        message: error.message,
        url
      });
      throw error;
    }
  }

  // Auth endpoints
  async signup(username, email, password) {
    return await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(email, password) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async resetPassword(email) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Problem endpoints
  async getProblems(filters = {}) {
    const params = new URLSearchParams(filters);
    return await this.request(`/problems?${params}`);
  }

  async getProblemById(id) {
    return await this.request(`/problems/${id}`);
  }

  // Progress endpoints
  async getProgress() {
    return await this.request('/progress');
  }

  async updateFAProgress(problemId, data) {
    return await this.request(`/progress/fa/${problemId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuizProgress(quizId, data) {
    return await this.request(`/progress/quiz/${quizId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new APIService();
export default apiService;

