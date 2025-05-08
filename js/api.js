// API Configuration
const API_BASE_URL = 'https://api.agrinova.com'; // Replace with your actual API endpoint

// API Endpoints
const ENDPOINTS = {
    MARKET_PRICES: '/market-prices',
    PRICE_HISTORY: '/price-history'
};

// API Handler Class
class MarketPriceAPI {
    static async getCurrentPrices() {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.MARKET_PRICES}`);
            if (!response.ok) {
                throw new Error('Failed to fetch market prices');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching market prices:', error);
            // Return cached data if API fails
            return this.getCachedPrices();
        }
    }

    static async getPriceHistory(cropId, period) {
        try {
            const response = await fetch(
                `${API_BASE_URL}${ENDPOINTS.PRICE_HISTORY}?cropId=${cropId}&period=${period}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch price history');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching price history:', error);
            return null;
        }
    }

    static getCachedPrices() {
        // Return cached data from localStorage or default data
        const cachedData = localStorage.getItem('marketPrices');
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return marketPrices; // Fallback to static data
    }

    static cachePrices(prices) {
        localStorage.setItem('marketPrices', JSON.stringify(prices));
        localStorage.setItem('lastUpdate', new Date().toISOString());
    }
} 