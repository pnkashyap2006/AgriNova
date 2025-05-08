class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.permission = null;
        this.initialize();
    }

    async initialize() {
        // Request notification permission
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }
        
        // Initialize notification settings
        this.loadSettings();
        
        // Start notification scheduler
        this.startScheduler();
    }

    loadSettings() {
        // Load user preferences from localStorage
        const settings = JSON.parse(localStorage.getItem('notificationSettings')) || {
            dailyTasks: true,
            healthReminders: true,
            cropCare: true,
            soundEnabled: true,
            reminderInterval: 30 // minutes
        };
        this.settings = settings;
    }

    startScheduler() {
        // Check for notifications every minute
        setInterval(() => this.checkNotifications(), 60000);
    }

    async checkNotifications() {
        const now = new Date();
        
        // Check daily tasks
        if (this.settings.dailyTasks) {
            this.checkDailyTasks(now);
        }

        // Check health reminders
        if (this.settings.healthReminders) {
            this.checkHealthReminders(now);
        }

        // Check crop care reminders
        if (this.settings.cropCare) {
            await this.checkCropCareReminders(now);
        }
    }

    checkDailyTasks(now) {
        // Example daily tasks
        const tasks = [
            { time: '08:00', message: 'Time to water crops' },
            { time: '12:00', message: 'Check soil moisture levels' },
            { time: '16:00', message: 'Inspect crops for pests' }
        ];

        tasks.forEach(task => {
            const [hours, minutes] = task.time.split(':');
            if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes)) {
                this.sendNotification('Daily Task', task.message);
            }
        });
    }

    checkHealthReminders(now) {
        // Health reminders every 2 hours
        if (now.getHours() % 2 === 0 && now.getMinutes() === 0) {
            this.sendNotification('Health Reminder', 'Take a break and stay hydrated!');
        }
    }

    async checkCropCareReminders(now) {
        // Get crop data from the server
        try {
            const response = await fetch('/api/crops/status');
            const crops = await response.json();
            
            crops.forEach(crop => {
                // Check for fertilizer application
                if (crop.needsFertilizer) {
                    this.sendNotification('Crop Care', `Time to apply fertilizer to ${crop.name}`);
                }
                
                // Check for harvesting
                if (crop.readyForHarvest) {
                    this.sendNotification('Harvest Alert', `${crop.name} is ready for harvesting!`);
                }
            });
        } catch (error) {
            console.error('Error checking crop reminders:', error);
        }
    }

    sendNotification(title, message) {
        if (this.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: '/images/logo.png',
                badge: '/images/badge.png',
                vibrate: [200, 100, 200]
            });

            // Play sound if enabled
            if (this.settings.soundEnabled) {
                this.playNotificationSound();
            }

            // Add to notifications list
            this.notifications.push({
                title,
                message,
                timestamp: new Date()
            });

            // Update UI
            this.updateNotificationUI();
        }
    }

    playNotificationSound() {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play();
    }

    updateNotificationUI() {
        const notificationList = document.getElementById('notificationList');
        if (notificationList) {
            notificationList.innerHTML = this.notifications
                .slice(-5) // Show last 5 notifications
                .map(notification => `
                    <div class="notification-item">
                        <h4>${notification.title}</h4>
                        <p>${notification.message}</p>
                        <small>${this.formatTime(notification.timestamp)}</small>
                    </div>
                `)
                .join('');
        }
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    }

    // Settings management
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem(); 