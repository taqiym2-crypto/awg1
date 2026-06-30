// analysis.js - Tema Biru & Emas
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    updateLastUpdateTime();
    
    // Set interval to update data every 30 seconds
    setInterval(updateChartsData, 30000);
    
    // Time range change listeners
    const timeRangeEnergy = document.getElementById('timeRangeEnergy');
    const timeRangeEfficiency = document.getElementById('timeRangeEfficiency');
    
    if (timeRangeEnergy) {
        timeRangeEnergy.addEventListener('change', function() {
            updateEnergyChart(this.value);
        });
    }
    
    if (timeRangeEfficiency) {
        timeRangeEfficiency.addEventListener('change', function() {
            updateEfficiencyChart(this.value);
        });
    }
    
    // Export buttons
    const exportEnergyBtn = document.getElementById('exportEnergy');
    const exportEfficiencyBtn = document.getElementById('exportEfficiency');
    
    if (exportEnergyBtn) {
        exportEnergyBtn.addEventListener('click', function() {
            showNotification('Data produksi energi diekspor ke CSV', 'success');
        });
    }
    
    if (exportEfficiencyBtn) {
        exportEfficiencyBtn.addEventListener('click', function() {
            showNotification('Data analisis efisiensi diekspor ke CSV', 'success');
        });
    }
    
    // Navigation active state
    setActiveNavigation();
    
    // Initialize status cards with random data
    updateStatusCards();
});

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        const href = btn.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Chart initialization with theme colors
function initializeCharts() {
    // Energy Production Chart
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    
    // Generate energy data for 30 days
    const energyLabels = generateDateLabels(30);
    const energyData = generateEnergyData(30);
    
    // Create gradient using theme colors
    const energyGradient = energyCtx.createLinearGradient(0, 0, 0, 400);
    energyGradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
    energyGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
    energyGradient.addColorStop(1, 'rgba(255, 215, 0, 0.05)');
    
    window.energyChart = new Chart(energyCtx, {
        type: 'line',
        data: {
            labels: energyLabels,
            datasets: [{
                label: 'Energi (kWh)',
                data: energyData,
                borderColor: '#FFD700',
                backgroundColor: energyGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1e3c72',
                pointBorderColor: '#FFD700',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#FFD700',
                pointHoverBorderColor: '#1e3c72'
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
                    backgroundColor: 'rgba(30, 60, 114, 0.95)',
                    titleColor: '#FFD700',
                    bodyColor: '#fff',
                    borderColor: '#FFD700',
                    borderWidth: 2,
                    padding: 15,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function(context) {
                            return `Produksi: ${context.parsed.y} kWh`;
                        },
                        title: function(tooltipItems) {
                            return `Tanggal: ${tooltipItems[0].label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(30, 60, 114, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#2a5298',
                        callback: function(value) {
                            return value + ' kWh';
                        },
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Kilowatt-hour (kWh)',
                        color: '#1e3c72',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 10, bottom: 20}
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(30, 60, 114, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#2a5298',
                        maxRotation: 45,
                        font: {
                            size: 11,
                            weight: '500'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tanggal',
                        color: '#1e3c72',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 20, bottom: 10}
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                }
            }
        }
    });
    
    // Efficiency Analysis Chart
    const efficiencyCtx = document.getElementById('efficiencyChart').getContext('2d');
    
    // Generate efficiency data
    const efficiencyLabels = generateDateLabels(30);
    const efficiencyData = generateEfficiencyData(30);
    
    window.efficiencyChart = new Chart(efficiencyCtx, {
        type: 'bar',
        data: {
            labels: efficiencyLabels,
            datasets: [{
                label: 'Efisiensi (%)',
                data: efficiencyData,
                backgroundColor: efficiencyData.map(value => {
                    if (value >= 90) return 'rgba(76, 175, 80, 0.85)';
                    if (value >= 85) return 'rgba(139, 195, 74, 0.85)';
                    if (value >= 80) return 'rgba(255, 215, 0, 0.85)';
                    if (value >= 75) return 'rgba(255, 152, 0, 0.85)';
                    return 'rgba(244, 67, 54, 0.85)';
                }),
                borderColor: '#1e3c72',
                borderWidth: 1.5,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: efficiencyData.map(value => {
                    if (value >= 90) return 'rgba(76, 175, 80, 1)';
                    if (value >= 85) return 'rgba(139, 195, 74, 1)';
                    if (value >= 80) return 'rgba(255, 215, 0, 1)';
                    if (value >= 75) return 'rgba(255, 152, 0, 1)';
                    return 'rgba(244, 67, 54, 1)';
                })
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
                    backgroundColor: 'rgba(30, 60, 114, 0.95)',
                    titleColor: '#FFD700',
                    bodyColor: '#fff',
                    borderColor: '#FFD700',
                    borderWidth: 2,
                    padding: 15,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            let status = '';
                            
                            if (value >= 90) status = 'Sangat Baik';
                            else if (value >= 85) status = 'Baik';
                            else if (value >= 80) status = 'Cukup Baik';
                            else if (value >= 75) status = 'Perlu Perhatian';
                            else status = 'Perlu Perbaikan';
                            
                            return [`Efisiensi: ${value}%`, `Status: ${status}`];
                        },
                        title: function(tooltipItems) {
                            return `Tanggal: ${tooltipItems[0].label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(30, 60, 114, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#2a5298',
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Persentase Efisiensi',
                        color: '#1e3c72',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 10, bottom: 20}
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(30, 60, 114, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#2a5298',
                        maxRotation: 45,
                        font: {
                            size: 11,
                            weight: '500'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tanggal',
                        color: '#1e3c72',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {top: 20, bottom: 10}
                    }
                }
            }
        }
    });
}

// Generate date labels
function generateDateLabels(days) {
    const labels = [];
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        labels.push(`${day} ${month}`);
    }
    
    return labels;
}

// Generate energy data
function generateEnergyData(days) {
    const data = [];
    const base = 28.5;
    
    for (let i = 0; i < days; i++) {
        // Weekly pattern
        const dayOfWeek = (new Date().getDay() - i + 7) % 7;
        let variation = 0;
        
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
            variation = (Math.random() - 0.6) * 6; // Lower on weekends
        } else {
            variation = (Math.random() - 0.2) * 8; // Higher on weekdays
        }
        
        const improvement = i * 0.08;
        const value = base + variation + improvement;
        
        data.push(Math.max(15, Math.min(45, value)).toFixed(1));
    }
    
    return data;
}

// Generate efficiency data
function generateEfficiencyData(days) {
    const data = [];
    const base = 87.5;
    
    for (let i = 0; i < days; i++) {
        const variation = (Math.random() - 0.3) * 8;
        const improvement = i * 0.05;
        const value = base + variation + improvement;
        
        data.push(Math.max(72, Math.min(95, value)).toFixed(1));
    }
    
    return data;
}

// Update energy chart based on time range
function updateEnergyChart(timeRange) {
    let days = getDaysFromTimeRange(timeRange);
    
    if (window.energyChart) {
        const energyLabels = generateDateLabels(days);
        const energyData = generateEnergyData(days);
        
        window.energyChart.data.labels = energyLabels;
        window.energyChart.data.datasets[0].data = energyData;
        window.energyChart.update('none');
        
        updateLastUpdateTime();
        showNotification(`Data energi diperbarui (${getTimeRangeLabel(timeRange)})`, 'info');
    }
}

// Update efficiency chart based on time range
function updateEfficiencyChart(timeRange) {
    let days = getDaysFromTimeRange(timeRange);
    
    if (window.efficiencyChart) {
        const efficiencyLabels = generateDateLabels(days);
        const efficiencyData = generateEfficiencyData(days);
        
        window.efficiencyChart.data.labels = efficiencyLabels;
        window.efficiencyChart.data.datasets[0].data = efficiencyData;
        window.efficiencyChart.data.datasets[0].backgroundColor = efficiencyData.map(value => {
            if (value >= 90) return 'rgba(76, 175, 80, 0.85)';
            if (value >= 85) return 'rgba(139, 195, 74, 0.85)';
            if (value >= 80) return 'rgba(255, 215, 0, 0.85)';
            if (value >= 75) return 'rgba(255, 152, 0, 0.85)';
            return 'rgba(244, 67, 54, 0.85)';
        });
        
        window.efficiencyChart.update('none');
        updateLastUpdateTime();
        showNotification(`Data efisiensi diperbarui (${getTimeRangeLabel(timeRange)})`, 'info');
    }
}

// Update both charts with new data
function updateChartsData() {
    // Update energy chart with latest data
    if (window.energyChart) {
        const days = getDaysFromTimeRange(document.getElementById('timeRangeEnergy').value);
        const energyData = generateEnergyData(days);
        window.energyChart.data.datasets[0].data = energyData;
        window.energyChart.update('none');
    }
    
    // Update efficiency chart with latest data
    if (window.efficiencyChart) {
        const days = getDaysFromTimeRange(document.getElementById('timeRangeEfficiency').value);
        const efficiencyData = generateEfficiencyData(days);
        window.efficiencyChart.data.datasets[0].data = efficiencyData;
        window.efficiencyChart.data.datasets[0].backgroundColor = efficiencyData.map(value => {
            if (value >= 90) return 'rgba(76, 175, 80, 0.85)';
            if (value >= 85) return 'rgba(139, 195, 74, 0.85)';
            if (value >= 80) return 'rgba(255, 215, 0, 0.85)';
            if (value >= 75) return 'rgba(255, 152, 0, 0.85)';
            return 'rgba(244, 67, 54, 0.85)';
        });
        window.efficiencyChart.update('none');
    }
    
    // Update status cards with new values
    updateStatusCards();
    updateLastUpdateTime();
}

// Helper function to get days from time range
function getDaysFromTimeRange(timeRange) {
    switch (timeRange) {
        case '7days': return 7;
        case '30days': return 30;
        case '3months': return 90;
        case '6months': return 180;
        default: return 30;
    }
}

// Helper function to get time range label
function getTimeRangeLabel(timeRange) {
    switch (timeRange) {
        case '7days': return '7 Hari Terakhir';
        case '30days': return '30 Hari Terakhir';
        case '3months': return '3 Bulan Terakhir';
        case '6months': return '6 Bulan Terakhir';
        default: return '30 Hari Terakhir';
    }
}

// Update status cards with random values
function updateStatusCards() {
    const cards = document.querySelectorAll('.status-card .status-value');
    
    if (cards.length >= 4) {
        // Current (with slight variation)
        cards[0].textContent = (7.5 + (Math.random() - 0.5) * 0.2).toFixed(2) + ' A';
        
        // Voltage
        cards[1].textContent = (47.5 + (Math.random() - 0.5) * 0.5).toFixed(1) + ' V';
        
        // Power
        cards[2].textContent = (356.3 + (Math.random() - 0.5) * 5).toFixed(1) + ' W';
        
        // Efficiency
        const newEfficiency = (87.5 + (Math.random() - 0.5) * 1.5).toFixed(1);
        cards[3].textContent = newEfficiency + '%';
        
        // Update status label based on efficiency
        const statusLabels = document.querySelectorAll('.status-label');
        if (statusLabels.length >= 4) {
            if (newEfficiency >= 90) {
                statusLabels[3].textContent = 'Sangat Baik';
                statusLabels[3].style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
                statusLabels[3].style.color = '#2e7d32';
            } else if (newEfficiency >= 85) {
                statusLabels[3].textContent = 'Baik';
                statusLabels[3].style.background = 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)';
                statusLabels[3].style.color = '#689f38';
            } else if (newEfficiency >= 80) {
                statusLabels[3].textContent = 'Cukup';
                statusLabels[3].style.background = 'linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)';
                statusLabels[3].style.color = '#f57f17';
            } else if (newEfficiency >= 75) {
                statusLabels[3].textContent = 'Perlu Perhatian';
                statusLabels[3].style.background = 'linear-gradient(135deg, #fff3e0 0%, #ffccbc 100%)';
                statusLabels[3].style.color = '#ef6c00';
            } else {
                statusLabels[3].textContent = 'Perlu Perbaikan';
                statusLabels[3].style.background = 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
                statusLabels[3].style.color = '#d32f2f';
            }
        }
    }
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('id-ID', { 
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('lastUpdateTime').textContent = 
        `${dateString}, ${timeString}`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #2E7D32)' : 'linear-gradient(135deg, #2196F3, #0D47A1)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        margin: 0;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add CSS animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Generate random data for demonstration
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + E for export
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            showNotification('Ekspor data dengan mengklik tombol ekspor pada grafik', 'info');
        }
        
        // Ctrl + R for refresh
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            updateChartsData();
            showNotification('Data grafik diperbarui', 'success');
        }
    });
});