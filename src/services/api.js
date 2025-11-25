/**
 * API Service Layer
 * 
 * This module handles all communication with the backend API.
 * It provides functions for authentication and note management. 
 */

// API base URL, will change when deploying to production
const API_URL = 'http://localhost:8080/api';

//Login function
export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
});

if(!response.ok) {
    throw new Error('Login failed')
}

const data = await response.json();
return data;
}

//Get Notes function
export async function getNotes(token) {
    const response = await fetch(`${API_URL}/notes`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    if(!response.ok) {
        throw new Error('Failed to fetch notes');
    }

    const notes = await response.json();
    return notes;
}

//Create note function 
export async function createNote(token, content) {
    const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
    });

    if(!response.ok) {
        throw new Error('Failed to create note');
    }

    const note = await response.json();
    return note;
}