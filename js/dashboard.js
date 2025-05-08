// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon) {
        menuIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Add animation class
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                setTimeout(() => {
                    navLinks.style.opacity = '1';
                    navLinks.style.transform = 'translateY(0)';
                }, 10);
            } else {
                navLinks.style.opacity = '0';
                navLinks.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    navLinks.style.display = 'none';
                }, 300);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuIcon.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                navLinks.style.opacity = '0';
                navLinks.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    navLinks.style.display = 'none';
                }, 300);
            }
        });
    }

    // Initialize weather chart
    const ctx = document.getElementById('weatherChart');
    if (ctx) {
        const weatherData = {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [22, 20, 23, 27, 26, 24],
                    borderColor: '#8884d8',
                    tension: 0.4,
                    yAxisID: 'y1',
                },
                {
                    label: 'Humidity (%)',
                    data: [65, 70, 60, 55, 58, 62],
                    borderColor: '#82ca9d',
                    tension: 0.4,
                    yAxisID: 'y2',
                }
            ]
        };

        new Chart(ctx, {
            type: 'line',
            data: weatherData,
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    // Add click handlers for buttons
    const viewDetailsBtn = document.querySelector('.card-content .btn.primary');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function() {
            alert('Viewing crop details... (To be implemented)');
        });
    }

    const viewAllAlertsBtn = document.querySelector('.card-header .btn.text');
    if (viewAllAlertsBtn) {
        viewAllAlertsBtn.addEventListener('click', function() {
            alert('Viewing all alerts... (To be implemented)');
        });
    }

    // Simulate real-time updates
    function updateStats() {
        const temperature = 20 + Math.random() * 10;
        const moisture = 50 + Math.random() * 30;
        const humidity = 50 + Math.random() * 20;

        document.querySelector('.stat-item:nth-child(1) span:last-child').textContent = 
            `Temperature: ${temperature.toFixed(1)}°C`;
        document.querySelector('.stat-item:nth-child(2) span:last-child').textContent = 
            `Soil Moisture: ${moisture.toFixed(1)}%`;
        document.querySelector('.stat-item:nth-child(3) span:last-child').textContent = 
            `Humidity: ${humidity.toFixed(1)}%`;
    }

    // Update stats every 5 seconds
    setInterval(updateStats, 5000);
}); 