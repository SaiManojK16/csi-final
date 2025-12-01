/**
 * Unit Tests for API Service
 * Test Level: Unit
 * Component: src/services/apiService.js
 */

import apiService from '../../src/services/apiService';

// Mock fetch
global.fetch = jest.fn();

describe('API Service - Token Management', () => {
  // Test 4: Token storage and retrieval
  // Purpose: Verify that the API service correctly stores, retrieves, and removes authentication tokens
  beforeEach(() => {
    localStorage.clear();
    apiService.setToken(null);
  });
  
  it('should store token in localStorage', () => {
    const token = 'test-token-123';
    apiService.setToken(token);
    expect(localStorage.getItem('acceptly_token')).toBe(token);
  });
  
  it('should include Authorization header when token exists', () => {
    const token = 'test-token-123';
    apiService.setToken(token);
    const headers = apiService.getHeaders();
    expect(headers['Authorization']).toBe(`Bearer ${token}`);
  });
  
  it('should remove token from localStorage when set to null', () => {
    apiService.setToken('test-token');
    apiService.setToken(null);
    expect(localStorage.getItem('acceptly_token')).toBeNull();
  });
});

describe('API Service - Request Method', () => {
  // Test 5: Generic request method
  // Purpose: Verify that the request method correctly constructs API URLs and handles errors
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });
  
  it('should append endpoint to API_BASE_URL', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });
    
    await apiService.request('/test-endpoint');
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.any(Object)
    );
  });
  
  it('should throw error on non-OK responses', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ success: false, message: 'Bad request' })
    });
    
    await expect(apiService.request('/test-endpoint')).rejects.toThrow();
  });
});


