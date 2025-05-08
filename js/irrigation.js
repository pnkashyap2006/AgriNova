class SmartIrrigationSystem {
    constructor() {
        this.settings = {
            autoMode: true,
            moistureThreshold: 30, // percentage
            wateringDuration: 15, // minutes
            schedule: {
                morning: { time: '06:00', duration: 15 },
                evening: { time: '18:00', duration: 15 }
            }
        };
        this.status = {
            isWatering: false,
            lastWatered: null,
            currentMoisture: 0,
            nextScheduled: null
        };
        this.initialize();
    }

    async initialize() {
        // Load settings from localStorage
        this.loadSettings();
        
        // Initialize UI
        this.initializeUI();
        
        // Start monitoring
        this.startMonitoring();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('irrigationSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveSettings() {
        localStorage.setItem('irrigationSettings', JSON.stringify(this.settings));
    }

    initializeUI() {
        const container = document.createElement('div');
        container.id = 'irrigationControl';
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Smart Irrigation Control</h3>
                    <div class="mode-toggle">
                        <label class="switch">
                            <input type="checkbox" id="autoModeToggle" ${this.settings.autoMode ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                        <span>Auto Mode</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="status-section">
                        <div class="status-item">
                            <span class="label">Current Moisture:</span>
                            <span class="value" id="currentMoisture">${this.status.currentMoisture}%</span>
                        </div>
                        <div class="status-item">
                            <span class="label">Last Watered:</span>
                            <span class="value" id="lastWatered">${this.formatTime(this.status.lastWatered)}</span>
                        </div>
                        <div class="status-item">
                            <span class="label">Next Scheduled:</span>
                            <span class="value" id="nextScheduled">${this.formatTime(this.status.nextScheduled)}</span>
                        </div>
                    </div>
                    <div class="control-section">
                        <button id="startWatering" class="btn primary" ${this.status.isWatering ? 'disabled' : ''}>
                            Start Watering
                        </button>
                        <button id="stopWatering" class="btn secondary" ${!this.status.isWatering ? 'disabled' : ''}>
                            Stop Watering
                        </button>
                    </div>
                    <div class="settings-section">
                        <h4>Settings</h4>
                        <div class="setting-item">
                            <label>Moisture Threshold:</label>
                            <input type="range" id="moistureThreshold" 
                                   min="10" max="50" step="5" 
                                   value="${this.settings.moistureThreshold}">
                            <span>${this.settings.moistureThreshold}%</span>
                        </div>
                        <div class="setting-item">
                            <label>Watering Duration:</label>
                            <input type="number" id="wateringDuration" 
                                   min="5" max="60" step="5" 
                                   value="${this.settings.wateringDuration}">
                            <span>minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('autoModeToggle').addEventListener('change', (e) => {
            this.settings.autoMode = e.target.checked;
            this.saveSettings();
            this.updateUI();
        });

        document.getElementById('startWatering').addEventListener('click', () => {
            this.startWatering();
        });

        document.getElementById('stopWatering').addEventListener('click', () => {
            this.stopWatering();
        });

        document.getElementById('moistureThreshold').addEventListener('input', (e) => {
            this.settings.moistureThreshold = parseInt(e.target.value);
            this.saveSettings();
            this.updateUI();
        });

        document.getElementById('wateringDuration').addEventListener('change', (e) => {
            this.settings.wateringDuration = parseInt(e.target.value);
            this.saveSettings();
            this.updateUI();
        });
    }

    async startMonitoring() {
        // Monitor soil moisture every minute
        setInterval(async () => {
            await this.checkMoisture();
            this.updateUI();
        }, 60000);

        // Initial check
        await this.checkMoisture();
        this.updateUI();
    }

    async checkMoisture() {
        try {
            const response = await fetch('/api/irrigation/moisture');
            const data = await response.json();
            this.status.currentMoisture = data.moisture;

            if (this.settings.autoMode && 
                this.status.currentMoisture < this.settings.moistureThreshold && 
                !this.status.isWatering) {
                this.startWatering();
            }
        } catch (error) {
            console.error('Error checking moisture:', error);
        }
    }

    async startWatering() {
        if (this.status.isWatering) return;

        try {
            const response = await fetch('/api/irrigation/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    duration: this.settings.wateringDuration
                })
            });

            if (response.ok) {
                this.status.isWatering = true;
                this.status.lastWatered = new Date();
                this.updateUI();

                // Schedule stop
                setTimeout(() => {
                    this.stopWatering();
                }, this.settings.wateringDuration * 60 * 1000);
            }
        } catch (error) {
            console.error('Error starting irrigation:', error);
        }
    }

    async stopWatering() {
        if (!this.status.isWatering) return;

        try {
            const response = await fetch('/api/irrigation/stop', {
                method: 'POST'
            });

            if (response.ok) {
                this.status.isWatering = false;
                this.updateUI();
            }
        } catch (error) {
            console.error('Error stopping irrigation:', error);
        }
    }

    updateUI() {
        // Update status display
        document.getElementById('currentMoisture').textContent = `${this.status.currentMoisture}%`;
        document.getElementById('lastWatered').textContent = this.formatTime(this.status.lastWatered);
        document.getElementById('nextScheduled').textContent = this.formatTime(this.status.nextScheduled);

        // Update button states
        document.getElementById('startWatering').disabled = this.status.isWatering;
        document.getElementById('stopWatering').disabled = !this.status.isWatering;

        // Update settings display
        document.getElementById('moistureThreshold').value = this.settings.moistureThreshold;
        document.getElementById('wateringDuration').value = this.settings.wateringDuration;
    }

    formatTime(date) {
        if (!date) return 'Never';
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    }

    calculateNextSchedule() {
        const now = new Date();
        const morning = new Date();
        const [morningHours, morningMinutes] = this.settings.schedule.morning.time.split(':');
        morning.setHours(parseInt(morningHours), parseInt(morningMinutes), 0);

        const evening = new Date();
        const [eveningHours, eveningMinutes] = this.settings.schedule.evening.time.split(':');
        evening.setHours(parseInt(eveningHours), parseInt(eveningMinutes), 0);

        if (now < morning) {
            return morning;
        } else if (now < evening) {
            return evening;
        } else {
            const nextMorning = new Date(morning);
            nextMorning.setDate(nextMorning.getDate() + 1);
            return nextMorning;
        }
    }
}

// Initialize smart irrigation system
const irrigationSystem = new SmartIrrigationSystem(); 