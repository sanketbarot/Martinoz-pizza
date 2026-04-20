// ========== CART SYSTEM ==========
let cart = [];
let cartOpen = false;

// Add to Cart
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
    showToast(`🍕 ${name} added to cart!`);
    if (!cartOpen) toggleCart();
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🍕</span>
                <p>Your cart is empty</p>
                <small>Add some pizzas!</small>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartFooter.style.display = 'block';
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>$${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `).join('');
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Change Quantity
function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

// Toggle Cart
function toggleCart() {
    cartOpen = !cartOpen;
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('active', cartOpen);
    overlay.classList.toggle('active', cartOpen);
}

// Apply Coupon
function applyCoupon() {
    const code = document.getElementById('couponInput').value.toUpperCase();
    const coupons = {
        'WELCOME20': 20,
        'PIZZA50': 50,
        'MARTINOZ10': 10
    };

    if (coupons[code]) {
        showToast(`✅ Coupon applied! ${coupons[code]}% OFF`);
        document.getElementById('couponInput').value = '';
    } else {
        showToast('❌ Invalid coupon code!');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('❌ Your cart is empty!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    alert(`✅ Order Placed Successfully!\n\nTotal: $${total.toFixed(2)}\nThank you for ordering from Martinoz Pizza! 🍕`);
    cart = [];
    updateCart();
    toggleCart();
}

// ========== TOAST NOTIFICATION ==========
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 170px;
        right: 25px;
        background: var(--card-bg, #16213E);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 9999;
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ========== NAVBAR SCROLL ==========
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== HAMBURGER MENU ==========
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// ========== MENU FILTER ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.pizza-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.4s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ========== SIZE SELECTOR ==========
document.querySelectorAll('.size-options').forEach(group => {
    group.querySelectorAll('.size').forEach(btn => {
        btn.addEventListener('click', () => {
            group.querySelectorAll('.size').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});

// ========== POPUP ==========
function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
}

// Show popup after 3 seconds
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('popupOverlay').classList.add('active');
    }, 3000);
});

// ========== NEWSLETTER ==========
function subscribeNewsletter(e) {
    e.preventDefault();
    showToast('✅ Subscribed! Check your email for 15% OFF!');
    e.target.reset();
}

// ========== SCROLL ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.pizza-card, .why-card, .review-card, .branch-card, .offer-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Add animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);

// ========== FRANCHISE LOCATION FILTER ==========
document.querySelectorAll('.loc-tab').forEach(tab => {
    tab.addEventListener('click', () => {

        // Active tab style
        document.querySelectorAll('.loc-tab').forEach(t => {
            t.classList.remove('active');
        });
        tab.classList.add('active');

        const selected = tab.dataset.loc;

        // Filter cards
        document.querySelectorAll('.location-card').forEach(card => {
            if (selected === 'all' || card.dataset.location === selected) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.4s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ========== COUNTER ANIMATION ==========
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        // Format large numbers
        if (target >= 1000) {
            el.textContent = Math.floor(current).toLocaleString();
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter when visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.fstat-number');
            counters.forEach(counter => animateCounter(counter));
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.franchise-stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}