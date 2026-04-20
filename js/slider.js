// ============================================
// MARTINOZ PIZZA - Slider / Carousel System
// ============================================

class Slider {
    constructor(options = {}) {
        this.selector    = options.selector    || '.hero-slider';
        this.autoPlay    = options.autoPlay    !== false;
        this.interval    = options.interval    || 4500;
        this.pauseHover  = options.pauseHover  !== false;
        this.current     = 0;
        this.timer       = null;
        this.el          = document.querySelector(this.selector);
        if (!this.el) return;
        this.wrapper = this.el.querySelector('.slider-wrapper');
        this.slides  = this.el.querySelectorAll('.slide');
        this.total   = this.slides.length;
        if (this.total < 2) return;
        this.init();
    }

    init() {
        this.createControls();
        this.createDots();
        this.bindEvents();
        if (this.autoPlay) this.startAuto();
        this.goTo(0);
    }

    createControls() {
        const ctrl = document.createElement('div');
        ctrl.className = 'slider-controls';
        ctrl.innerHTML = `
            <button class="slider-btn prev" aria-label="Previous">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="slider-dots"></div>
            <button class="slider-btn next" aria-label="Next">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        this.el.appendChild(ctrl);
        ctrl.querySelector('.prev').addEventListener('click', () => this.prev());
        ctrl.querySelector('.next').addEventListener('click', () => this.next());
        this.dotsContainer = ctrl.querySelector('.slider-dots');
    }

    createDots() {
        this.dots = [];
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        }
    }

    bindEvents() {
        // Keyboard
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft')  this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch/Swipe
        let startX = 0;
        this.el.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.el.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.next() : this.prev();
            }
        }, { passive: true });

        // Pause on hover
        if (this.pauseHover) {
            this.el.addEventListener('mouseenter', () => this.stopAuto());
            this.el.addEventListener('mouseleave', () => {
                if (this.autoPlay) this.startAuto();
            });
        }
    }

    goTo(index) {
        this.current = (index + this.total) % this.total;
        this.wrapper.style.transform = `translateX(-${this.current * 100}%)`;
        this.dots.forEach((d, i) => {
            d.classList.toggle('active', i === this.current);
        });
    }

    next() { this.goTo(this.current + 1); }
    prev() { this.goTo(this.current - 1); }

    startAuto() {
        this.stopAuto();
        this.timer = setInterval(() => this.next(), this.interval);
    }

    stopAuto() {
        clearInterval(this.timer);
        this.timer = null;
    }
}

// ============================================
// PIZZA MENU SLIDER (Featured)
// ============================================
class PizzaSlider {
    constructor(selector = '.pizza-slider') {
        this.el = document.querySelector(selector);
        if (!this.el) return;
        this.items    = this.el.querySelectorAll('.pizza-slide-item');
        this.current  = 0;
        this.perView  = this.getPerView();
        this.max      = Math.max(0, this.items.length - this.perView);
        this.createControls();
        this.bindResize();
    }

    getPerView() {
        if (window.innerWidth <= 480)  return 1;
        if (window.innerWidth <= 768)  return 2;
        if (window.innerWidth <= 1024) return 3;
        return 3;
    }

    createControls() {
        const wrap = this.el.closest('.pizza-slider-wrap');
        if (!wrap) return;

        const prev = wrap.querySelector('.ps-prev');
        const next = wrap.querySelector('.ps-next');
        if (prev) prev.addEventListener('click', () => this.move(-1));
        if (next) next.addEventListener('click', () => this.move(1));
    }

    move(dir) {
        this.current = Math.max(0, Math.min(this.max, this.current + dir));
        const shift = (this.current / this.items.length) * 100;
        this.el.style.transform = `translateX(-${shift}%)`;
        this.el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    bindResize() {
        window.addEventListener('resize', () => {
            this.perView  = this.getPerView();
            this.max      = Math.max(0, this.items.length - this.perView);
            this.current  = Math.min(this.current, this.max);
            this.move(0);
        });
    }
}

// ============================================
// TESTIMONIAL SLIDER
// ============================================
class TestimonialSlider {
    constructor() {
        this.el = document.querySelector('.testimonial-slider');
        if (!this.el) return;
        this.slides  = this.el.querySelectorAll('.review-card');
        this.current = 0;
        this.total   = this.slides.length;
        this.autoPlay = true;
        this.timer   = null;
        this.init();
    }

    init() {
        this.slides.forEach((s, i) => {
            s.style.display = i === 0 ? 'block' : 'none';
        });
        this.createDots();
        this.startAuto();
    }

    createDots() {
        const container = document.querySelector('.testimonial-dots');
        if (!container) return;
        this.dots = [];
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.goTo(i));
            container.appendChild(dot);
            this.dots.push(dot);
        }
    }

    goTo(index) {
        this.slides[this.current].style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            this.slides[this.current].style.display = 'none';
            this.current = index;
            this.slides[this.current].style.display = 'block';
            this.slides[this.current].style.animation = 'fadeIn 0.4s ease forwards';
            if (this.dots.length) {
                this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
            }
        }, 300);
    }

    next() { this.goTo((this.current + 1) % this.total); }

    startAuto() {
        this.timer = setInterval(() => this.next(), 5000);
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const targets = document.querySelectorAll(
        '.pizza-card, .why-card, .review-card, .branch-card, ' +
        '.offer-card, .fstat-card, .location-card, .menu-item, ' +
        '.branch-card-full, .cinfo-card, .faq-item, .fcta-stat'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.fstat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.dataset.target) || 0;
            const duration = 2200;
            const step   = target / (duration / 16);
            let current  = 0;

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

            observer.unobserve(el);
        });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
}

// ============================================
// PARALLAX (subtle)
// ============================================
function initParallax() {
    const hero = document.querySelector('.hero, .branches-hero, .menu-hero, .contact-hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.25}px)`;
        }
    }, { passive: true });
}

// ============================================
// PAGE LOADER
// ============================================
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    window.addEventListener('load', () => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
    });
}

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Hero Slider
    new Slider({
        selector:  '.hero-slider',
        autoPlay:  true,
        interval:  5000,
        pauseHover: true,
    });

    // Testimonial Slider
    new TestimonialSlider();

    // Scroll Animations
    initScrollAnimations();

    // Counters
    initCounters();

    // Parallax
    initParallax();

    // Page Loader
    initPageLoader();
});

// Export
window.Slider             = Slider;
window.PizzaSlider        = PizzaSlider;
window.TestimonialSlider  = TestimonialSlider;