// Register Page JavaScript - Super Simplified
document.addEventListener('DOMContentLoaded', function() {
  // Password toggle functionality
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  // Toggle main password visibility
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
  
  // Toggle confirm password visibility
  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener('click', function() {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
  
  // Form validation and submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const terms = document.getElementById('terms').checked;
      
      // Simple validation
      if (!email) {
        showMessage('Email harus diisi', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showMessage('Format email tidak valid', 'error');
        return;
      }
      
      if (!password) {
        showMessage('Password harus diisi', 'error');
        return;
      }
      
      if (password.length < 8) {
        showMessage('Password minimal 8 karakter', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showMessage('Password tidak cocok', 'error');
        return;
      }
      
      if (!terms) {
        showMessage('Harap setujui Syarat & Ketentuan', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = this.querySelector('.register-btn');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mendaftar...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        showMessage('Registrasi berhasil!', 'success');
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
        
      }, 1000);
    });
  }
  
  // Google registration button
  const googleButton = document.querySelector('.social-btn.google');
  if (googleButton) {
    googleButton.addEventListener('click', function() {
      showMessage('Registrasi dengan Google belum tersedia', 'info');
    });
  }
  
  // Terms link
  const termsLink = document.querySelector('.terms-link');
  if (termsLink) {
    termsLink.addEventListener('click', function(e) {
      e.preventDefault();
      showMessage('Syarat & Ketentuan belum tersedia', 'info');
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
  const existingMessage = document.querySelector('.register-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = `register-message ${type}`;
  messageDiv.innerHTML = `
    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                     type === 'success' ? 'fa-check-circle' : 
                     'fa-info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Add to body
  document.body.appendChild(messageDiv);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

// Add simple styles for messages
const style = document.createElement('style');
style.textContent = `
  .register-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .register-message.error {
    background: #f44336;
  }
  .register-message.success {
    background: #4CAF50;
  }
  .register-message.info {
    background: #2196F3;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @media (max-width: 480px) {
    .register-message {
      top: 10px;
      right: 10px;
      left: 10px;
    }
  }
`;
document.head.appendChild(style);