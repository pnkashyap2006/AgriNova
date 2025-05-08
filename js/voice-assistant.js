class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.currentLanguage = 'en-US';
        this.supportedLanguages = {
            'en-US': 'English',
            'hi-IN': 'Hindi',
            'es-ES': 'Spanish',
            'fr-FR': 'French'
        };
        this.initialize();
    }

    initialize() {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.setupRecognition();
        }

        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }

        // Initialize UI
        this.initializeUI();
    }

    setupRecognition() {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUIState();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUIState();
        };

        this.recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            if (result.isFinal) {
                this.handleCommand(result[0].transcript);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.speak('Sorry, I encountered an error. Please try again.');
        };
    }

    initializeUI() {
        // Create voice assistant UI elements
        const container = document.createElement('div');
        container.id = 'voiceAssistant';
        container.innerHTML = `
            <div class="voice-assistant-container">
                <button id="voiceAssistantToggle" class="voice-assistant-button">
                    <span class="material-icons">mic</span>
                </button>
                <div class="voice-assistant-status"></div>
                <select id="languageSelect" class="language-select">
                    ${Object.entries(this.supportedLanguages)
                        .map(([code, name]) => `<option value="${code}">${name}</option>`)
                        .join('')}
                </select>
            </div>
        `;
        document.body.appendChild(container);

        // Add event listeners
        document.getElementById('voiceAssistantToggle').addEventListener('click', () => this.toggleListening());
        document.getElementById('languageSelect').addEventListener('change', (e) => this.changeLanguage(e.target.value));
    }

    updateUIState() {
        const button = document.getElementById('voiceAssistantToggle');
        const status = document.querySelector('.voice-assistant-status');
        
        if (this.isListening) {
            button.classList.add('listening');
            status.textContent = 'Listening...';
        } else {
            button.classList.remove('listening');
            status.textContent = 'Click to start';
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    changeLanguage(languageCode) {
        if (this.supportedLanguages[languageCode]) {
            this.currentLanguage = languageCode;
            this.recognition.lang = languageCode;
            this.speak('Language changed to ' + this.supportedLanguages[languageCode]);
        }
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.currentLanguage;
            this.synthesis.speak(utterance);
        }
    }

    async handleCommand(command) {
        command = command.toLowerCase().trim();
        
        // Command patterns
        const patterns = {
            weather: /weather|forecast|temperature/i,
            crop: /crop|plant|harvest/i,
            disease: /disease|sick|healthy/i,
            irrigation: /water|irrigation|moisture/i,
            help: /help|what can you do/i
        };

        // Match command to pattern
        for (const [action, pattern] of Object.entries(patterns)) {
            if (pattern.test(command)) {
                await this.executeCommand(action, command);
                return;
            }
        }

        // Default response for unrecognized commands
        this.speak("I'm sorry, I didn't understand that command. You can ask me about weather, crops, diseases, or irrigation.");
    }

    async executeCommand(action, command) {
        switch (action) {
            case 'weather':
                await this.handleWeatherCommand(command);
                break;
            case 'crop':
                await this.handleCropCommand(command);
                break;
            case 'disease':
                await this.handleDiseaseCommand(command);
                break;
            case 'irrigation':
                await this.handleIrrigationCommand(command);
                break;
            case 'help':
                this.handleHelpCommand();
                break;
        }
    }

    async handleWeatherCommand(command) {
        try {
            const response = await fetch('/api/weather/current');
            const data = await response.json();
            this.speak(`Current temperature is ${data.temperature} degrees. ${data.condition}. Humidity is ${data.humidity} percent.`);
        } catch (error) {
            this.speak('Sorry, I could not fetch the weather information.');
        }
    }

    async handleCropCommand(command) {
        try {
            const response = await fetch('/api/crops/status');
            const data = await response.json();
            this.speak(`Your ${data.currentCrop} is in ${data.growthStage} stage. ${data.recommendation}`);
        } catch (error) {
            this.speak('Sorry, I could not fetch the crop information.');
        }
    }

    async handleDiseaseCommand(command) {
        this.speak('Would you like to scan for plant diseases? You can use the camera or upload images.');
    }

    async handleIrrigationCommand(command) {
        try {
            const response = await fetch('/api/irrigation/status');
            const data = await response.json();
            this.speak(`Soil moisture is ${data.moisture} percent. ${data.recommendation}`);
        } catch (error) {
            this.speak('Sorry, I could not fetch the irrigation information.');
        }
    }

    handleHelpCommand() {
        const helpText = `
            I can help you with:
            - Weather information and forecasts
            - Crop status and recommendations
            - Disease detection and treatment
            - Irrigation scheduling and monitoring
            Just ask me about any of these topics!
        `;
        this.speak(helpText);
    }
}

// Initialize voice assistant
const voiceAssistant = new VoiceAssistant(); 