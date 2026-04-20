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

// ========== images/temp-images.js ==========
// Reference file - All temporary images for Martinoz Pizza

const IMAGES = {

    // LOGO
    logo: 'images/logo.svg',
    
    // HERO
    hero: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop',
    heroBg: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1920&h=1080&fit=crop',
    
    // VEG PIZZAS
    margherita: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop',
    gardenFresh: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
    paneerTikka: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop',
    doubleCheese: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    
    // NON-VEG PIZZAS
    bbqChicken: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    pepperoni: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&h=300&fit=crop',
    chickenTikka: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    martinozSpecial: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    
    // CHEESE BURST
    cheeseBurst: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop',
    chickenCheeseBurst: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    
    // SIDES
    garlicBread: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop',
    chickenWings: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop',
    loadedFries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    
    // DESSERTS
    chocoLava: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    tiramisu: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    iceCream: 'https://images.unsplash.com/photo-1567206563114-c179706e8442?w=400&h=300&fit=crop',

};

// ============================================
// MARTINOZ PIZZA - Universal Components Loader
// ============================================

// Active nav link set karva mate
function setActiveNav() {
    const currentPage = window.location.pathname
        .split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Navbar load karva mate
function loadNavbar() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (!navPlaceholder) return;

    fetch('components/navbar.html')
        .then(res => {
            if (!res.ok) throw new Error('Navbar not found');
            return res.text();
        })
        .then(html => {
            navPlaceholder.innerHTML = html;
            setActiveNav();
            initHamburger();
            initNavbarScroll();
        })
        .catch(err => {
            console.error('Navbar load error:', err);
        });
}

// Footer load karva mate
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    fetch('components/footer.html')
        .then(res => {
            if (!res.ok) throw new Error('Footer not found');
            return res.text();
        })
        .then(html => {
            footerPlaceholder.innerHTML = html;
        })
        .catch(err => {
            console.error('Footer load error:', err);
        });
}

// Hamburger menu
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Nav link click par close
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Scroll par navbar style
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Page load thay tyare run karo
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
});