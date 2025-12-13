// src/scripts/delete-account.js
import { API_URL, isLoggedIn, getCurrentUser, logout } from "../services/api.js";

// State management
const state = {
    currentStep: 1,
    userEmail: null
};

// DOM Elements
const steps = {
    step1: document.getElementById('step-1'),
    step2: document.getElementById('step-2'),
    step3: document.getElementById('step-3')
};

const buttons = {
    continue: document.getElementById('continue-btn'),
    cancel: document.getElementById('cancel-btn'),
    back: document.getElementById('back-btn'),
    delete: document.getElementById('delete-btn')
};

const inputs = {
    password: document.getElementById('password'),
    reason: document.getElementById('reason')
};

const messageContainer = document.getElementById('message');
const deleteForm = document.getElementById('delete-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('You must be logged in to delete your account');
        window.location.href = 'login.html';
        return;
    }

    // Get user email
    const user = getCurrentUser();
    state.userEmail = user?.email;

    if (!state.userEmail) {
        alert('Could not retrieve user information');
        window.location.href = 'login.html';
        return;
    }

    initializeEventListeners();
    showStep(1);
});

// Event Listeners
function initializeEventListeners() {
    if (buttons.continue) {
        buttons.continue.addEventListener('click', () => showStep(2));
    }

    if (buttons.cancel) {
        buttons.cancel.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    if (buttons.back) {
        buttons.back.addEventListener('click', () => showStep(1));
    }

    if (deleteForm) {
        deleteForm.addEventListener('submit', handleDeleteAccount);
    }
}

// Handle Account Deletion
async function handleDeleteAccount(e) {
    e.preventDefault();

    const password = inputs.password.value;
    const reason = inputs.reason.value.trim();

    if (!password) {
        showMessage('Please enter your password', 'error');
        return;
    }

    // Final confirmation
    const confirmed = confirm(
        '⚠️ FINAL WARNING ⚠️\n\n' +
        'This will PERMANENTLY delete your account and all data.\n\n' +
        'Are you absolutely sure?'
    );

    if (!confirmed) {
        return;
    }

    setLoading(buttons.delete, true, 'Deleting account...');
    clearMessage();

    try {
        const response = await fetch(`${API_URL}/auth/account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                email: state.userEmail,
                password: password,
                reason: reason || null
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Account deleted successfully');
            
            // Clear all local storage
            logout();
            
            // Show success step
            showStep(3);

        } else {
            showMessage(data.error || 'Failed to delete account', 'error');
        }

    } catch (error) {
        console.error('❌ Error deleting account:', error);
        showMessage('Network error. Please try again.', 'error');
    } finally {
        setLoading(buttons.delete, false, 'Delete My Account Forever');
    }
}

// UI Helper Functions
function showStep(stepNumber) {
    console.log('Showing step:', stepNumber);

    // Hide all steps
    Object.values(steps).forEach(step => {
        if (step) {
            step.classList.remove('active');
        }
    });

    // Show requested step
    const currentStep = steps[`step${stepNumber}`];
    if (currentStep) {
        currentStep.classList.add('active');
    }

    state.currentStep = stepNumber;

    // Clear messages when changing steps
    clearMessage();
}

function showMessage(text, type) {
    if (!messageContainer) return;

    messageContainer.textContent = text;
    messageContainer.className = `message-container ${type}`;
    messageContainer.style.display = 'block';
}

function clearMessage() {
    if (!messageContainer) return;

    messageContainer.textContent = '';
    messageContainer.className = 'message-container';
    messageContainer.style.display = 'none';
}

function setLoading(button, isLoading, text) {
    if (!button) return;

    button.disabled = isLoading;
    button.textContent = text;

    if (isLoading) {
        button.classList.add('loading');
    } else {
        button.classList.remove('loading');
    }
}