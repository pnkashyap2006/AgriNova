// Comprehensive crop data with detailed information
const cropData = {
    "Rice": {
        description: "A staple food crop that thrives in warm, wet conditions.",
        growingConditions: {
            temperature: { min: 20, max: 35, ideal: 25 },
            rainfall: { min: 100, max: 300, ideal: 150 },
            pH: { min: 5.5, max: 6.5, ideal: 6.0 },
            soilTypes: ["Clay", "Alluvial"],
            seasons: ["Kharif"]
        },
        economicInfo: {
            marketPrice: "₹2,000-3,000 per quintal",
            yieldPerAcre: "20-25 quintals",
            growingPeriod: "120-150 days",
            waterRequirement: "High"
        }
    },
    "Wheat": {
        description: "A winter crop that requires cool temperatures and moderate rainfall.",
        growingConditions: {
            temperature: { min: 15, max: 25, ideal: 20 },
            rainfall: { min: 50, max: 150, ideal: 100 },
            pH: { min: 6.0, max: 7.5, ideal: 6.5 },
            soilTypes: ["Loamy", "Clay"],
            seasons: ["Rabi"]
        },
        economicInfo: {
            marketPrice: "₹1,800-2,500 per quintal",
            yieldPerAcre: "15-20 quintals",
            growingPeriod: "100-120 days",
            waterRequirement: "Medium"
        }
    },
    "Cotton": {
        description: "A cash crop that requires warm temperatures and well-drained soil.",
        growingConditions: {
            temperature: { min: 25, max: 35, ideal: 30 },
            rainfall: { min: 50, max: 100, ideal: 75 },
            pH: { min: 6.0, max: 7.5, ideal: 6.5 },
            soilTypes: ["Black", "Alluvial"],
            seasons: ["Kharif"]
        },
        economicInfo: {
            marketPrice: "₹5,000-7,000 per quintal",
            yieldPerAcre: "8-12 quintals",
            growingPeriod: "150-180 days",
            waterRequirement: "Medium-High"
        }
    },
    "Sugarcane": {
        description: "A tropical crop that requires high temperatures and abundant water.",
        growingConditions: {
            temperature: { min: 25, max: 35, ideal: 30 },
            rainfall: { min: 150, max: 300, ideal: 200 },
            pH: { min: 6.0, max: 7.5, ideal: 6.5 },
            soilTypes: ["Alluvial", "Black"],
            seasons: ["Kharif"]
        },
        economicInfo: {
            marketPrice: "₹3,000-4,000 per ton",
            yieldPerAcre: "300-400 tons",
            growingPeriod: "12-18 months",
            waterRequirement: "Very High"
        }
    },
    "Soybean": {
        description: "A leguminous crop that adapts well to various soil conditions.",
        growingConditions: {
            temperature: { min: 20, max: 30, ideal: 25 },
            rainfall: { min: 50, max: 150, ideal: 100 },
            pH: { min: 6.0, max: 7.0, ideal: 6.5 },
            soilTypes: ["Loamy", "Black"],
            seasons: ["Kharif"]
        },
        economicInfo: {
            marketPrice: "₹4,000-5,000 per quintal",
            yieldPerAcre: "10-15 quintals",
            growingPeriod: "90-100 days",
            waterRequirement: "Medium"
        }
    },
    "Groundnut": {
        description: "A drought-resistant crop suitable for sandy soils.",
        growingConditions: {
            temperature: { min: 25, max: 35, ideal: 30 },
            rainfall: { min: 50, max: 100, ideal: 75 },
            pH: { min: 6.0, max: 7.0, ideal: 6.5 },
            soilTypes: ["Sandy", "Loamy"],
            seasons: ["Kharif", "Rabi"]
        },
        economicInfo: {
            marketPrice: "₹5,000-6,000 per quintal",
            yieldPerAcre: "15-20 quintals",
            growingPeriod: "100-120 days",
            waterRequirement: "Low-Medium"
        }
    }
};

// Initialize form and add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cropAdvisorForm');
    form.addEventListener('submit', getRecommendations);

    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});

// Get recommendations based on input conditions
function getRecommendations(event) {
    event.preventDefault();
    
    // Show loading state
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('error').style.display = 'none';
    document.getElementById('recommendations').innerHTML = '';

    // Get form values
    const temperature = parseFloat(document.getElementById('temperature').value);
    const rainfall = parseFloat(document.getElementById('rainfall').value);
    const pH = parseFloat(document.getElementById('pH').value);
    const season = document.getElementById('season').value;
    const soilType = document.getElementById('soilType').value;

    // Validate inputs
    if (!validateInputs(temperature, rainfall, pH, season, soilType)) {
        showError('Please fill in all fields with valid values');
        return;
    }

    // Simulate API call delay
    setTimeout(() => {
        try {
            const recommendations = findSuitableCrops(temperature, rainfall, pH, season, soilType);
            displayRecommendations(recommendations);
        } catch (error) {
            showError('Error getting recommendations. Please try again.');
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }, 1000);
}

// Validate input values
function validateInputs(temperature, rainfall, pH, season, soilType) {
    return !isNaN(temperature) && !isNaN(rainfall) && !isNaN(pH) && 
           season && soilType && 
           temperature >= 0 && temperature <= 50 &&
           rainfall >= 0 && rainfall <= 5000 &&
           pH >= 0 && pH <= 14;
}

// Find suitable crops based on conditions
function findSuitableCrops(temperature, rainfall, pH, season, soilType) {
    const suitableCrops = [];
    
    for (const [crop, data] of Object.entries(cropData)) {
        const conditions = data.growingConditions;
        
        // Check if crop is suitable for the season
        if (!conditions.seasons.includes(season)) continue;
        
        // Check if crop is suitable for the soil type
        if (!conditions.soilTypes.includes(soilType)) continue;
        
        // Calculate suitability score
        let score = 0;
        
        // Temperature score
        if (temperature >= conditions.temperature.min && temperature <= conditions.temperature.max) {
            score += 2;
            if (Math.abs(temperature - conditions.temperature.ideal) <= 5) score += 1;
        }
        
        // Rainfall score
        if (rainfall >= conditions.rainfall.min && rainfall <= conditions.rainfall.max) {
            score += 2;
            if (Math.abs(rainfall - conditions.rainfall.ideal) <= 50) score += 1;
        }
        
        // pH score
        if (pH >= conditions.pH.min && pH <= conditions.pH.max) {
            score += 2;
            if (Math.abs(pH - conditions.pH.ideal) <= 0.5) score += 1;
        }
        
        // Add crop to recommendations if score is high enough
        if (score >= 4) {
            suitableCrops.push({
                name: crop,
                score: score,
                data: data
            });
        }
    }
    
    // Sort by score
    return suitableCrops.sort((a, b) => b.score - a.score);
}

// Display recommendations
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    container.innerHTML = '';

    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <span class="material-icons">agriculture</span>
                <p>No suitable crops found for the given conditions.</p>
                <p>Try adjusting the parameters to get better recommendations.</p>
            </div>
        `;
        return;
    }

    recommendations.forEach(crop => {
        const card = document.createElement('div');
        card.className = 'crop-card';
        card.innerHTML = `
            <div class="crop-header">
                <h3>${crop.name}</h3>
                <div class="suitability-score">
                    <span class="material-icons">star</span>
                    <span>${crop.score}/6</span>
                </div>
            </div>
            <p>${crop.data.description}</p>
            <div class="crop-details">
                <div class="detail-item">
                    <span class="material-icons">thermostat</span>
                    <span>${crop.data.growingConditions.temperature.min}°C - ${crop.data.growingConditions.temperature.max}°C</span>
                </div>
                <div class="detail-item">
                    <span class="material-icons">water_drop</span>
                    <span>${crop.data.growingConditions.rainfall.min}mm - ${crop.data.growingConditions.rainfall.max}mm</span>
                </div>
                <div class="detail-item">
                    <span class="material-icons">science</span>
                    <span>pH: ${crop.data.growingConditions.pH.min} - ${crop.data.growingConditions.pH.max}</span>
                </div>
            </div>
            <button class="btn primary" onclick="showCropDetails('${crop.name}')">
                <span class="material-icons">info</span>
                View Details
            </button>
        `;
        container.appendChild(card);
    });
}

// Show detailed information for a selected crop
function showCropDetails(cropName) {
    const crop = cropData[cropName];
    const detailsContainer = document.getElementById('selectedCropDetails');
    const growingConditions = document.getElementById('growingConditions');
    const economicInfo = document.getElementById('economicInfo');

    growingConditions.innerHTML = `
        <div class="detail-item">
            <span class="material-icons">thermostat</span>
            <div>
                <strong>Temperature Range:</strong>
                <p>${crop.growingConditions.temperature.min}°C - ${crop.growingConditions.temperature.max}°C</p>
                <small>Ideal: ${crop.growingConditions.temperature.ideal}°C</small>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-icons">water_drop</span>
            <div>
                <strong>Rainfall Range:</strong>
                <p>${crop.growingConditions.rainfall.min}mm - ${crop.growingConditions.rainfall.max}mm</p>
                <small>Ideal: ${crop.growingConditions.rainfall.ideal}mm</small>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-icons">science</span>
            <div>
                <strong>Soil pH Range:</strong>
                <p>${crop.growingConditions.pH.min} - ${crop.growingConditions.pH.max}</p>
                <small>Ideal: ${crop.growingConditions.pH.ideal}</small>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-icons">terrain</span>
            <div>
                <strong>Soil Types:</strong>
                <p>${crop.growingConditions.soilTypes.join(', ')}</p>
            </div>
        </div>
    `;

    economicInfo.innerHTML = `
        <div class="detail-item">
            <span class="material-icons">payments</span>
            <div>
                <strong>Market Price:</strong>
                <p>${crop.economicInfo.marketPrice}</p>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-icons">agriculture</span>
            <div>
                <strong>Yield per Acre:</strong>
                <p>${crop.economicInfo.yieldPerAcre}</p>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-icons">schedule</span>
            <div>
                <strong>Growing Period:</strong>
                <p>${crop.economicInfo.growingPeriod}</p>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-icons">water_drop</span>
            <div>
                <strong>Water Requirement:</strong>
                <p>${crop.economicInfo.waterRequirement}</p>
            </div>
        </div>
    `;

    detailsContainer.style.display = 'block';
}

// Close crop details
function closeDetails() {
    document.getElementById('selectedCropDetails').style.display = 'none';
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = `
        <span class="material-icons">error</span>
        <span>${message}</span>
    `;
    errorDiv.style.display = 'flex';
    document.getElementById('loading').style.display = 'none';
} 