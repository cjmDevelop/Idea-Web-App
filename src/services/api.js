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
 * Check if token is expired
 */
function isTokenExpired() {
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime) {
    return true; // No expiration time = assume expired
  }
  return Date.now() > parseInt(expirationTime);
}

/**
 * Check if user is logged in (with token expiration check)
 */
export function isLoggedIn() {
  if (!token) {
    token = localStorage.getItem('accessToken');
  }

  // If no token, not logged in
  if (!token) {
    return false;
  }

  // If token is expired, logout and return false
  if (isTokenExpired()) {
    console.log('⏰ Token expired, logging out...');
    logout();
    return false;
  }

  return true;
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
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiration');
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

  // Store tokens in localStorage for persistence
  localStorage.setItem('accessToken', token);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));

  // Store token expiration time (24 hours from now - 86400000ms)
  const expirationTime = Date.now() + 86400000;
  localStorage.setItem('tokenExpiration', expirationTime.toString());

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
    body: JSON.stringify({ email, password, firstName, lastName, appSource: 'RANDOM_WRITES' })
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

  // Store tokens in localStorage
  localStorage.setItem('accessToken', token);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));

  // Store token expiration time (24 hours from now - 86400000ms)
  const expirationTime = Date.now() + 86400000;
  localStorage.setItem('tokenExpiration', expirationTime.toString());

  console.log('✅ Email verified! Token:', token.substring(0, 30) + '...');
  return data;
}

/**
 * Resend verification email - NEW FUNCTION
 */
export async function resendVerificationEmail(email) {
  console.log('📧 Resending verification email...');

  const response = await fetch(`${API_URL}/auth/resend-verification-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to resend verification email.');
  }

  const data = await response.json();
  console.log('✅ Verification email sent!');
  return data;
}

/**
 * Refresh access token using refresh token
 * Called automatically when access token expires
 */
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  console.log('🔄 Refreshing access token...');

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    // Refresh token is invalid or expired
    logout();
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();
  token = data.accessToken;

  // Update tokens in localStorage
  localStorage.setItem('accessToken', token);
  localStorage.setItem('refreshToken', data.refreshToken);

  // Update token expiration time (24 hours from now)
  const expirationTime = Date.now() + 86400000;
  localStorage.setItem('tokenExpiration', expirationTime.toString());

  console.log('✅ Access token refreshed successfully!');
  return token;
}

// ==================== NOTES ENDPOINTS ====================

/**
 * Get all notes - UPDATED with automatic token refresh
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

  let response = await fetch(`${API_URL}/notes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Handle token expiration (401 = unauthorized, 403 = forbidden/expired)
  if (response.status === 401 || response.status === 403) {
    console.log('🔄 Token expired, attempting to refresh...');

    try {
      // Try to refresh the access token
      token = await refreshAccessToken();

      // Retry the request with new token
      response = await fetch(`${API_URL}/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get notes: ${response.status}`);
      }
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to get notes: ${response.status}`);
  }

  return await response.json();
}

/**
 * Create a new note - UPDATED with automatic token refresh
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

  let response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });

  // Handle token expiration (401 = unauthorized, 403 = forbidden/expired)
  if (response.status === 401 || response.status === 403) {
    console.log('🔄 Token expired, attempting to refresh...');

    try {
      // Try to refresh the access token
      token = await refreshAccessToken();

      // Retry the request with new token
      response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error(`Failed to create note: ${response.status}`);
      }
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to create note: ${response.status}`);
  }

  return await response.json();
}

/**
 * Update existing note - UPDATED with automatic token refresh
 */
export async function updateNote(id, content) {
  if (!token) {
    token = localStorage.getItem('accessToken');
  }

  if (!token) {
    throw new Error('Please login first');
  }

  let response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });

  // Handle token expiration (401 = unauthorized, 403 = forbidden/expired)
  if (response.status === 401 || response.status === 403) {
    console.log('🔄 Token expired, attempting to refresh...');

    try {
      // Try to refresh the access token
      token = await refreshAccessToken();

      // Retry the request with new token
      response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.status}`);
      }
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to update note: ${response.status}`);
  }

  return await response.json();
}

/**
 * Delete a note - UPDATED with automatic token refresh
 */
export async function deleteNote(id) {
  if (!token) {
    token = localStorage.getItem('accessToken');
  }

  if (!token) {
    throw new Error('Please login first');
  }

  let response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Handle token expiration (401 = unauthorized, 403 = forbidden/expired)
  if (response.status === 401 || response.status === 403) {
    console.log('🔄 Token expired, attempting to refresh...');

    try {
      // Try to refresh the access token
      token = await refreshAccessToken();

      // Retry the request with new token
      response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }

  console.log('✅ Note deleted from backend');
}