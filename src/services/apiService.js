// API Service for backend communication
import logger from '../utils/logger';

// Use full backend URL in development to bypass proxy issues
// If REACT_APP_API_URL is set, use it (should include /api)
// Otherwise, use localhost in dev or Render backend in production
let API_BASE_URL = process.env.REACT_APP_API_URL;

// Determine if we're in development (local machine) or production (deployed)
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.startsWith('192.168.') ||
                          window.location.hostname.startsWith('10.0.');

if (!API_BASE_URL) {
  // Fallback: use localhost in dev, or Render backend in production
  if (isLocalDevelopment) {
    API_BASE_URL = 'http://localhost:5001/api';
  } else {
    // Production/deployed - use Render backend
    API_BASE_URL = 'https://csi-final.onrender.com/api';
  }
} else {
  // If REACT_APP_API_URL is set, ensure it ends with /api
  // Remove trailing slash if present, then add /api
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '');
  if (!API_BASE_URL.endsWith('/api')) {
    API_BASE_URL = `${API_BASE_URL}/api`;
  }
}

// Log API URL for debugging (always log in browser console)
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📍 Hostname:', window.location.hostname);
console.log('🔧 Is Local Dev:', isLocalDevelopment);
console.log('🔑 REACT_APP_API_URL:', process.env.REACT_APP_API_URL || 'not set');

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
      console.log(`🚀 Making ${method} request to: ${url}`);
      const response = await fetch(url, config);
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      logger.api(method, endpoint, response.status);

      if (!response.ok) {
        logger.error('API request failed:', {
          endpoint,
          status: response.status,
          message: data.message,
          url
        });
        throw new Error(data.message || `API request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      // Enhanced error logging
      const errorMessage = error.message || 'Unknown error';
      const isNetworkError = errorMessage.includes('Failed to fetch') || 
                            errorMessage.includes('ERR_CONNECTION_REFUSED') ||
                            errorMessage.includes('NetworkError');
      
      if (isNetworkError) {
        console.error('❌ Network Error - Cannot connect to backend:', {
          url,
          endpoint,
          message: errorMessage,
          hint: 'Check if backend is running and CORS is configured correctly'
        });
        throw new Error(`Unable to connect to server. Please check if the backend is running at ${API_BASE_URL}`);
      }
      
      logger.error('API Error:', {
        endpoint,
        message: errorMessage,
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

