// src/services/api.js

export const API_URL = 'https://auth-microservice-stuf.onrender.com/api';

let token = null;

// ==================== INITIALIZATION ====================

/**
 * Initialize auth - load saved token from localStorage
 * Call this when your app starts!
 */
export function initAuth() {
  token = localStorage.getItem('accessToken');
  if (token) {
    console.log('✅ Found saved token');
  }
}

// ==================== AUTH STATUS ====================

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
  if (!token) {
    token = localStorage.getItem('accessToken');
  }
  return !!token;
}

/**
 * Get current user info
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout - clear token and user data
 */
export function logout() {
  token = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  console.log('👋 Logged out');
}

// ==================== AUTH ENDPOINTS ====================

/**
 * Login user - UPDATED to accept email and password
 */
export async function loginUser(email, password) {
  console.log('🔐 Logging in...');
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })  // Use parameters instead of hardcoded
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
  
  const data = await response.json();
  token = data.accessToken;

  // Store token in localStorage for persistence
  localStorage.setItem('accessToken', token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  console.log('✅ Logged in! Token:', token.substring(0, 30) + '...');
  return data;  // Return full data (includes user info)
}

/**
 * Register new user - NEW FUNCTION
 */
export async function registerUser(email, password, firstName = null, lastName = null) {
  console.log('📝 Registering new user...');
  
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  const data = await response.json();
  console.log('✅ Registered! Check email for verification code.');
  return data;
}

/**
 * Verify email with code - NEW FUNCTION
 */
export async function verifyEmail(email, code) {
  console.log('🔍 Verifying email...');
  
  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Verification failed. Please check your code.');
  }
  
  const data = await response.json();
  token = data.accessToken;
  
  // Store token in localStorage
  localStorage.setItem('accessToken', token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  console.log('✅ Email verified! Token:', token.substring(0, 30) + '...');
  return data;
}

// ==================== NOTES ENDPOINTS ====================

/**
 * Get all notes - UPDATED to handle token better
 */
export async function getNotes() {
  // Try to use saved token first
  if (!token) {
    token = localStorage.getItem('accessToken');
  }
  
  // If still no token, user needs to login
  if (!token) {
    throw new Error('Please login first');
  }
  
  console.log('📥 Fetching notes with token:', token.substring(0, 30) + '...');
  
  const response = await fetch(`${API_URL}/notes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Handle token expiration
  if (response.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to get notes: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Create a new note - UPDATED to handle token better
 */
export async function createNote(content) {
  // Try to use saved token first
  if (!token) {
    token = localStorage.getItem('accessToken');
  }
  
  if (!token) {
    throw new Error('Please login first');
  }
  
  console.log('📤 Creating note with token:', token.substring(0, 30) + '...');
  
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  
  // Handle token expiration
  if (response.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to create note: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Update existing note - UPDATED to handle token better
 */
export async function updateNote(id, content) {
  if (!token) {
    token = localStorage.getItem('accessToken');
  }
  
  if (!token) {
    throw new Error('Please login first');
  }
  
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  
  // Handle token expiration
  if (response.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to update note: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Delete a note - UPDATED to handle token better
 */
export async function deleteNote(id) {
  if (!token) {
    token = localStorage.getItem('accessToken');
  }
  
  if (!token) {
    throw new Error('Please login first');
  }
  
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Handle token expiration
  if (response.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
  
  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
  
  console.log('✅ Note deleted from backend');
}