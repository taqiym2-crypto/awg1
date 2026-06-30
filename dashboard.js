// dashboard.js - Dashboard SolarTracker
document.addEventListener('DOMContentLoaded', function() {
    // Initialize real-time clock
    updateTime();
    setInterval(updateTime, 1000);
    
    // Initialize last update time
    updateLastUpdateTime();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize monitoring data
    initializeMonitoringData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize system status
    initializeSystemStatus();
    
    // Auto-refresh data every 30 seconds
    setInterval(refreshData, 30000);
});

// Update real-time clock
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('current-time').textContent = timeString;
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('last-update').textContent = `Terakhir diperbarui: ${dateString}, ${timeString}`;
}

// Initialize monitoring data with random values
function initializeMonitoringData() {
    updateCurrentValue();
    updateVoltageValue();
    updatePowerValue();
    updateGeneratedPower();
    updateBatteryLevel();
    updateEfficiencyValue();
}

// Update current value with random variation
function updateCurrentValue() {
    const element = document.getElementById('current-value');
    const base = 8.42;
    const variation = (Math.random() - 0.5) * 0.4; // -0.2 to +0.2
    const newValue = (base + variation).toFixed(2);
    element.textContent = newValue;
    
    // Update trend indicator
    const trend = element.closest('.monitoring-card').querySelector('.card-trend');
    if (variation > 0.1) {
        trend.className = 'card-trend up';
        trend.innerHTML = '<i class="fas fa-arrow-up"></i><span>+' + Math.abs(variation).toFixed(2) + 'A dari sebelumnya</span>';
    } else if (variation < -0.1) {
        trend.className = 'card-trend down';
        trend.innerHTML = '<i class="fas fa-arrow-down"></i><span>-' + Math.abs(variation).toFixed(2) + 'A dari sebelumnya</span>';
    } else {
        trend.className = 'card-trend stable';
        trend.innerHTML = '<i class="fas fa-minus"></i><span>Stabil</span>';
    }
}

// Update voltage value with random variation
function updateVoltageValue() {
    const element = document.getElementById('voltage-value');
    const base = 48.6;
    const variation = (Math.random() - 0.5) * 0.6; // -0.3 to +0.3
    const newValue = (base + variation).toFixed(1);
    element.textContent = newValue;
}

// Update power value with random variation
function updatePowerValue() {
    const element = document.getElementById('power-value');
    const current = parseFloat(document.getElementById('current-value').textContent);
    const voltage = parseFloat(document.getElementById('voltage-value').textContent);
    const newValue = (current * voltage).toFixed(1);
    element.textContent = newValue;
}

// Update generated power with random increment
function updateGeneratedPower() {
    const element = document.getElementById('generated-power');
    const currentValue = parseFloat(element.textContent);
    const increment = Math.random() * 0.05; // 0 to 0.05 kWh
    const newValue = (currentValue + increment).toFixed(2);
    
    // Don't exceed 6.2 kWh target
    if (newValue <= 6.2) {
        element.textContent = newValue;
        
        // Update progress bar
        const progress = (newValue / 6.2) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }
}

// Update battery level with random variation
function updateBatteryLevel() {
    const element = document.getElementById('battery-level');
    const currentValue = parseInt(element.textContent);
    const variation = Math.random() > 0.5 ? 1 : -1;
    const change = Math.random() * 0.5; // 0 to 0.5%
    
    let newValue = currentValue + (variation * change);
    
    // Keep between 85% and 100%
    newValue = Math.max(85, Math.min(100, newValue));
    
    element.textContent = newValue.toFixed(0);
    
    // Update battery display
    document.getElementById('battery-visual').style.height = `${newValue}%`;
}

// Update efficiency value with random variation
function updateEfficiencyValue() {
    const element = document.getElementById('efficiency-value');
    const base = 87.5;
    const variation = (Math.random() - 0.5) * 1; // -0.5 to +0.5
    const newValue = (base + variation).toFixed(1);
    element.textContent = newValue;
    
    // Update trend indicator
    const trend = element.closest('.monitoring-card').querySelector('.card-trend');
    let status = '';
    
    if (newValue >= 90) status = 'Sangat Baik';
    else if (newValue >= 85) status = 'Baik';
    else if (newValue >= 80) status = 'Cukup';
    else status = 'Perlu Perbaikan';
    
    trend.innerHTML = '<i class="fas fa-arrow-up"></i><span>' + status + '</span>';
}

// Initialize charts
function initializeCharts() {
    // Power Chart
    const powerCtx = document.getElementById('power-chart').getContext('2d');
    
    // Generate time labels for last 24 hours
    const timeLabels = generateTimeLabels(24);
    const powerData = generatePowerData(24);
    
    // Create gradient for chart
    const powerGradient = powerCtx.createLinearGradient(0, 0, 0, 400);
    powerGradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
    powerGradient.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
    
    window.powerChart = new Chart(powerCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Daya (Watt)',
                data: powerData,
                borderColor: '#f59e0b',
                backgroundColor: powerGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1e293b',
                pointBorderColor: '#f59e0b',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f59e0b',
                    bodyColor: '#fff',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `Daya: ${context.parsed.y}W`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return value + 'W';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Watt',
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.03)'
                    },
                    ticks: {
                        color: '#64748b'
                    },
                    title: {
                        display: true,
                        text: 'Waktu',
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

// Generate time labels for last n hours
function generateTimeLabels(hours) {
    const labels = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(time.getHours() - i);
        
        const hour = time.getHours().toString().padStart(2, '0');
        const minute = '00';
        
        labels.push(`${hour}:${minute}`);
    }
    
    return labels;
}

// Generate power data with realistic pattern
function generatePowerData(hours) {
    const data = [];
    
    for (let i = 0; i <= hours; i++) {
        let power = 0;
        
        // Generate realistic power pattern (low at night, high at noon)
        const hourOfDay = (24 - (hours - i)) % 24;
        
        if (hourOfDay >= 6 && hourOfDay <= 18) {
            // Daytime: generate bell curve
            const peakHour = 12;
            const deviation = Math.abs(hourOfDay - peakHour);
            const basePower = 400 - (deviation * 35);
            
            // Add random variation
            const variation = (Math.random() - 0.5) * 50;
            power = Math.max(50, basePower + variation);
        } else {
            // Nighttime: very low power
            power = Math.random() * 30;
        }
        
        data.push(Math.round(power));
    }
    
    return data;
}

// Setup event listeners
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.add('fa-spin');
            refreshData();
            setTimeout(() => icon.classList.remove('fa-spin'), 1000);
        });
    }
    
    // Time filter
    const timeFilter = document.getElementById('time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            updateChartByTimeRange(this.value);
        });
    }
    
    // Refresh activity button
    const refreshActivityBtn = document.getElementById('refresh-activity');
    if (refreshActivityBtn) {
        refreshActivityBtn.addEventListener('click', function() {
            refreshActivityList();
            const icon = this.querySelector('i');
            icon.classList.add('fa-spin');
            setTimeout(() => icon.classList.remove('fa-spin'), 500);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showConfirmModal('Keluar', 'Apakah Anda yakin ingin keluar?', () => {
                showNotification('Anda telah keluar dari sistem', 'info');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            });
        });
    }
}

// Initialize system status
function initializeSystemStatus() {
    const statusItems = document.querySelectorAll('.status-item');
    
    // Randomly change some status for demo
    setInterval(() => {
        statusItems.forEach(item => {
            if (Math.random() > 0.8) { // 20% chance to change status
                if (item.classList.contains('online')) {
                    item.classList.remove('online');
                    item.classList.add('warning');
                    item.querySelector('i').className = 'fas fa-exclamation-triangle';
                    item.querySelector('span').textContent = 'Periksa Koneksi';
                } else {
                    item.classList.remove('warning');
                    item.classList.add('online');
                    item.querySelector('i').className = 'fas fa-check-circle';
                    item.querySelector('span').textContent = 'Sistem Normal';
                }
            }
        });
    }, 10000);
}

// Refresh all data
function refreshData() {
    updateCurrentValue();
    updateVoltageValue();
    updatePowerValue();
    updateGeneratedPower();
    updateBatteryLevel();
    updateEfficiencyValue();
    updateLastUpdateTime();
    showNotification('Data berhasil diperbarui', 'success');
}

// Update chart by time range
function updateChartByTimeRange(range) {
    let labels, data;
    
    switch(range) {
        case '24h':
            labels = generateTimeLabels(24);
            data = generatePowerData(24);
            break;
        case '7d':
            labels = generateDayLabels(7);
            data = generateWeeklyPowerData(7);
            break;
        case '30d':
            labels = generateDayLabels(30);
            data = generateWeeklyPowerData(30);
            break;
        default:
            labels = generateTimeLabels(24);
            data = generatePowerData(24);
    }
    
    if (window.powerChart) {
        window.powerChart.data.labels = labels;
        window.powerChart.data.datasets[0].data = data;
        window.powerChart.update();
    }
}

// Generate day labels
function generateDayLabels(days) {
    const labels = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const day = date.getDate();
        const month = date.toLocaleString('id-ID', { month: 'short' });
        labels.push(`${day} ${month}`);
    }
    
    return labels;
}

// Generate weekly power data
function generateWeeklyPowerData(days) {
    const data = [];
    
    for (let i = 0; i <= days; i++) {
        // Generate realistic daily pattern
        const dayOfWeek = (new Date().getDay() - i + 7) % 7;
        let basePower = 0;
        
        // Weekdays have higher production
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            basePower = 380 + (Math.random() * 40);
        } else {
            basePower = 320 + (Math.random() * 60);
        }
        
        // Add some trend (gradual improvement)
        const improvement = i * 0.2;
        const value = basePower - improvement + (Math.random() * 50);
        
        data.push(Math.max(200, Math.round(value)));
    }
    
    return data;
}

// Refresh activity list
function refreshActivityList() {
    const activities = [
        {
            icon: 'chart-line',
            title: 'Puncak Produksi Tercapai',
            desc: 'Produksi mencapai 520W pada pukul 12:00',
            time: 'Baru saja',
            highlight: true
        },
        {
            icon: 'sync-alt',
            title: 'Kalibrasi Sensor Selesai',
            desc: 'Sensor arus dan tegangan telah dikalibrasi otomatis',
            time: '5 MENIT LALU',
            highlight: false
        },
        {
            icon: 'battery-full',
            title: 'Baterai Terisi Penuh',
            desc: 'Baterai mencapai kapasitas 100% pada pukul 08:30',
            time: '2 JAM LALU',
            highlight: false
        },
        {
            icon: 'sun',
            title: 'Tracking Aktif',
            desc: 'Sistem tracking mengikuti matahari pada posisi 45°',
            time: '3 JAM LALU',
            highlight: false
        },
        {
            icon: 'cloud-sun',
            title: 'Cuaca Cerah',
            desc: 'Kondisi cuaca optimal untuk produksi energi',
            time: '4 JAM LALU',
            highlight: false
        }
    ];
    
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.highlight ? 'highlight' : ''}`;
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.desc}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Show confirmation modal
function showConfirmModal(title, message, callback) {
    // Create modal if not exists
    let modal = document.getElementById('confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirm-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button id="modal-cancel" class="modal-btn secondary">Batal</button>
                    <button id="modal-confirm" class="modal-btn primary">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 2000;
                align-items: center;
                justify-content: center;
            }
            .modal.active { display: flex; }
            .modal-content {
                background: white;
                border-radius: 15px;
                width: 400px;
                max-width: 90%;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .modal-header {
                padding: 20px;
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                color: white;
                border-radius: 15px 15px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                color: #f59e0b;
            }
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            .modal-body {
                padding: 30px;
                color: #333;
            }
            .modal-footer {
                padding: 20px;
                background: #f8fafc;
                border-radius: 0 0 15px 15px;
                display: flex;
                justify-content: flex-end;
                gap: 15px;
            }
            .modal-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            }
            .modal-btn.primary {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
            }
            .modal-btn.secondary {
                background: #e2e8f0;
                color: #475569;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update content
    modal.querySelector('.modal-header h3').textContent = title;
    modal.querySelector('.modal-body p').textContent = message;
    
    // Show modal
    modal.classList.add('active');
    
    // Setup event listeners
    const closeModal = () => modal.classList.remove('active');
    
    modal.querySelector('.modal-close').onclick = closeModal;
    modal.querySelector('#modal-cancel').onclick = closeModal;
    modal.querySelector('#modal-confirm').onclick = () => {
        closeModal();
        if (callback) callback();
    };
    
    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    // Add animation if not exists
    if (!document.querySelector('#notification-animation')) {
        const style = document.createElement('style');
        style.id = 'notification-animation';
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize on load
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    setTimeout(() => document.body.style.opacity = '1', 100);
    document.documentElement.style.scrollBehavior = 'smooth';
});