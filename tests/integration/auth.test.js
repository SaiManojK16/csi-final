/**
 * Integration Tests for Authentication
 * Test Level: Integration
 * Components: Frontend UnifiedAuthPage.js + Backend server/routes/auth.js
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../server/models/User');
const authRoutes = require('../../server/routes/auth');

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Flow - User Signup', () => {
  // Test 16: Complete user registration flow
  // Purpose: Verify complete user registration flow from frontend form submission to backend user creation
  
  beforeEach(async () => {
    // Clean up test users
    await User.deleteMany({ email: /test@example\.com/ });
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  it('should create user in database on signup', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
    
    // Verify user exists in database
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeDefined();
    expect(user.password).not.toBe('testpass123'); // Should be hashed
  });
  
  it('should reject duplicate email/username', async () => {
    // Create first user
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
    
    // Try to create duplicate
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('Authentication Flow - User Login', () => {
  // Test 17: Complete user login flow
  // Purpose: Verify complete user login flow including password verification and token generation
  
  let testUser;
  
  beforeEach(async () => {
    // Create test user
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123'
    });
    await testUser.save();
  });
  
  afterEach(async () => {
    await User.deleteMany({ email: /test@example\.com/ });
  });
  
  it('should return JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpass123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
  });
  
  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe('Authentication Flow - Protected Route Access', () => {
  // Test 18: Protected route access with authentication middleware
  // Purpose: Verify that protected API endpoints correctly validate JWT tokens
  
  let testUser;
  let authToken;
  
  beforeEach(async () => {
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123'
    });
    await testUser.save();
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpass123'
      });
    authToken = loginResponse.body.token;
  });
  
  afterEach(async () => {
    await User.deleteMany({ email: /test@example\.com/ });
  });
  
  it('should access protected route with valid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeDefined();
  });
  
  it('should return 401 without token', async () => {
    const response = await request(app)
      .get('/api/auth/me');
    
    expect(response.status).toBe(401);
  });
  
  it('should return 401 with invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(401);
  });
});


