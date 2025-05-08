class SmartReminderSystem {
    constructor() {
        this.reminders = [];
        this.settings = {
            dailyTasks: true,
            healthReminders: true,
            cropCare: true,
            soundEnabled: true,
            breakInterval: 120, // minutes
            hydrationInterval: 60, // minutes
            weatherAlerts: true,
            marketUpdates: true
        };
        this.initialize();
    }

    async initialize() {
        // Load settings from localStorage
        this.loadSettings();
        
        // Request notification permission
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }
        
        // Initialize UI
        this.initializeUI();
        
        // Start reminder scheduler
        this.startScheduler();

        // Add some initial reminders for demonstration
        this.addDemoReminders();
    }

    addDemoReminders() {
        const now = new Date();
        const demoReminders = [
            {
                title: 'Daily Task',
                message: 'Time to water the wheat field',
                time: new Date(now.getTime() - 30 * 60000) // 30 minutes ago
            },
            {
                title: 'Health Reminder',
                message: 'Take a break and stretch your legs!',
                time: new Date(now.getTime() - 15 * 60000) // 15 minutes ago
            },
            {
                title: 'Crop Care',
                message: 'Fertilizer application due for corn field',
                time: new Date(now.getTime() - 5 * 60000) // 5 minutes ago
            },
            {
                title: 'Weather Alert',
                message: 'Heavy rain expected in next 2 hours',
                time: new Date(now.getTime() - 2 * 60000) // 2 minutes ago
            }
        ];

        this.reminders = demoReminders;
        this.updateReminderUI();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('reminderSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveSettings() {
        localStorage.setItem('reminderSettings', JSON.stringify(this.settings));
    }

    initializeUI() {
        const container = document.createElement('div');
        container.id = 'reminderSystem';
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Smart Reminders</h3>
                </div>
                <div class="card-content">
                    <div class="reminder-settings" style="display: none;">
                        <div class="setting-group">
                            <h4>Reminder Types</h4>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="dailyTasksToggle" 
                                           ${this.settings.dailyTasks ? 'checked' : ''}>
                                    Daily Tasks
                                </label>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="healthRemindersToggle" 
                                           ${this.settings.healthReminders ? 'checked' : ''}>
                                    Health Reminders
                                </label>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="cropCareToggle" 
                                           ${this.settings.cropCare ? 'checked' : ''}>
                                    Crop Care
                                </label>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="weatherAlertsToggle" 
                                           ${this.settings.weatherAlerts ? 'checked' : ''}>
                                    Weather Alerts
                                </label>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="marketUpdatesToggle" 
                                           ${this.settings.marketUpdates ? 'checked' : ''}>
                                    Market Updates
                                </label>
                            </div>
                        </div>
                        <div class="setting-group">
                            <h4>Intervals (minutes)</h4>
                            <div class="setting-item">
                                <label>Break Reminders:</label>
                                <input type="number" id="breakInterval" 
                                       min="30" max="240" step="30" 
                                       value="${this.settings.breakInterval}">
                            </div>
                            <div class="setting-item">
                                <label>Hydration Reminders:</label>
                                <input type="number" id="hydrationInterval" 
                                       min="30" max="120" step="15" 
                                       value="${this.settings.hydrationInterval}">
                            </div>
                        </div>
                        <div class="setting-group">
                            <h4>Notifications</h4>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="soundToggle" 
                                           ${this.settings.soundEnabled ? 'checked' : ''}>
                                    Sound
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="reminder-list" id="reminderList"></div>
                </div>
            </div>
            <div class="modal" id="addReminderModal" style="display: none;">
                <div class="modal-content">
                    <h3>Add New Reminder</h3>
                    <form id="addReminderForm">
                        <div class="form-group">
                            <label>Title:</label>
                            <input type="text" id="reminderTitle" required>
                        </div>
                        <div class="form-group">
                            <label>Message:</label>
                            <textarea id="reminderMessage" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Time:</label>
                            <input type="datetime-local" id="reminderTime" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn secondary" id="cancelReminder">Cancel</button>
                            <button type="submit" class="btn primary">Add Reminder</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Settings toggle
        document.getElementById('reminderSettingsBtn').addEventListener('click', () => {
            const settings = document.querySelector('.reminder-settings');
            settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
        });

        // Add reminder button
        document.getElementById('addReminderBtn').addEventListener('click', () => {
            const modal = document.getElementById('addReminderModal');
            modal.style.display = 'block';
        });

        // Cancel reminder
        document.getElementById('cancelReminder').addEventListener('click', () => {
            const modal = document.getElementById('addReminderModal');
            modal.style.display = 'none';
        });

        // Add reminder form
        document.getElementById('addReminderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('reminderTitle').value;
            const message = document.getElementById('reminderMessage').value;
            const time = new Date(document.getElementById('reminderTime').value);
            
            this.sendReminder(title, message, time);
            
            const modal = document.getElementById('addReminderModal');
            modal.style.display = 'none';
            e.target.reset();
        });

        // Settings changes
        document.getElementById('dailyTasksToggle').addEventListener('change', (e) => {
            this.settings.dailyTasks = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('healthRemindersToggle').addEventListener('change', (e) => {
            this.settings.healthReminders = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('cropCareToggle').addEventListener('change', (e) => {
            this.settings.cropCare = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('weatherAlertsToggle').addEventListener('change', (e) => {
            this.settings.weatherAlerts = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('marketUpdatesToggle').addEventListener('change', (e) => {
            this.settings.marketUpdates = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('breakInterval').addEventListener('change', (e) => {
            this.settings.breakInterval = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('hydrationInterval').addEventListener('change', (e) => {
            this.settings.hydrationInterval = parseInt(e.target.value);
            this.saveSettings();
        });
    }

    startScheduler() {
        // Check for reminders every minute
        setInterval(() => this.checkReminders(), 60000);
        
        // Initial check
        this.checkReminders();
    }

    async checkReminders() {
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

        // Check weather alerts
        if (this.settings.weatherAlerts) {
            this.checkWeatherAlerts(now);
        }

        // Check market updates
        if (this.settings.marketUpdates) {
            this.checkMarketUpdates(now);
        }
    }

    checkDailyTasks(now) {
        const tasks = [
            { time: '08:00', message: 'Time to water crops' },
            { time: '12:00', message: 'Check soil moisture levels' },
            { time: '16:00', message: 'Inspect crops for pests' }
        ];

        tasks.forEach(task => {
            const [hours, minutes] = task.time.split(':');
            if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes)) {
                this.sendReminder('Daily Task', task.message);
            }
        });
    }

    checkHealthReminders(now) {
        // Break reminders
        if (now.getMinutes() % this.settings.breakInterval === 0) {
            this.sendReminder('Health Reminder', 'Take a break and stretch your legs!');
        }

        // Hydration reminders
        if (now.getMinutes() % this.settings.hydrationInterval === 0) {
            this.sendReminder('Health Reminder', 'Time to stay hydrated! Drink some water.');
        }
    }

    async checkCropCareReminders(now) {
        try {
            const response = await fetch('/api/crops/status');
            const crops = await response.json();
            
            crops.forEach(crop => {
                // Check for fertilizer application
                if (crop.needsFertilizer) {
                    this.sendReminder('Crop Care', `Time to apply fertilizer to ${crop.name}`);
                }
                
                // Check for harvesting
                if (crop.readyForHarvest) {
                    this.sendReminder('Harvest Alert', `${crop.name} is ready for harvesting!`);
                }

                // Check for pest inspection
                if (crop.lastPestInspection) {
                    const daysSinceInspection = Math.floor((now - new Date(crop.lastPestInspection)) / (1000 * 60 * 60 * 24));
                    if (daysSinceInspection >= 7) {
                        this.sendReminder('Crop Care', `Time for weekly pest inspection of ${crop.name}`);
                    }
                }
            });
        } catch (error) {
            console.error('Error checking crop reminders:', error);
        }
    }

    checkWeatherAlerts(now) {
        // Implementation of checking weather alerts
    }

    checkMarketUpdates(now) {
        // Implementation of checking market updates
    }

    sendReminder(title, message) {
        // Add to reminders list
        this.reminders.push({
            title,
            message,
            time: new Date()
        });

        // Send browser notification if permission granted
        if (this.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: '/images/logo.png',
                badge: '/images/badge.png',
                vibrate: [200, 100, 200]
            });

            // Play sound if enabled
            if (this.settings.soundEnabled) {
                this.playReminderSound();
            }
        }

        // Update UI
        this.updateReminderUI();
    }

    playReminderSound() {
        const audio = new Audio('/sounds/reminder.mp3');
        audio.play();
    }

    updateReminderUI() {
        const reminderList = document.getElementById('reminderList');
        if (!reminderList) return;

        // Clear existing reminders
        reminderList.innerHTML = '';

        // Sort reminders by time
        this.reminders.sort((a, b) => b.time - a.time);

        // Add reminders to the list
        this.reminders.forEach(reminder => {
            const reminderElement = document.createElement('div');
            reminderElement.className = 'reminder-item';
            
            reminderElement.innerHTML = `
                <span class="material-icons reminder-icon">${this.getReminderIcon(reminder.title)}</span>
                <div class="reminder-content">
                    <div class="reminder-title">${reminder.title}</div>
                    <div class="reminder-message">${reminder.message}</div>
                    <div class="reminder-time">${this.formatTime(reminder.time)}</div>
                </div>
                <button class="btn icon-btn delete-reminder" title="Delete reminder">
                    <span class="material-icons">delete</span>
                </button>
            `;
            
            // Add delete functionality
            const deleteBtn = reminderElement.querySelector('.delete-reminder');
            deleteBtn.addEventListener('click', () => {
                this.reminders = this.reminders.filter(r => r !== reminder);
                this.updateReminderUI();
            });
            
            reminderList.appendChild(reminderElement);
        });

        // Remove old reminders (older than 24 hours)
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        this.reminders = this.reminders.filter(reminder => reminder.time > yesterday);
    }

    getReminderIcon(title) {
        switch (title) {
            case 'Daily Task':
                return 'schedule';
            case 'Health Reminder':
                return 'favorite';
            case 'Crop Care':
                return 'eco';
            case 'Harvest Alert':
                return 'agriculture';
            case 'Weather Alert':
                return 'cloud';
            case 'Market Update':
                return 'trending_up';
            default:
                return 'notifications';
        }
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    }
}

// Initialize reminder system
document.addEventListener('DOMContentLoaded', () => {
    new SmartReminderSystem();
}); 