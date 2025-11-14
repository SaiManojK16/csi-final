// API Service for backend communication

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

    // Add timeout for production (Render free tier can take 30s to wake up)
    const timeout = process.env.NODE_ENV === 'production' ? 60000 : 30000; // 60s for production, 30s for dev
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    console.log('🔵 API Request:', {
      url,
      method: config.method || 'GET',
      endpoint,
      API_BASE_URL,
    });

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      console.log('🟢 API Response Status:', response.status, response.statusText);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response format. Expected JSON, got: ${contentType}. Response: ${text.substring(0, 100)}`);
      }
      
      const data = await response.json();
      console.log('📦 API Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('🔴 API Error:', error);
      console.error('🔴 Error Details:', {
        message: error.message,
        endpoint,
        url,
      });
      
      // Provide user-friendly error messages
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. The server may be starting up. Please try again in a few seconds.');
      }
      
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

