// OpenWeatherMap API configuration
const API_KEY = '84d7863c80eb5b7c86b8e5daa385a75d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Fallback coordinates (Bangalore, India)
const FALLBACK_COORDINATES = {
    latitude: 12.9716,
    longitude: 77.5946
};

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const location = document.getElementById('location');
    const currentTemp = document.getElementById('currentTemp');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const uvIndex = document.getElementById('uvIndex');
    const weatherDesc = document.getElementById('weatherDesc');
    const forecastGrid = document.getElementById('forecastGrid');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Show loading state
    loading.style.display = 'flex';
    error.style.display = 'none';

    // Get user's location and fetch weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(latitude, longitude);
            },
            error => {
                console.error('Error getting location:', error);
                // Use fallback coordinates if geolocation fails
                fetchWeatherData(FALLBACK_COORDINATES.latitude, FALLBACK_COORDINATES.longitude);
            }
        );
    } else {
        // Use fallback coordinates if geolocation is not supported
        fetchWeatherData(FALLBACK_COORDINATES.latitude, FALLBACK_COORDINATES.longitude);
    }
});

async function fetchWeatherData(latitude, longitude) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(
            `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!currentWeatherResponse.ok) {
            throw new Error(`Weather API error: ${currentWeatherResponse.status}`);
        }

        const currentWeatherData = await currentWeatherResponse.json();

        // Fetch 7-day forecast
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();

        // Process and display the data
        updateWeatherData(currentWeatherData, forecastData);
        loading.style.display = 'none';
        error.style.display = 'none';
    } catch (err) {
        console.error('Error fetching weather data:', err);
        showError('Failed to load weather data. Please try again.');
        loading.style.display = 'none';
    }
}

function updateWeatherData(current, forecast) {
    // Update current weather
    document.getElementById('location').textContent = current.name || 'Unknown Location';
    document.getElementById('currentTemp').textContent = Math.round(current.main.temp);
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind.speed)} km/h`;
    document.getElementById('weatherDesc').textContent = current.weather[0].description;

    // Calculate UV Index (OpenWeatherMap doesn't provide UV index in free tier)
    const uvIndex = calculateUVIndex(current.main.temp, current.weather[0].main);
    document.getElementById('uvIndex').textContent = uvIndex;

    // Process and display forecast
    const dailyForecasts = processForecastData(forecast.list);
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = dailyForecasts.map(day => `
        <div class="forecast-item">
            <div class="date">${formatDate(day.date)}</div>
            <div class="temp">${Math.round(day.temp)}°C</div>
            <div class="description">${day.description}</div>
        </div>
    `).join('');
}

function processForecastData(forecastList) {
    // Group forecasts by day and get the first forecast of each day
    const dailyForecasts = [];
    const seen = new Set();

    forecastList.forEach(forecast => {
        const date = forecast.dt_txt.split(' ')[0];
        if (!seen.has(date)) {
            seen.add(date);
            dailyForecasts.push({
                date: forecast.dt_txt,
                temp: forecast.main.temp,
                description: forecast.weather[0].description
            });
        }
    });

    return dailyForecasts.slice(0, 7); // Return only 7 days
}

function calculateUVIndex(temperature, weatherCondition) {
    // Simple UV index calculation based on temperature and weather condition
    let baseUV = Math.min(Math.round((temperature - 20) / 5), 10);
    if (baseUV < 0) baseUV = 0;

    // Adjust based on weather condition
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return baseUV;
        case 'clouds':
            return Math.max(0, baseUV - 2);
        case 'rain':
        case 'snow':
            return Math.max(0, baseUV - 3);
        default:
            return Math.max(0, baseUV - 1);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function showError(message) {
    const error = document.getElementById('error');
    error.innerHTML = `
        <span class="material-icons">error</span>
        <span>${message}</span>
    `;
    error.style.display = 'flex';
} 