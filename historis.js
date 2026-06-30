// history.js - Halaman Riwayat
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable
    initializeDataTable();
    
    // Initialize last update time
    updateLastUpdateTime();
    
    // Tab functionality
    initializeTabs();
    
    // Filter functionality
    initializeFilters();
    
    // Modal functionality
    initializeModal();
    
    // Export functionality
    initializeExport();
    
    // Generate sample data
    generateSampleData();
    
    // Auto refresh every 60 seconds
    setInterval(updateHistoryData, 60000);
});

// Initialize DataTable
function initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#historyTable')) {
        $('#historyTable').DataTable().destroy();
    }
    
    window.historyTable = $('#historyTable').DataTable({
        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Semua"]],
        language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            paginate: {
                first: "Pertama",
                last: "Terakhir",
                next: "Selanjutnya",
                previous: "Sebelumnya"
            }
        },
        order: [[0, 'desc']], // Sort by date descending
        responsive: true
    });
}

// Generate sample history data
function generateSampleData() {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const now = new Date();
    const statuses = ['normal', 'warning', 'alert'];
    const statusLabels = {
        'normal': '<span class="status-badge status-normal">Normal</span>',
        'warning': '<span class="status-badge status-warning">Perhatian</span>',
        'alert': '<span class="status-badge status-alert">Alert</span>'
    };
    
    // Generate 50 sample records
    for (let i = 0; i < 50; i++) {
        const date = new Date(now);
        date.setHours(date.getHours() - Math.floor(Math.random() * 168)); // Up to 7 days ago
        date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
        
        const energy = (25 + Math.random() * 15).toFixed(1);
        const current = (6 + Math.random() * 2).toFixed(2);
        const voltage = (45 + Math.random() * 5).toFixed(1);
        const power = (parseFloat(current) * parseFloat(voltage)).toFixed(1);
        const efficiency = (80 + Math.random() * 15).toFixed(1);
        const temperature = (28 + Math.random() * 7).toFixed(1);
        
        const status = statuses[Math.floor(Math.random() * 3)];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDateTime(date)}</td>
            <td>${energy}</td>
            <td>${current}</td>
            <td>${voltage}</td>
            <td>${power}</td>
            <td>${efficiency}</td>
            <td>${temperature}</td>
            <td>${statusLabels[status]}</td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Reinitialize DataTable with new data
    if (window.historyTable) {
        window.historyTable.clear();
        window.historyTable.rows.add($('#historyTableBody tr'));
        window.historyTable.draw();
    }
}

// Format date and time
function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Initialize tabs
function initializeTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const tabId = header.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            header.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize filters
function initializeFilters() {
    const dateRangeSelect = document.getElementById('dateRange');
    const dataTypeSelect = document.getElementById('dataType');
    const sortBySelect = document.getElementById('sortBy');
    const applyFilterBtn = document.getElementById('applyFilter');
    const resetFilterBtn = document.getElementById('resetFilter');
    
    // Date range select change
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                showDateRangeModal();
            }
        });
    }
    
    // Apply filter
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }
    
    // Reset filter
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilters);
    }
    
    // Sort by change
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            applySorting(this.value);
        });
    }
}

// Apply filters
function applyFilters() {
    const dateRange = document.getElementById('dateRange').value;
    const dataType = document.getElementById('dataType').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Show loading
    showNotification('Menerapkan filter...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        // Update summary cards based on filters
        updateSummaryCards(dateRange);
        
        // Apply sorting
        applySorting(sortBy);
        
        // Show success message
        showNotification('Filter berhasil diterapkan', 'success');
        
        // Update last update time
        updateLastUpdateTime();
    }, 500);
}

// Reset filters
function resetFilters() {
    document.getElementById('dateRange').value = '7days';
    document.getElementById('dataType').value = 'all';
    document.getElementById('sortBy').value = 'date_desc';
    
    showNotification('Filter telah direset', 'info');
    applyFilters();
}

// Apply sorting
function applySorting(sortOption) {
    if (!window.historyTable) return;
    
    let columnIndex, orderDirection;
    
    switch (sortOption) {
        case 'date_desc':
            columnIndex = 0;
            orderDirection = 'desc';
            break;
        case 'date_asc':
            columnIndex = 0;
            orderDirection = 'asc';
            break;
        case 'value_desc':
            columnIndex = 1; // Energy column
            orderDirection = 'desc';
            break;
        case 'value_asc':
            columnIndex = 1; // Energy column
            orderDirection = 'asc';
            break;
    }
    
    window.historyTable.order([columnIndex, orderDirection]).draw();
}

// Update summary cards based on date range
function updateSummaryCards(dateRange) {
    const summaryCards = document.querySelectorAll('.summary-card .summary-value');
    const periodTexts = document.querySelectorAll('.summary-period');
    
    if (summaryCards.length >= 4) {
        let energy, efficiency, alerts, maintenance;
        let periodText = '';
        
        switch (dateRange) {
            case 'today':
                energy = '95.3';
                efficiency = '88.2';
                alerts = '0';
                maintenance = '0';
                periodText = 'Hari Ini';
                break;
            case 'yesterday':
                energy = '87.6';
                efficiency = '85.7';
                alerts = '1';
                maintenance = '0';
                periodText = 'Kemarin';
                break;
            case '7days':
                energy = '645.8';
                efficiency = '86.4';
                alerts = '3';
                maintenance = '1';
                periodText = '7 Hari Terakhir';
                break;
            case '30days':
                energy = '2,845.7';
                efficiency = '86.4';
                alerts = '8';
                maintenance = '2';
                periodText = '30 Hari Terakhir';
                break;
            default:
                energy = '2,845.7';
                efficiency = '86.4';
                alerts = '8';
                maintenance = '2';
                periodText = '30 Hari Terakhir';
        }
        
        summaryCards[0].textContent = energy + ' kWh';
        summaryCards[1].textContent = efficiency + '%';
        summaryCards[2].textContent = alerts;
        summaryCards[3].textContent = maintenance + ' Kali';
        
        periodTexts.forEach(p => {
            if (p.textContent.includes('Hari')) {
                p.textContent = periodText;
            }
        });
    }
}

// Initialize modal
function initializeModal() {
    const modal = document.getElementById('dateRangeModal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelDateRange');
    const applyBtn = document.getElementById('applyDateRange');
    
    // Set default dates
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    startDateInput.value = formatDate(oneWeekAgo);
    endDateInput.value = formatDate(today);
    
    // Close modal functions
    const closeModal = () => {
        modal.classList.remove('active');
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Apply date range
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                if (start > end) {
                    showNotification('Tanggal mulai tidak boleh setelah tanggal selesai', 'error');
                    return;
                }
                
                // Update UI with custom date range
                const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                document.querySelector('.summary-period').textContent = `${dayDiff} Hari Terpilih`;
                
                closeModal();
                showNotification(`Rentang tanggal diterapkan: ${formatDisplayDate(start)} - ${formatDisplayDate(end)}`, 'success');
            }
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Show date range modal
function showDateRangeModal() {
    const modal = document.getElementById('dateRangeModal');
    modal.classList.add('active');
}

// Format date for input
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display
function formatDisplayDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Initialize export functionality
function initializeExport() {
    const exportBtn = document.getElementById('exportHistory');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dateRange = document.getElementById('dateRange').value;
            const dataType = document.getElementById('dataType').value;
            
            // Simulate export process
            showNotification('Mempersiapkan data untuk diekspor...', 'info');
            
            setTimeout(() => {
                let filename = 'riwayat_data';
                
                if (dateRange !== 'all') {
                    filename += `_${dateRange}`;
                }
                
                if (dataType !== 'all') {
                    filename += `_${dataType}`;
                }
                
                filename += `_${formatDate(new Date())}.csv`;
                
                // Create dummy CSV content
                const csvContent = "Tanggal,Energi (kWh),Arus (A),Tegangan (V),Daya (W),Efisiensi (%),Suhu (°C),Status\n" +
                    "15/01/2024 14:30,32.5,7.2,46.8,337.0,87.5,31.2,Normal\n" +
                    "15/01/2024 13:45,31.8,7.1,46.5,330.2,86.8,30.8,Normal\n" +
                    "15/01/2024 12:30,29.4,6.8,45.9,312.1,85.2,29.5,Perhatian";
                
                // Create download link
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showNotification(`File ${filename} berhasil diunduh`, 'success');
            }, 1500);
        });
    }
    
    // Report download buttons
    const reportDownloads = document.querySelectorAll('.report-download');
    reportDownloads.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportTitle = this.closest('.report-item').querySelector('.report-title').textContent;
            showNotification(`Mengunduh ${reportTitle}...`, 'info');
            
            setTimeout(() => {
                showNotification(`${reportTitle} berhasil diunduh`, 'success');
            }, 1000);
        });
    });
}

// Update history data (simulated)
function updateHistoryData() {
    // Add new row to table
    if (window.historyTable) {
        const now = new Date();
        const newRow = [
            formatDateTime(now),
            (25 + Math.random() * 15).toFixed(1),
            (6 + Math.random() * 2).toFixed(2),
            (45 + Math.random() * 5).toFixed(1),
            (280 + Math.random() * 100).toFixed(1),
            (80 + Math.random() * 15).toFixed(1),
            (28 + Math.random() * 7).toFixed(1),
            '<span class="status-badge status-normal">Normal</span>'
        ];
        
        window.historyTable.row.add(newRow).draw(false);
        
        // Update last update time
        updateLastUpdateTime();
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
        `Terakhir diperbarui: ${dateString}, ${timeString}`;
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
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #2E7D32)' : 
                     type === 'error' ? 'linear-gradient(135deg, #F44336, #D32F2F)' :
                     'linear-gradient(135deg, #2196F3, #0D47A1)'};
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
    
    // Add CSS animation keyframes if not exists
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
            document.getElementById('exportHistory')?.click();
        }
        
        // Ctrl + F for filter
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            document.getElementById('applyFilter')?.click();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('dateRangeModal');
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        }
    });
});