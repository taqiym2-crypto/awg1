// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Password toggle functionality
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Toggle eye icon
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
  
  // Form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember').checked;
      
      // Simple validation
      if (!email || !password) {
        showMessage('Harap isi semua field', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showMessage('Format email tidak valid', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = this.querySelector('.login-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, this would be an actual API call
        console.log('Login attempt:', { email, password, remember });
        
        // For demo purposes, simulate successful login
        showMessage('Login berhasil! Mengarahkan ke dashboard...', 'success');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 2000);
        
      }, 1500);
    });
  }
  
  // Google login button
  const googleButton = document.querySelector('.social-btn.google');
  if (googleButton) {
    googleButton.addEventListener('click', function() {
      showMessage('Login dengan Google belum tersedia dalam demo', 'info');
    });
  }
  
  // Forgot password link
  const forgotLink = document.querySelector('.forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', function(e) {
      e.preventDefault();
      showMessage('Fitur reset password belum tersedia dalam demo', 'info');
    });
  }
});

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show message function
function showMessage(message, type) {
  // Remove any existing message
  const existingMessage = document.querySelector('.login-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = `login-message ${type}`;
  messageDiv.innerHTML = `
    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                     type === 'success' ? 'fa-check-circle' : 
                     'fa-info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Add styles if not already added
  if (!document.querySelector('#message-styles')) {
    const style = document.createElement('style');
    style.id = 'message-styles';
    style.textContent = `
      .login-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        animation-fill-mode: forwards;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        max-width: 400px;
      }
      .login-message.error {
        background: linear-gradient(135deg, #f44336 0%, #C62828 100%);
      }
      .login-message.success {
        background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
      }
      .login-message.info {
        background: linear-gradient(135deg, #2196F3 0%, #0D47A1 100%);
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translateX(100%); }
      }
      @media (max-width: 768px) {
        .login-message {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: calc(100% - 20px);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to body
  document.body.appendChild(messageDiv);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}