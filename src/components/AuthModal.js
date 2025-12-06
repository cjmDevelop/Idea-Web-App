/**
 * Auth Modal Component
 * Handles user authentication UI (login, register, verify)
 */

import { login, register, verifyEmail } from "../services/api";
import { migrateLocalNotesToBackend } from "../services/storageManager";

export class AuthModal {
    constructor(onAuthSuccess) {
        this.onAuthSuccess = onAuthSuccess;
        this.currentView = 'login'; //login, register, verify
        this.pendingEmail = null; //Store email for verification flow
        this.modal = null;
    }


/**
 * Show modal with specific view
 * class function / class method
 */
show(view = 'login') {
    this.currentView = view;
    this.render();
    this.modal.style.display = 'flex';
}

/**
 * Hide modal
 */
hide() {
    if(this.modal) {
        this.modal.style.display = "none";
        this.modal.remove();
    }
}

/**
 * Render the modal
 */
render() {
    //Remove existing modal if present
    if(this.modal) {
        this.modal.remove();
    }

    //Create modal overlay
    this.modal = document.createElement('div');
    this.modal.className = 'auth-modal-overlay';
    this.modal.innerHTML = this.getModalHTML();
    document.body.appendChild(this.modal);

    //Attach event listeners
    this.attachEventListeners();

    //close on overlay click
    this.modal.addEventListener('click', (e) => {
        if(e.target === this.modal) {
            this.hide();
        }
    });
}

/**
 * Get HTML based on current view
 */
getModalHTML() {
    switch (this.currentView) {
        case 'login':
            return this.getLoginHTML();
        case 'register':
            return this.getRegisterHTML();
        case 'verify':
            return this.getVerifyHTML();
        default:
            return this.getLoginHTML();
    }
}

/**
 * Login view HTML
 */
getLoginHTML() {
    return `
    <div class="auth-modal">
        <button class="auth-close-btn" id="auth-close-btn">&times;</button>
        <h2>Login</h2>
        <form id="login-form" class="auth-form">
            <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" required>
            </div>
            <div class="error-message" id="login-error"></div>
            <button type="submit" class="auth-submit-btn">Login</button>
        </form>
        <p class="auth-switch">Don't have an account?
            <a href="#" id="switch-to-register">Sign up</a>
        </p>
    </div>
    
    `;
}


/**
 * Register HTML view
 */
getRegisterHTML() {
    return `
    <div class="auth-modal">
        <button class="auth-close-btn" id="auth-close-btn">&times;</button>
        <h2>Sign Up</h2>
        <form id="register-form" class="auth-form">
            <div class="form-group">
                <label for="register-email">Email</label>
                <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
                <label for="register-password">Password</label>
                <input type="password" id="register-password" required minlength="6">
            </div>
            <div class="form-group">
                <label for="register-firstname">First Name (optional)</label>
                <input type="text" id="register-firstname">
            </div>
             <div class="form-group">
                <label for="register-lastname">Last Name (optional)</label>
                <input type="text" id="register-lastname">
            </div>
            <div class="error-message" id="register-error"></div>
            <button type="submit" class="auth-submit-btn">Sign Up</button>
        </form>
            <p class="auth-switch">Already have an account?
            <a href="#" id="switch-to-login">Login</a>
        </p>
    </div>
    `;
}

/**
 * Email verification view HTML
 */
getVerifyHTML() {
    return `
        <div class="auth-modal">
            <button class="auth-close-btn" id="auth-close-btn">&times;</button>
            <h2>Verify Email</h2>
            <p class="verify-instructions">
                We sent a 6-digit code to <strong>${this.pendingEmail}</strong>
            </p>
            <form id="verify-form" class="auth-form">
                <div class="form-group">
                    <label for="verify-code">Verification Code</label>
                    <input
                        type="text"
                        id="verify-code"
                        required
                        maxlength="6"
                        pattern="[0-9]{6}
                        placeholder=000000"    
                    >
                </div>
                <div class="error-message" id="verify-error"></div>
                <button type="submit" class="auth-submit-btn">Verify</button>
            </form>
                <p class="auth-switch">Wrong email?
                <a href="#" id="switch-to-register">Go back</a>
                </p>
        </div>
    `;
}


/**
 * Attach event listeners to form elements
 */
attachEventListeners() {
    //Close button
    const closeBtn = document.getElementById('auth-close-btn');
    if(closeBtn) {
        closeBtn.addEventListener('click', () => this.hide());
    }

    //View switchers
    const switchToRegister = document.getElementById('switch-to-register');
        if(switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.show('register');
            });
        }

    const switchToLogin = document.getElementById('switch-to-login');
        if(switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.show('login'); 
            })
        }

    //Forms 
    const loginForm = document.getElementById('login-form');
        if(loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

    const registerForm = document.getElementById('register-form');
        if(registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

    const verifyForm = document.getElementById('verify-form');
        if(verifyForm) {
            verifyForm.addEventListener('submit', (e) => this.handleVerify(e));
        }
}


/**
 * Handle login form submission
 */
async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        errorDiv.textContent = '';
        const response = await login(email, password);

        console.log('✅ Login successful');

        //migrate guest notes to backend
        const migrationResults = await migrateLocalNotesToBackend();
        console.log('📦 migration results:', migrationResults);

        this.hide();
        this.onAuthSuccess(response.user);
    } catch(error) {
        console.error('❌ Login error', error);
        errorDiv.textContent = error.message || 'Login failed. Please try again.'
    }
}


/**
 * Handle register form submission
 */
async handleRegister(e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const firstName = document.getElementById('register-firstname').value || null;
    const lastName = document.getElementById('register-lastname').value || null;
    const errorDiv = document.getElementById('register-error');

    try {
        errorDiv.textContent = '';
        await register(email, password, firstName, lastName);

        console.log("✅ Registration successful, check email for verification code");

        // Store email and switch to verify view
        this.pendingEmail = email;
        this.show('verify');
    } catch(error) {
        console.error('❌ Registration error:', error);
        errorDiv.textContent = error.message || 'Registration failed. Please try again.';
    }
}


/**
 * Handle email verification form submission
 */
async handleVerify(e) {
    e.preventDefault();

    const code = document.getElementById('verify-code').value;
    const errorDiv = document.getElementById('verify-error');

    if(!this.pendingEmail) {
        errorDiv.textContent = 'Email not found. Please register again.';
        return;
    }

    try {
        errorDiv.textContent = '';
        const response = await verifyEmail(this.pendingEmail, code);

        console.log('✅ Email verified successfully:', response);

        // Migrate guest notes to backend
        const migrationResults = await migrateLocalNotesToBackend();
        console.log("📦 Migrations results:", migrationResults);

        this.hide();
        this.onAuthSuccess(response.user);
    } catch(error) {
        console.error('❌ Verification error:', error);
        errorDiv.textContent = error.message || 'Verification failed. Invalid code.';
    }
}

}

