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
    alert(`✅ Order Placed!\n\nTotal: $${total.toFixed(2)}\n\nThank you! 🍕🌿`);
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

// ========== MENU FILTER - UPDATED ==========
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
                if (show) card.style.animation = 'fadeIn 0.3s ease';
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
                if (show) card.style.animation = 'fadeIn 0.3s ease';
            });
        });
    });
});

// ========== COUNTER ANIMATION ==========
function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target')) || 0;
    const duration = 1800;
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
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelector('.franchise-stats');
    if (stats) counterObserver.observe(stats);
});

// ========== SCROLL ANIMATIONS - FIXED ✅ ==========
document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll(
        '.pizza-card, .why-card, .review-card, ' +
        '.branch-card, .offer-card, .fstat-card, ' +
        '.location-card, .store-slide-card, ' +
        '.upcoming-card, .journey-card, .story-block,' +
        '.founder-card, .story-stat, .cinfo-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ✅ No delay - immediately show
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        // ✅ trigger when even 1% visible
        threshold: 0.01,
        // ✅ trigger 50px before element enters viewport
        rootMargin: '0px 0px -10px 0px'
    });

    targets.forEach((el, i) => {
        // ✅ Check if already visible (above fold)
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            // Already visible - show immediately
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
            return;
        }

        el.style.opacity   = '0';
        el.style.transform = 'translateY(20px)';

        // ✅ Max delay cap at 0.12s
        const delay = Math.min(i * 0.02, 0.12);
        el.style.transition = `opacity 0.3s ease ${delay}s,
                               transform 0.3s ease ${delay}s`;
        observer.observe(el);
    });
});

// ========== ANIMATIONS CSS ==========
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to   { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(15px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(animStyle);

// ============================================
// UPCOMING STORES SLIDER
// ============================================
let upcomingIndex    = 0;
let upcomingInterval = null;
let upcomingTotalDots = 0;

function getVisibleCards() {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 992) return 2;
    return 4;
}

function initUpcomingSlider() {
    const track    = document.getElementById('upcomingSliderTrack');
    const sliderEl = document.querySelector('.upcoming-slider-window');
    if (!track || !sliderEl) return;

    const cards   = track.querySelectorAll('.store-slide-card');
    const visible = getVisibleCards();
    const gap     = 20;
    const windowW = sliderEl.offsetWidth;
    const cardW   = (windowW - (gap * (visible - 1))) / visible;

    cards.forEach(card => {
        card.style.flex     = `0 0 ${cardW}px`;
        card.style.minWidth = `${cardW}px`;
        card.style.maxWidth = `${cardW}px`;
    });

    const maxIndex = Math.max(cards.length - visible, 0);
    if (upcomingIndex > maxIndex) upcomingIndex = 0;

    const moveX = upcomingIndex * (cardW + gap);
    track.style.transform = `translateX(-${moveX}px)`;

    createUpcomingDots(maxIndex + 1);
    updateUpcomingDots();
}

function moveUpcomingSlide(dir) {
    const track = document.getElementById('upcomingSliderTrack');
    if (!track) return;

    const cards   = track.querySelectorAll('.store-slide-card');
    const visible = getVisibleCards();
    const max     = Math.max(cards.length - visible, 0);

    upcomingIndex += dir;
    if (upcomingIndex > max) upcomingIndex = 0;
    if (upcomingIndex < 0)   upcomingIndex = max;

    initUpcomingSlider();
}

function goToUpcomingSlide(index) {
    upcomingIndex = index;
    initUpcomingSlider();
}

function createUpcomingDots(total) {
    const dotsEl = document.getElementById('upcomingDots');
    if (!dotsEl) return;

    if (upcomingTotalDots === total &&
        dotsEl.querySelectorAll('.upcoming-dot').length === total) {
        return;
    }

    upcomingTotalDots = total;
    dotsEl.innerHTML  = '';

    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'upcoming-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToUpcomingSlide(i));
        dotsEl.appendChild(dot);
    }
}

function updateUpcomingDots() {
    const dotsEl = document.getElementById('upcomingDots');
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.upcoming-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === upcomingIndex);
    });
}

function startUpcomingAuto() {
    clearInterval(upcomingInterval);
    upcomingInterval = setInterval(() => moveUpcomingSlide(1), 3000);
}

function stopUpcomingAuto() {
    clearInterval(upcomingInterval);
}

function initUpcomingSwipe() {
    const slider = document.querySelector('.upcoming-slider-window');
    if (!slider) return;

    let startX     = 0;
    let isDragging = false;

    slider.addEventListener('touchstart', (e) => {
        startX     = e.touches[0].clientX;
        isDragging = true;
        stopUpcomingAuto();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? moveUpcomingSlide(1) : moveUpcomingSlide(-1);
        }
        isDragging = false;
        startUpcomingAuto();
    }, { passive: true });
}

// ============================================
// NOTIFY POPUP
// ============================================
function notifyMe(city) {
    const popup    = document.getElementById('notifyPopup');
    const backdrop = document.getElementById('notifyBackdrop');
    const cityText = document.getElementById('notifyCity');
    if (!popup || !backdrop) return;

    if (cityText) {
        cityText.textContent =
            `We'll notify you when Martinoz Pizza opens in ${city}!`;
    }

    popup.style.display    = 'block';
    backdrop.style.display = 'block';
    setTimeout(() => popup.classList.add('active'), 10);

    document.body.style.overflow = 'hidden';
    stopUpcomingAuto();
}

function closeNotifyPopup() {
    const popup    = document.getElementById('notifyPopup');
    const backdrop = document.getElementById('notifyBackdrop');
    if (!popup || !backdrop) return;

    popup.classList.remove('active');
    setTimeout(() => {
        popup.style.display    = 'none';
        backdrop.style.display = 'none';
        document.body.style.overflow = '';
    }, 350);

    startUpcomingAuto();
}

function submitNotify(e) {
    e.preventDefault();
    closeNotifyPopup();
    setTimeout(() => {
        showToast('🔔 You will be notified when we open!');
    }, 400);
}

// ============================================
// GLOBAL ESC KEY
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNotifyPopup();
});

// ============================================
// DOMContentLoaded - INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {

    // Upcoming Slider Init
    if (document.getElementById('upcomingSliderTrack')) {
        initUpcomingSlider();
        startUpcomingAuto();
        initUpcomingSwipe();

        const wrap = document.getElementById('upcomingSliderWrap');
        if (wrap) {
            wrap.addEventListener('mouseenter', stopUpcomingAuto);
            wrap.addEventListener('mouseleave', startUpcomingAuto);
        }
    }

    // Resize
    window.addEventListener('resize', () => {
        if (document.getElementById('upcomingSliderTrack')) {
            upcomingTotalDots = 0;
            initUpcomingSlider();
        }
    });
});