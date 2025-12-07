// js/forgot-password.js
import { API_BASE_URL } from './config.js';

// State management
const state = {
    email: '',
    code: '',
    currentStep: 1
};

// DOM Elements
const steps = {
    step1: document.getElementById('step-1'),
    step2: document.getElementById('step-2'),
    step3: document.getElementById('step-3'),
    step4: document.getElementById('step-4')
};

const forms = {
    forgotPassword: document.getElementById('forgot-password-form'),
    verifyCode: document.getElementById('verify-code-form'),
    resetPassword: document.getElementById('reset-password-form')
};

const inputs = {
    email: document.getElementById('email'),
    code: document.getElementById('code'),
    newPassword: document.getElementById('new-password'),
    confirmPassword: document.getElementById('confirm-password')
};

const buttons = {
    sendCode: document.getElementById('send-code-btn'),
    verifyCode: document.getElementById('verify-code-btn'),
    resetPassword: document.getElementById('reset-password-btn'),
    resendCode: document.getElementById('resend-code-btn'),
    backToStep1: document.getElementById('back-to-step-1')
};

// Message containers
const messages = {
    message1: document.getElementById('message-1'),
    message2: document.getElementById('message-2'),
    message3: document.getElementById('message-3')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    showStep(1);
});

// Event Listeners
function initializeEventListeners() {
    forms.forgotPassword.addEventListener('submit', handleForgotPassword);
    forms.verifyCode.addEventListener('submit', handleVerifyCode);
    forms.resetPassword.addEventListener('submit', handleResetPassword);
    buttons.resendCode.addEventListener('click', handleResendCode);
    buttons.backToStep1.addEventListener('click', () => showStep(1));

    // Auto-format code input (digits only)
    inputs.code.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Real-time password match validation
    inputs.confirmPassword.addEventListener('input', validatePasswordMatch);
}

// Step 1: Send Reset Code
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = inputs.email.value.trim();
    
    if (!email) {
        showMessage(messages.message1, 'Please enter your email address', 'error');
        return;
    }

    setLoading(buttons.sendCode, true, 'Sending code...');
    clearMessage(messages.message1);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            state.email = email;
            document.getElementById('user-email').textContent = email;
            showMessage(messages.message1, 'Reset code sent! Check your email.', 'success');
            
            setTimeout(() => {
                showStep(2);
                inputs.code.focus();
            }, 1500);
        } else {
            showMessage(messages.message1, data.error || 'Failed to send reset code', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(messages.message1, 'Network error. Please try again.', 'error');
    } finally {
        setLoading(buttons.sendCode, false, 'Send Reset Code');
    }
}

// Step 2: Verify Code
async function handleVerifyCode(e) {
    e.preventDefault();
    
    const code = inputs.code.value.trim();
    
    if (code.length !== 6) {
        showMessage(messages.message2, 'Please enter a 6-digit code', 'error');
        return;
    }

    setLoading(buttons.verifyCode, true, 'Verifying...');
    clearMessage(messages.message2);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: state.email,
                code: code
            })
        });

        const data = await response.json();

        if (response.ok && data.verified) {
            state.code = code;
            showMessage(messages.message2, 'Code verified!', 'success');
            
            setTimeout(() => {
                showStep(3);
                inputs.newPassword.focus();
            }, 1000);
        } else {
            showMessage(messages.message2, data.error || 'Invalid or expired code', 'error');
            inputs.code.value = '';
            inputs.code.focus();
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(messages.message2, 'Network error. Please try again.', 'error');
    } finally {
        setLoading(buttons.verifyCode, false, 'Verify Code');
    }
}

// Step 3: Reset Password
async function handleResetPassword(e) {
    e.preventDefault();
    
    const newPassword = inputs.newPassword.value;
    const confirmPassword = inputs.confirmPassword.value;
    
    // Validate passwords
    if (newPassword.length < 8) {
        showMessage(messages.message3, 'Password must be at least 8 characters', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage(messages.message3, 'Passwords do not match', 'error');
        return;
    }

    setLoading(buttons.resetPassword, true, 'Resetting password...');
    clearMessage(messages.message3);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: state.email,
                code: state.code,
                newPassword: newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            showStep(4);
        } else {
            showMessage(messages.message3, data.error || 'Failed to reset password', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(messages.message3, 'Network error. Please try again.', 'error');
    } finally {
        setLoading(buttons.resetPassword, false, 'Reset Password');
    }
}

// Resend Code
async function handleResendCode() {
    setLoading(buttons.resendCode, true, 'Resending...');
    clearMessage(messages.message2);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-reset-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: state.email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messages.message2, 'New code sent! Check your email.', 'success');
            inputs.code.value = '';
            inputs.code.focus();
        } else {
            showMessage(messages.message2, data.error || 'Failed to resend code', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(messages.message2, 'Network error. Please try again.', 'error');
    } finally {
        setLoading(buttons.resendCode, false, 'Resend Code');
    }
}

// UI Helper Functions
function showStep(stepNumber) {
    // Hide all steps
    Object.values(steps).forEach(step => {
        step.classList.remove('active');
    });
    
    // Show requested step
    steps[`step${stepNumber}`].classList.add('active');
    state.currentStep = stepNumber;
    
    // Update header subtitle
    const subtitles = {
        1: 'Enter your email to receive a reset code',
        2: 'Verify the code sent to your email',
        3: 'Choose a new password for your account',
        4: 'Your password has been reset successfully'
    };
    
    const subtitle = document.getElementById('header-subtitle');
    if (subtitle) {
        subtitle.textContent = subtitles[stepNumber];
    }
    
    // Clear all messages when changing steps
    Object.values(messages).forEach(msg => clearMessage(msg));
}

function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message-container ${type}`;
    element.style.display = 'block';
}

function clearMessage(element) {
    element.textContent = '';
    element.className = 'message-container';
    element.style.display = 'none';
}

function setLoading(button, isLoading, text) {
    button.disabled = isLoading;
    button.textContent = text;
    
    if (isLoading) {
        button.classList.add('loading');
    } else {
        button.classList.remove('loading');
    }
}

function validatePasswordMatch() {
    const newPassword = inputs.newPassword.value;
    const confirmPassword = inputs.confirmPassword.value;
    
    if (confirmPassword && newPassword !== confirmPassword) {
        inputs.confirmPassword.setCustomValidity('Passwords do not match');
    } else {
        inputs.confirmPassword.setCustomValidity('');
    }
}

// Export for testing
export { handleForgotPassword, handleVerifyCode, handleResetPassword };