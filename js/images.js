// ========== LAZY IMAGE LOADING ==========
document.addEventListener('DOMContentLoaded', () => {

    // Add loading class to all images
    const allImages = document.querySelectorAll('img');

    allImages.forEach(img => {
        // Add shimmer while loading
        img.classList.add('loading');

        // When loaded
        img.addEventListener('load', function () {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });

        // On error - use fallback
        img.addEventListener('error', function () {
            this.classList.remove('loading');

            // Check what type of image failed
            if (this.classList.contains('pizza-img') || 
                this.closest('.pizza-img-wrap') ||
                this.closest('.item-img-wrap')) {
                // Pizza fallback
                this.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop';
            } else if (this.classList.contains('nav-logo') ||
                       this.classList.contains('footer-logo-img')) {
                // Logo fallback - hide img show text
                this.style.display = 'none';
                const fallback = this.parentElement
                                     .querySelector('.logo-fallback');
                if (fallback) fallback.style.display = 'flex';
            } else {
                // Generic fallback
                this.src = `https://via.placeholder.com/400x300/1A1A2E/E63946?text=Martinoz+Pizza`;
            }
        });

        // Force trigger for cached images
        if (img.complete) {
            img.classList.remove('loading');
            img.classList.add('loaded');
        }
    });

    // ===== INTERSECTION OBSERVER for lazy load =====
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// ========== LOGO SVG INLINE ==========
// This creates logo without needing image file
function createInlineLogo(container) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" 
         viewBox="0 0 300 80" 
         width="180" height="48">
        <circle cx="40" cy="40" r="35" fill="#E63946" opacity="0.15"/>
        <circle cx="40" cy="40" r="28" fill="#E63946"/>
        <line x1="40" y1="12" x2="40" y2="68" 
              stroke="#FFB703" stroke-width="2" opacity="0.8"/>
        <line x1="14" y1="30" x2="66" y2="50" 
              stroke="#FFB703" stroke-width="2" opacity="0.8"/>
        <line x1="14" y1="50" x2="66" y2="30" 
              stroke="#FFB703" stroke-width="2" opacity="0.8"/>
        <circle cx="33" cy="30" r="3" fill="#FFB703"/>
        <circle cx="48" cy="35" r="2.5" fill="#FFB703"/>
        <circle cx="36" cy="48" r="2.5" fill="#FFB703"/>
        <circle cx="50" cy="50" r="3" fill="#FFB703"/>
        <circle cx="28" cy="45" r="2" fill="#fff" opacity="0.5"/>
        <circle cx="52" cy="28" r="2" fill="#fff" opacity="0.5"/>
        <circle cx="40" cy="40" r="28" fill="none" 
                stroke="#FFB703" stroke-width="2.5"/>
        <text x="88" y="35" 
              font-family="Arial Black, sans-serif" 
              font-size="26" font-weight="900" 
              fill="#FFFFFF" letter-spacing="1">MARTINOZ</text>
        <text x="90" y="58" 
              font-family="Arial Black, sans-serif" 
              font-size="18" font-weight="900" 
              fill="#E63946" letter-spacing="6">PIZZA</text>
        <text x="90" y="72" 
              font-family="Arial, sans-serif" 
              font-size="9" fill="#FFB703" 
              letter-spacing="2">FRESHLY BAKED HAPPINESS</text>
    </svg>`;

    if (container) {
        container.innerHTML = svg;
    }
    return svg;
}

// Auto inject inline logo
document.addEventListener('DOMContentLoaded', () => {
    // Find all logo containers
    const logoContainers = document.querySelectorAll('.inline-logo');
    logoContainers.forEach(container => {
        createInlineLogo(container);
    });
});