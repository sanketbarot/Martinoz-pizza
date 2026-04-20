// ============================================
// MARTINOZ PIZZA - Main JS (Green Theme)
// ============================================

// ========== CART SYSTEM ==========
let cart = [];
let cartOpen = false;

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

function updateCart() {
    const cartItems  = document.getElementById('cartItems');
    const cartCount  = document.getElementById('cartCount');
    const cartTotal  = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');
    if (!cartItems) return;

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    if (cartCount) cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🍕</span>
                <p>Your cart is empty</p>
                <small>Add some delicious pizzas!</small>
            </div>`;
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        if (cartFooter) cartFooter.style.display = 'block';
        cartItems.innerHTML = cart.map((item, i) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>$${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
                    <span style="font-weight:700; color:var(--text-main)">
                        ${item.qty}
                    </span>
                    <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
                </div>
            </div>`).join('');
        if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    cartOpen = !cartOpen;
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.toggle('active', cartOpen);
    if (overlay) overlay.classList.toggle('active', cartOpen);
}

function applyCoupon() {
    const code = document.getElementById('couponInput')?.value.toUpperCase();
    const coupons = { 'WELCOME20': 20, 'PIZZA50': 50, 'MARTINOZ10': 10 };
    if (coupons[code]) {
        showToast(`✅ ${coupons[code]}% OFF coupon applied!`);
        document.getElementById('couponInput').value = '';
    } else {
        showToast('❌ Invalid coupon code!');
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('❌ Your cart is empty!');
        return;
    }
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    alert(`✅ Order Placed!\n\nTotal: $${total.toFixed(2)}\n\nThank you for ordering from Martinoz Pizza! 🍕🌿`);
    cart = [];
    updateCart();
    toggleCart();
}

// ========== TOAST ==========
function showToast(message) {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

// ========== NAVBAR SCROLL ==========
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ========== HAMBURGER ==========
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });
});

// ========== MENU FILTER ==========
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn')
                    .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.pizza-card').forEach(card => {
                const show = filter === 'all' ||
                             card.dataset.category === filter;
                card.style.display = show ? 'block' : 'none';
                if (show) card.style.animation = 'fadeIn 0.4s ease';
            });
        });
    });
});

// ========== SIZE SELECTOR ==========
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.size-options').forEach(group => {
        group.querySelectorAll('.size').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.size')
                     .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });
});

// ========== NEWSLETTER ==========
function subscribeNewsletter(e) {
    e.preventDefault();
    showToast('✅ Subscribed! Check your email for 15% OFF!');
    e.target.reset();
}

// ========== LOCATION FILTER ==========
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.loc-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.loc-tab')
                    .forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selected = tab.dataset.loc;
            document.querySelectorAll('.location-card').forEach(card => {
                const show = selected === 'all' ||
                             card.dataset.location === selected;
                card.style.display = show ? 'flex' : 'none';
                if (show) card.style.animation = 'fadeIn 0.4s ease';
            });
        });
    });
});

// ========== COUNTER ANIMATION ==========
function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target')) || 0;
    const duration = 2200;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = target >= 1000
            ? Math.floor(current).toLocaleString()
            : Math.floor(current);
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.fstat-number')
                    .forEach(animateCounter);
        counterObserver.unobserve(entry.target);
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelector('.franchise-stats');
    if (stats) counterObserver.observe(stats);
});

// ========== SCROLL ANIMATIONS ==========
document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll(
        '.pizza-card, .why-card, .review-card, ' +
        '.branch-card, .offer-card, .fstat-card, ' +
        '.location-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity    = '1';
                entry.target.style.transform  = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    targets.forEach((el, i) => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(30px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.05}s,
                               transform 0.5s ease ${i * 0.05}s`;
        observer.observe(el);
    });
});

// ========== ANIMATIONS CSS ==========
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(animStyle);