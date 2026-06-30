// ===== GLOBAL FUNCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('SolarTrack System Loaded');
    
    // Update waktu real-time
    updateTime();
    setInterval(updateTime, 1000);
    
    // Setup menu toggle untuk mobile
    setupMobileMenu();
    
    // Setup form validasi
    setupForms();
    
    // Setup dashboard jika di halaman dashboard
    if (window.location.pathname.includes('dashboard.html') || 
        document.body.classList.contains('dashboard-page')) {
        initDashboard();
    }
    
    // Check login status
    checkLoginStatus();
});

// ===== TIME FUNCTIONS =====
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID');
    const dateString = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update di semua elemen waktu
    document.querySelectorAll('#currentTime, .current-time').forEach(el => {
        el.textContent = `${dateString} - ${timeString}`;
    });
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            menuToggle.innerHTML = navLinks.style.display === 'flex' ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        
        // Responsive nav
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }
}

// ===== FORM HANDLING =====
function setupForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                // Simpan status login
                localStorage.setItem('solarTrackLoggedIn', 'true');
                localStorage.setItem('solarTrackUser', email);
                
                // Redirect ke dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Harap isi email dan password');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Password tidak cocok!');
                return;
            }
            
            // Simpan data user (sederhana)
            const userData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            localStorage.setItem('solarTrackUserData', JSON.stringify(userData));
            localStorage.setItem('solarTrackLoggedIn', 'true');
            localStorage.setItem('solarTrackUser', userData.email);
            
            alert('Registrasi berhasil! Mengarahkan ke dashboard...');
            window.location.href = 'dashboard.html';
        });
    }
}

// ===== LOGIN CHECK =====
function checkLoginStatus() {
    // Halaman yang perlu login
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const isLoggedIn = localStorage.getItem('solarTrackLoggedIn');
        
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
    }
    
    // Jika sudah login dan di halaman login/register, redirect ke dashboard
    const authPages = ['login.html', 'register.html'];
    if (authPages.includes(currentPage)) {
        const isLoggedIn = localStorage.getItem('solarTrackLoggedIn');
        
        if (isLoggedIn) {
            window.location.href = 'dashboard.html';
        }
    }
}

// ===== LOGOUT FUNCTION =====
function logout() {
    localStorage.removeItem('solarTrackLoggedIn');
    localStorage.removeItem('solarTrackUser');
    localStorage.removeItem('solarTrackUserData');
    window.location.href = 'index.html';
}

// ===== DASHBOARD FUNCTIONS =====
function initDashboard() {
    console.log('Initializing Dashboard...');
    
    // Update data real-time
    updateDashboardData();
    setInterval(updateDashboardData, 5000);
    
    // Setup chart
    initChart();
    
    // Setup controls
    setupControls();
    
    // Load user data
    loadUserData();
}

function updateDashboardData() {
    // Simulasi data real-time
    const efficiency = 75 + Math.random() * 10;
    const power = 3 + Math.random() * 2;
    const saving = 200000 + Math.random() * 100000;
    const light = 800 + Math.random() * 200;
    
    // Update nilai
    const elements = {
        'efficiencyValue': efficiency.toFixed(1) + '%',
        'powerValue': power.toFixed(2) + ' kW',
        'savingValue': 'Rp ' + Math.floor(saving).toLocaleString('id-ID'),
        'lightValue': Math.floor(light) + ' W/m²'
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
}

function initChart() {
    const ctx = document.getElementById('energyChart');
    if (!ctx) return;
    
    // Cek jika Chart.js tersedia
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded');
        return;
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
            datasets: [{
                label: 'Energi Dihasilkan (kWh)',
                data: [1.2, 2.5, 4.8, 6.2, 5.8, 3.5, 1.0],
                borderColor: '#1a2980',
                backgroundColor: 'rgba(26, 41, 128, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kWh'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                }
            }
        }
    });
}

function setupControls() {
    // Angle slider
    const angleSlider = document.getElementById('angleSlider');
    const angleValue = document.getElementById('angleValue');
    
    if (angleSlider && angleValue) {
        angleSlider.addEventListener('input', function() {
            angleValue.textContent = this.value;
        });
    }
    
    // Mode buttons
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const mode = this.dataset.mode;
            alert(`Mode tracking diubah ke: ${mode === 'auto' ? 'Otomatis' : 'Manual'}`);
        });
    });
    
    // Control buttons
    const applyBtn = document.getElementById('applyAngle');
    const resetBtn = document.getElementById('resetAngle');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const angle = angleSlider ? angleSlider.value : '45';
            alert(`Sudut panel diterapkan: ${angle}°`);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (angleSlider) {
                angleSlider.value = 45;
                angleSlider.dispatchEvent(new Event('input'));
            }
            alert('Posisi panel direset ke 45°');
        });
    }
}

function loadUserData() {
    const userData = localStorage.getItem('solarTrackUserData');
    if (userData) {
        try {
            const data = JSON.parse(userData);
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => {
                el.textContent = `${data.firstName} ${data.lastName}`;
            });
        } catch (e) {
            console.log('Error parsing user data:', e);
        }
    }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});