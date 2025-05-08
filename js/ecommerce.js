class AgriEcommerce {
    constructor() {
        this.cart = [];
        this.products = [];
        this.categories = [
            'Seeds',
            'Fertilizers',
            'Tools',
            'Crops',
            'Equipment'
        ];
        this.initialize();
    }

    async initialize() {
        // Load cart from localStorage
        this.loadCart();
        
        // Fetch products
        await this.fetchProducts();
        
        // Initialize UI
        this.initializeUI();
    }

    loadCart() {
        const savedCart = localStorage.getItem('agriCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCart() {
        localStorage.setItem('agriCart', JSON.stringify(this.cart));
    }

    async fetchProducts() {
        try {
            const response = await fetch('/api/products');
            this.products = await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            this.products = []; // Fallback to empty array
        }
    }

    initializeUI() {
        const container = document.createElement('div');
        container.id = 'agriEcommerce';
        container.innerHTML = `
            <div class="ecommerce-container">
                <div class="sidebar">
                    <h3>Categories</h3>
                    <div class="category-list">
                        ${this.categories.map(category => `
                            <button class="category-btn" data-category="${category}">
                                ${category}
                            </button>
                        `).join('')}
                    </div>
                    <div class="cart-summary">
                        <h3>Cart (${this.cart.length} items)</h3>
                        <div id="cartItems"></div>
                        <div class="cart-total">
                            Total: $<span id="cartTotal">0.00</span>
                        </div>
                        <button id="checkoutBtn" class="btn primary">Checkout</button>
                    </div>
                </div>
                <div class="main-content">
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="Search products...">
                        <button id="searchBtn" class="btn secondary">
                            <span class="material-icons">search</span>
                        </button>
                    </div>
                    <div id="productGrid" class="product-grid"></div>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Add event listeners
        this.addEventListeners();
        
        // Initial render
        this.renderProducts();
        this.updateCart();
    }

    addEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterByCategory(btn.dataset.category);
            });
        });

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => {
            const query = document.getElementById('searchInput').value;
            this.searchProducts(query);
        });

        // Checkout
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.initiateCheckout();
        });
    }

    renderProducts(products = this.products) {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                    <div class="product-meta">
                        <span class="seller">Seller: ${product.seller}</span>
                        <span class="rating">★ ${product.rating}</span>
                    </div>
                    <button class="btn primary add-to-cart" data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addToCart(btn.dataset.id);
            });
        });
    }

    filterByCategory(category) {
        const filtered = this.products.filter(product => product.category === category);
        this.renderProducts(filtered);
    }

    searchProducts(query) {
        const searchResults = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        this.renderProducts(searchResults);
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = this.cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCart();
    }

    updateCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);

        // Add remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeFromCart(btn.dataset.id);
            });
        });
    }

    async initiateCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: this.cart,
                    total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                })
            });

            if (response.ok) {
                const { orderId, paymentUrl } = await response.json();
                window.location.href = paymentUrl;
            } else {
                throw new Error('Checkout failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to initiate checkout. Please try again.');
        }
    }

    getPersonalizedRecommendations() {
        // Get user's crop data
        const userCrops = JSON.parse(localStorage.getItem('userCrops') || '[]');
        
        // Filter products based on user's crops
        return this.products.filter(product => {
            if (product.category === 'Fertilizers') {
                return userCrops.some(crop => product.suitableFor.includes(crop));
            }
            if (product.category === 'Tools') {
                return userCrops.some(crop => product.recommendedFor.includes(crop));
            }
            return true;
        });
    }
}

// Initialize e-commerce system
const agriEcommerce = new AgriEcommerce(); 