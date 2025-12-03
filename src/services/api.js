/**
 * API Service - Auth management
 * Handles all HTTP requests to Spring-Boot backend
 */

const API_URL = 'http://localhost:8080/api';


/**
 * Getting stored JWT token from localStorage 
 */
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};


/**
 * Storing authentication tokens
 */
const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
    if(refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
};


/**
 * Clearing authentication tokens used for logging-out
 */
const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};


/**
 * Making authenticated API request with JWT token
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  //adding authorization header if token exists
  if(token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } 
    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      //Handling 401 Unauthorized = expired or invalid token
      if(response.status === 401) {
        clearAuthTokens();
        window.dispatchEvent(new Event('auth-expired'));
        throw new Error('Session expired. Please login again');
      }
      //Returning parsed JSON or null for 204 No Content
      return response.status === 204 ? null : await response.json();
    } catch(error) {
      console.error('API Request Error:', error);
      throw error;
    }
};



//================ AUTH ENDPOINTS ========================================================== 
/**
 * Registering a new user
 * @param {Object} userData - { email, password, firstName, lastName?, phoneNumber? }
 * @returns {Promise<Object>} User data (no tokens until email is verified)
 */
export const register = async (userData) => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};


/**
 * Verifying user email with 6-digit code, code expires in 15 minutes.
 * @param {Object} data - { email, code }
 * @returns {Promise<Object} { accessToken, refreshToken, user } 
 */
export const verifyEmail = async (data) => {
  const response = await apiRequest('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
    // Storing token after successful verification 
    if(response.accessToken) {
      setAuthTokens(response.accessToken, response.refreshToken) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    return response;
};


/**
 * Logging in existing user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} { accessToken, refreshToken, user }
 */
export const login = async (credentials) => {
  console.log('🔐 Logging in...');
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  // Storing tokens and user data
  if(response.accessToken) {
    setAuthTokens(response.accessToken, response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    console.log('✅ Logged in! Token:', response.accessToken.substring(0, 30) + '...');
  }
  return response;
};


/**
 * Logout user / clear local tokens
 */
export const logout = () => {
  clearAuthTokens();
  window.location.reload(); //Refreshes to clear state
};


/**
 *Check if user is authenticated 🛡
 @returns {boolean} 
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};


/**
 * Getting current user data from localStorage
 * @returns {Object || null}
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ================ NOTES ENDPOINTS ==================

/**
 * Get all notes for authenticated user
 * @returns {Promise<Array>} Array of notes
 */
export const getNotes = async () => {
  console.log('🔖 Fetching notes...');
  return await apiRequest('/notes', {
    method: 'GET',
  });
};

/**
 * Create a new note
 * @param {String} content - Note content
 * @returns {Promise<Object} Created note
 */
export const createNote = async (content) => {
  console.log('📝 Creating note...');
  return await apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

/**
 * Update existing note
 * @param {number} id - Note ID
 * @param {string} content - Updated content 
 * @returns {Promise<Object>} - Updated Note
 */
export const updateNote = async (id, content) => {
  console.log('📈 Updating note ID:', id);
  return await apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
};


/**
 * Delete a note
 * @param {number} id - Note ID 
 * @returns {Promise<void>}
 */
export const deleteNote = async (id) => {
  console.log("🗑 Deleting note ID:", id);
  return await apiRequest(`/notes/${id}`, {
      method: 'DELETE',
  });
};

//Exporting utility functions
export {
  isAuthenticated,
  getCurrentUser,
  logout,
  clearAuthTokens
};