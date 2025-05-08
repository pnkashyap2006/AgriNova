// Market price data (fallback data)
const marketPrices = [
    // Grains
    {
        crop: 'Rice',
        variety: 'Basmati',
        price: 85.50,
        unit: 'kg',
        trend: 'up',
        change: 2.5
    },
    {
        crop: 'Wheat',
        variety: 'Sharbati',
        price: 45.75,
        unit: 'kg',
        trend: 'down',
        change: 1.2
    },
    {
        crop: 'Maize',
        variety: 'Hybrid',
        price: 1800,
        unit: 'quintal',
        trend: 'up',
        change: 1.5
    },
    {
        crop: 'Bajra',
        variety: 'Local',
        price: 2200,
        unit: 'quintal',
        trend: 'up',
        change: 2.8
    },
    {
        crop: 'Jowar',
        variety: 'Hybrid',
        price: 2800,
        unit: 'quintal',
        trend: 'neutral',
        change: 0.5
    },
    {
        crop: 'Ragi',
        variety: 'Local',
        price: 3200,
        unit: 'quintal',
        trend: 'up',
        change: 3.2
    },
    {
        crop: 'Barley',
        variety: 'Hulless',
        price: 1600,
        unit: 'quintal',
        trend: 'down',
        change: 1.0
    },

    // Cash Crops
    {
        crop: 'Cotton',
        variety: 'Medium Staple',
        price: 6500,
        unit: 'quintal',
        trend: 'up',
        change: 3.8
    },
    {
        crop: 'Sugarcane',
        variety: 'Early',
        price: 350,
        unit: 'quintal',
        trend: 'neutral',
        change: 0
    },
    {
        crop: 'Tobacco',
        variety: 'Virginia',
        price: 180,
        unit: 'kg',
        trend: 'down',
        change: 1.8
    },
    {
        crop: 'Jute',
        variety: 'White',
        price: 4200,
        unit: 'quintal',
        trend: 'up',
        change: 2.5
    },
    {
        crop: 'Coffee',
        variety: 'Arabica',
        price: 280,
        unit: 'kg',
        trend: 'up',
        change: 4.2
    },
    {
        crop: 'Tea',
        variety: 'Assam',
        price: 160,
        unit: 'kg',
        trend: 'neutral',
        change: 0.5
    },

    // Pulses
    {
        crop: 'Chana',
        variety: 'Desi',
        price: 5200,
        unit: 'quintal',
        trend: 'up',
        change: 2.2
    },
    {
        crop: 'Moong',
        variety: 'Green',
        price: 7500,
        unit: 'quintal',
        trend: 'up',
        change: 4.5
    },
    {
        crop: 'Urad',
        variety: 'Black',
        price: 6800,
        unit: 'quintal',
        trend: 'down',
        change: 1.5
    },
    {
        crop: 'Masoor',
        variety: 'Red',
        price: 5800,
        unit: 'quintal',
        trend: 'up',
        change: 2.8
    },
    {
        crop: 'Arhar',
        variety: 'Yellow',
        price: 7200,
        unit: 'quintal',
        trend: 'up',
        change: 3.5
    },

    // Vegetables
    {
        crop: 'Tomato',
        variety: 'Hybrid',
        price: 40,
        unit: 'kg',
        trend: 'up',
        change: 15.5
    },
    {
        crop: 'Potato',
        variety: 'Kufri',
        price: 25,
        unit: 'kg',
        trend: 'down',
        change: 8.2
    },
    {
        crop: 'Onion',
        variety: 'Red',
        price: 35,
        unit: 'kg',
        trend: 'up',
        change: 12.8
    },
    {
        crop: 'Capsicum',
        variety: 'Green',
        price: 60,
        unit: 'kg',
        trend: 'neutral',
        change: 0.3
    },
    {
        crop: 'Cauliflower',
        variety: 'Snowball',
        price: 45,
        unit: 'kg',
        trend: 'up',
        change: 5.5
    },
    {
        crop: 'Brinjal',
        variety: 'Purple',
        price: 30,
        unit: 'kg',
        trend: 'down',
        change: 2.5
    },
    {
        crop: 'Cabbage',
        variety: 'Green',
        price: 28,
        unit: 'kg',
        trend: 'neutral',
        change: 0.8
    },
    {
        crop: 'Carrot',
        variety: 'Orange',
        price: 35,
        unit: 'kg',
        trend: 'up',
        change: 3.2
    },
    {
        crop: 'Beetroot',
        variety: 'Red',
        price: 40,
        unit: 'kg',
        trend: 'up',
        change: 2.8
    },

    // Fruits
    {
        crop: 'Apple',
        variety: 'Shimla',
        price: 180,
        unit: 'kg',
        trend: 'up',
        change: 3.2
    },
    {
        crop: 'Banana',
        variety: 'Cavendish',
        price: 45,
        unit: 'kg',
        trend: 'down',
        change: 2.5
    },
    {
        crop: 'Mango',
        variety: 'Alphonso',
        price: 120,
        unit: 'kg',
        trend: 'up',
        change: 8.5
    },
    {
        crop: 'Orange',
        variety: 'Nagpur',
        price: 80,
        unit: 'kg',
        trend: 'neutral',
        change: 0.8
    },
    {
        crop: 'Grapes',
        variety: 'Thompson',
        price: 150,
        unit: 'kg',
        trend: 'up',
        change: 6.2
    },
    {
        crop: 'Pomegranate',
        variety: 'Bhagwa',
        price: 160,
        unit: 'kg',
        trend: 'up',
        change: 4.5
    },
    {
        crop: 'Guava',
        variety: 'Allahabad',
        price: 60,
        unit: 'kg',
        trend: 'down',
        change: 1.8
    },
    {
        crop: 'Papaya',
        variety: 'Red Lady',
        price: 40,
        unit: 'kg',
        trend: 'neutral',
        change: 0.5
    }
];

// Auto-refresh configuration
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
let refreshTimer = null;

// Function to render price table
function renderPriceTable(prices) {
    const tableBody = document.querySelector('.price-table tbody');
    tableBody.innerHTML = '';

    prices.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.crop}</td>
            <td>${item.variety}</td>
            <td>₹${item.price.toFixed(2)}/${item.unit}</td>
            <td class="trend-${item.trend}">
                ${item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                ${item.change}%
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update last refresh time
    updateLastRefreshTime();
}

// Function to update last refresh time
function updateLastRefreshTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const now = new Date();
        lastUpdate.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
}

// Function to fetch and update prices
async function updatePrices() {
    try {
        const prices = await MarketPriceAPI.getCurrentPrices();
        MarketPriceAPI.cachePrices(prices);
        renderPriceTable(prices);
    } catch (error) {
        console.error('Error updating prices:', error);
        // Use cached data if available
        const cachedPrices = MarketPriceAPI.getCachedPrices();
        renderPriceTable(cachedPrices);
    }
}

// Function to sort prices
function sortPrices(criteria) {
    const currentPrices = MarketPriceAPI.getCachedPrices();
    const sortedPrices = [...currentPrices].sort((a, b) => {
        if (criteria === 'price') {
            return b.price - a.price;
        } else if (criteria === 'trend') {
            return b.change - a.change;
        }
        return 0;
    });
    renderPriceTable(sortedPrices);
}

// Function to filter prices by trend
function filterPrices(trend) {
    const currentPrices = MarketPriceAPI.getCachedPrices();
    const filteredPrices = trend === 'all' 
        ? currentPrices 
        : currentPrices.filter(item => item.trend === trend);
    renderPriceTable(filteredPrices);
}

// Function to start auto-refresh
function startAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    refreshTimer = setInterval(updatePrices, REFRESH_INTERVAL);
}

// Function to stop auto-refresh
function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// Initialize price table and auto-refresh
document.addEventListener('DOMContentLoaded', async () => {
    // Initial load
    await updatePrices();
    startAutoRefresh();

    // Add event listeners for sorting and filtering
    document.getElementById('sortPrice').addEventListener('click', () => sortPrices('price'));
    document.getElementById('sortTrend').addEventListener('click', () => sortPrices('trend'));
    document.getElementById('filterAll').addEventListener('click', () => filterPrices('all'));
    document.getElementById('filterUp').addEventListener('click', () => filterPrices('up'));
    document.getElementById('filterDown').addEventListener('click', () => filterPrices('down'));

    // Initialize trend period selector
    const trendPeriod = document.getElementById('trendPeriod');
    if (trendPeriod) {
        trendPeriod.addEventListener('change', async (e) => {
            const period = e.target.value;
            // Fetch historical data for the selected period
            const historyData = await MarketPriceAPI.getPriceHistory('all', period);
            if (historyData) {
                // Update the table with historical data
                renderPriceTable(historyData);
            }
        });
    }

    // Add manual refresh button listener
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', async () => {
            refreshButton.disabled = true;
            await updatePrices();
            refreshButton.disabled = false;
        });
    }
}); 