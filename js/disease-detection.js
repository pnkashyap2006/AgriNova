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