// Mock disease data for demonstration
const diseaseData = {
    'Apple___Apple_scab': {
        name: 'Apple Scab',
        description: 'A fungal disease that affects apple trees, causing dark, scaly lesions on leaves and fruit.',
        severity: 'high',
        treatment: 'Apply fungicides and remove infected leaves'
    },
    'Apple___Black_rot': {
        name: 'Black Rot',
        description: 'A fungal disease causing dark, circular lesions on leaves and fruit.',
        severity: 'high',
        treatment: 'Prune infected branches and apply fungicides'
    },
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
        name: 'Gray Leaf Spot',
        description: 'A fungal disease causing grayish-brown spots on corn leaves.',
        severity: 'medium',
        treatment: 'Use resistant varieties and apply fungicides'
    },
    'Potato___Early_blight': {
        name: 'Early Blight',
        description: 'A fungal disease causing dark brown spots with concentric rings on leaves.',
        severity: 'medium',
        treatment: 'Remove infected leaves and apply fungicides'
    },
    'Tomato___Early_blight': {
        name: 'Early Blight',
        description: 'A fungal disease causing dark brown spots with concentric rings on tomato leaves.',
        severity: 'medium',
        treatment: 'Remove infected leaves and apply fungicides'
    }
};

class DiseaseDetectionSystem {
    constructor() {
        this.model = null;
        this.cameraStream = null;
        this.isScanning = false;
        this.initialize();
    }

    async initialize() {
        // Load TensorFlow.js model
        try {
            this.model = await tf.loadLayersModel('/models/plant_disease_model/model.json');
            console.log('Disease detection model loaded successfully');
        } catch (error) {
            console.error('Error loading model:', error);
        }

        // Initialize UI elements
        this.initializeUI();
    }

    initializeUI() {
        // Create file input for multiple images
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*';
        fileInput.id = 'diseaseImageInput';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // Add event listeners
        fileInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Initialize camera preview
        this.initializeCamera();
    }

    async initializeCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            const videoElement = document.getElementById('cameraPreview');
            if (videoElement) {
                videoElement.srcObject = this.cameraStream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }

    async handleImageUpload(event) {
        const files = event.target.files;
        const results = [];

        for (const file of files) {
            try {
                const image = await this.loadImage(file);
                const prediction = await this.detectDisease(image);
                results.push({
                    filename: file.name,
                    ...prediction
                });
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
            }
        }

        this.displayResults(results);
    }

    async loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async detectDisease(image) {
        // Preprocess image
        const tensor = tf.browser.fromPixels(image)
            .resizeBilinear([224, 224])
            .expandDims()
            .toFloat()
            .div(255.0);

        // Get prediction
        const prediction = await this.model.predict(tensor).data();
        
        // Get top 3 predictions
        const top3 = this.getTopPredictions(prediction, 3);
        
        // Clean up
        tensor.dispose();
        
        return {
            predictions: top3,
            severity: this.calculateSeverity(top3[0].probability)
        };
    }

    getTopPredictions(predictions, k) {
        const indices = Array.from(predictions.keys())
            .sort((a, b) => predictions[b] - predictions[a])
            .slice(0, k);

        return indices.map(index => ({
            disease: this.getDiseaseName(index),
            probability: predictions[index]
        }));
    }

    calculateSeverity(probability) {
        if (probability > 0.8) return 'High';
        if (probability > 0.5) return 'Medium';
        return 'Low';
    }

    getDiseaseName(index) {
        // Map index to disease name
        const diseases = [
            'Healthy', 'Leaf Blight', 'Leaf Spot', 'Rust', 'Powdery Mildew'
            // Add more diseases as needed
        ];
        return diseases[index] || 'Unknown';
    }

    async startLiveScan() {
        if (!this.cameraStream) return;
        
        this.isScanning = true;
        const videoElement = document.getElementById('cameraPreview');
        
        while (this.isScanning) {
            try {
                const prediction = await this.detectDisease(videoElement);
                this.updateLiveResults(prediction);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Scan every second
            } catch (error) {
                console.error('Error in live scan:', error);
                this.stopLiveScan();
            }
        }
    }

    stopLiveScan() {
        this.isScanning = false;
    }

    updateLiveResults(prediction) {
        const resultsElement = document.getElementById('liveResults');
        if (resultsElement) {
            resultsElement.innerHTML = `
                <div class="prediction-result ${prediction.severity.toLowerCase()}">
                    <h3>${prediction.predictions[0].disease}</h3>
                    <p>Confidence: ${(prediction.predictions[0].probability * 100).toFixed(2)}%</p>
                    <p>Severity: ${prediction.severity}</p>
                </div>
            `;
        }
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('detectionResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = results.map(result => `
                <div class="result-card">
                    <h3>${result.filename}</h3>
                    <div class="predictions">
                        ${result.predictions.map(pred => `
                            <div class="prediction">
                                <span class="disease">${pred.disease}</span>
                                <span class="probability">${(pred.probability * 100).toFixed(2)}%</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="severity ${result.severity.toLowerCase()}">
                        Severity: ${result.severity}
                    </div>
                    <div class="recommendations">
                        ${this.getRecommendations(result.predictions[0].disease, result.severity)}
                    </div>
                </div>
            `).join('');
        }
    }

    getRecommendations(disease, severity) {
        // Return treatment recommendations based on disease and severity
        const recommendations = {
            'Leaf Blight': {
                High: 'Apply fungicide immediately. Remove infected leaves.',
                Medium: 'Apply preventive fungicide. Monitor closely.',
                Low: 'Monitor and maintain good air circulation.'
            },
            'Leaf Spot': {
                High: 'Apply copper-based fungicide. Remove infected leaves.',
                Medium: 'Apply preventive fungicide. Improve drainage.',
                Low: 'Monitor and maintain proper spacing.'
            },
            // Add more recommendations for other diseases
        };

        return recommendations[disease]?.[severity] || 'Monitor the plant closely.';
    }

    generateReport(results) {
        const report = {
            timestamp: new Date().toISOString(),
            totalScans: results.length,
            diseases: this.aggregateDiseases(results),
            recommendations: this.generateActionPlan(results)
        };

        // Save report
        this.saveReport(report);
        
        return report;
    }

    aggregateDiseases(results) {
        const diseaseCount = {};
        results.forEach(result => {
            const disease = result.predictions[0].disease;
            diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
        });
        return diseaseCount;
    }

    generateActionPlan(results) {
        const actionPlan = {
            immediate: [],
            shortTerm: [],
            longTerm: []
        };

        results.forEach(result => {
            const { disease, severity } = result;
            const recommendation = this.getRecommendations(disease, severity);
            
            if (severity === 'High') {
                actionPlan.immediate.push(recommendation);
            } else if (severity === 'Medium') {
                actionPlan.shortTerm.push(recommendation);
            } else {
                actionPlan.longTerm.push(recommendation);
            }
        });

        return actionPlan;
    }

    saveReport(report) {
        // Save report to localStorage or send to server
        const reports = JSON.parse(localStorage.getItem('diseaseReports') || '[]');
        reports.push(report);
        localStorage.setItem('diseaseReports', JSON.stringify(reports));
    }
}

// Initialize disease detection system
const diseaseDetection = new DiseaseDetectionSystem();

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const detectBtn = document.getElementById('detectBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const results = document.getElementById('results');

    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Handle file upload
    uploadArea.addEventListener('click', () => imageInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4CAF50';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        } else {
            showError('Please upload a valid image file.');
        }
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // Handle detection
    detectBtn.addEventListener('click', () => {
        if (!imagePreview.src) return;
        detectDiseases();
    });
});

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewContainer = document.getElementById('previewContainer');
        const imagePreview = document.getElementById('imagePreview');
        const detectBtn = document.getElementById('detectBtn');

        imagePreview.src = e.target.result;
        previewContainer.style.display = 'block';
        detectBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

function clearImage() {
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const detectBtn = document.getElementById('detectBtn');
    const results = document.getElementById('results');

    imagePreview.src = '';
    previewContainer.style.display = 'none';
    detectBtn.disabled = true;
    results.innerHTML = `
        <div class="placeholder">
            <span class="material-icons">science</span>
            <p>Upload a plant image to detect diseases</p>
        </div>
    `;
}

async function detectDiseases() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const results = document.getElementById('results');

    loading.style.display = 'flex';
    error.style.display = 'none';

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get random disease for demonstration
        const diseases = Object.keys(diseaseData);
        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const disease = diseaseData[randomDisease];

        // Display results
        results.innerHTML = `
            <div class="disease-item">
                <div class="disease-header">
                    <span class="material-icons">bug_report</span>
                    <h4>${disease.name}</h4>
                </div>
                <p>${disease.description}</p>
                <div class="disease-details">
                    <span class="severity ${disease.severity}">${disease.severity.toUpperCase()}</span>
                    <span class="treatment">${disease.treatment}</span>
                </div>
                <div class="confidence">
                    Confidence: ${Math.round(Math.random() * 30 + 70)}%
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Error detecting diseases:', err);
        showError('Failed to detect diseases. Please try again.');
    } finally {
        loading.style.display = 'none';
    }
}

function showError(message) {
    const error = document.getElementById('error');
    error.innerHTML = `
        <span class="material-icons">error</span>
        <span>${message}</span>
    `;
    error.style.display = 'flex';
} 