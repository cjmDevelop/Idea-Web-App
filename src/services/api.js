// src/services/api.js

const API_URL = 'http://localhost:8080/api';

let token = null;

export async function loginUser() {
  console.log('🔐 Logging in...');
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'jr87.dev+note@gmail.com',
      password: 'SecurePass123!'
    })
  });
  
  const data = await response.json();
  token = data.accessToken;
  
  console.log('✅ Logged in! Token:', token.substring(0, 30) + '...');
  return token;
}

export async function getNotes() {
  // IMPORTANT: Always login first to get fresh token
  if (!token) {
    console.log('⚠️ No token, logging in first...');
    await loginUser();
  }
  
  console.log('📥 Fetching notes with token:', token.substring(0, 30) + '...');
  
  const response = await fetch(`${API_URL}/notes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,  // Use the token we just got
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get notes: ${response.status}`);
  }
  
  return await response.json();
}

export async function createNote(content) {
  // Make sure we have a token
  if (!token) {
    console.log('⚠️ No token, logging in first...');
    await loginUser();
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
  
  if (!response.ok) {
    throw new Error(`Failed to create note: ${response.status}`);
  }
  
  return await response.json();
}

export async function updateNote(id, content) {
  if (!token) {
    await loginUser();
  }
  
  const response = await fetch(`${API_URL}/notes/${id}`, {
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
  
  return await response.json();
}

export async function deleteNote(id) {
  if (!token) {
    await loginUser();
  }
  
  await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('✅ Note deleted from backend');
}