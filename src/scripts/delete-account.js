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
    step2: document.getElementById('delete-form'),
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
    console.log('🔍 Delete account page loaded');
    
    // Update auth UI first
    updateAuthUI();
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        console.log('❌ User not logged in, redirecting...');
        alert('You must be logged in to delete your account');
        window.location.href = 'login.html';
        return;
    }

    // Get user email
    const user = getCurrentUser();
    state.userEmail = user?.email;

    if (!state.userEmail) {
        console.log('❌ Could not get user email, redirecting...');
        alert('Could not retrieve user information');
        window.location.href = 'login.html';
        return;
    }

    console.log('✅ User authenticated:', state.userEmail);
    
    initializeEventListeners();
    showStep(1);
});

// Update Auth UI (same as index.js)
function updateAuthUI() {
    const userStatus = document.getElementById('user-status');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (!userStatus) return;
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        
        let displayName;
        if (user?.firstName && user?.lastName) {
            displayName = `${user.firstName} ${user.lastName}`;
        } else if (user?.firstName) {
            displayName = user.firstName;
        } else {
            displayName = user?.email || 'User';
        }
        
        userStatus.textContent = `Hi ${displayName}`;
        userStatus.classList.add('logged-in');
        
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    logout();
                    window.location.href = 'index.html';
                }
            });
        }
    }
}

// Event Listeners
function initializeEventListeners() {
    console.log('🎯 Setting up event listeners');
    
    if (buttons.continue) {
        buttons.continue.addEventListener('click', () => {
            console.log('▶️ Continue button clicked');
            showStep(2);
        });
    }

    if (buttons.cancel) {
        buttons.cancel.addEventListener('click', () => {
            console.log('❌ Cancel button clicked');
            window.location.href = 'index.html';
        });
    }

    if (buttons.back) {
        buttons.back.addEventListener('click', () => {
            console.log('◀️ Back button clicked');
            showStep(1);
        });
    }

    if (deleteForm) {
        deleteForm.addEventListener('submit', handleDeleteAccount);
    }
}

// Handle Account Deletion
async function handleDeleteAccount(e) {
    e.preventDefault();
    console.log('🗑️ Delete form submitted');

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
        console.log('❌ User cancelled deletion');
        return;
    }

    setLoading(buttons.delete, true, 'Deleting account...');
    clearMessage();

    try {
        console.log('📤 Sending delete request to API...');
        
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
            console.error('❌ Delete failed:', data.error);
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
    console.log(`🔄 Switching to step ${stepNumber}`);

    // Hide all steps
    Object.values(steps).forEach(step => {
        if (step) {
            step.classList.remove('active');
            step.style.display = 'none';
        }
    });

    // Show requested step
    const currentStep = steps[`step${stepNumber}`];
    if (currentStep) {
        currentStep.classList.add('active');
        currentStep.style.display = 'block';
        console.log(`✅ Showing step ${stepNumber}`);
    } else {
        console.error(`⚠️ Step ${stepNumber} element not found!`);
    }

    state.currentStep = stepNumber;

    // Clear messages when changing steps
    clearMessage();
}

function showMessage(text, type) {
    if (!messageContainer) {
        console.warn('⚠️ Message container not found');
        return;
    }

    console.log(`💬 Showing ${type} message:`, text);
    messageContainer.textContent = text;
    messageContainer.className = `delete-message-container ${type}`;
    messageContainer.style.display = 'block';
}

function clearMessage() {
    if (!messageContainer) return;

    messageContainer.textContent = '';
    messageContainer.className = 'delete-message-container';
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

console.log('📄 delete-account.js loaded');