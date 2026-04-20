// ============================================
// MARTINOZ PIZZA - Branches JS (Green Theme)
// ============================================

// ========== FILTER REGION ==========
function filterRegion(region, btn) {
    document.querySelectorAll('.region-tab')
            .forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const sections = document.querySelectorAll('.state-section');
    let count = 0;

    sections.forEach(section => {
        const sectionRegion = section.getAttribute('data-region');
        const show = region === 'all' || sectionRegion === region;

        section.style.display = show ? 'block' : 'none';
        if (show) {
            count += section.querySelectorAll('.branch-card-full').length;
            section.style.animation = 'fadeSlideUp 0.3s ease';
        }
    });

    const countEl = document.getElementById('resultCount');
    if (countEl) {
        const label = region === 'all' ? '65+' : count;
        countEl.innerHTML = `Showing <strong>${label}</strong> branches`;
    }
}

// ========== SEARCH ==========
function searchBranches() {
    const input = document.getElementById('branchSearch');
    if (!input) return;

    const query   = input.value.toLowerCase().trim();
    const cards   = document.querySelectorAll('.branch-card-full');
    const noResult = document.getElementById('noBranchResults');
    let visible   = 0;

    cards.forEach(card => {
        const name   = (card.getAttribute('data-name')   || '').toLowerCase();
        const city   = (card.getAttribute('data-city')   || '').toLowerCase();
        const region = (card.getAttribute('data-region') || '').toLowerCase();
        const addr   = card.querySelector('.bcf-address')
                          ?.textContent?.toLowerCase() || '';

        const match = !query ||
            name.includes(query)   ||
            city.includes(query)   ||
            region.includes(query) ||
            addr.includes(query);

        card.style.display = match ? 'block' : 'none';
        if (match) visible++;
    });

    // Show/hide sections
    document.querySelectorAll('.state-section').forEach(section => {
        const hasVisible = Array.from(
            section.querySelectorAll('.branch-card-full')
        ).some(c => c.style.display !== 'none');

        section.style.display = (!query || hasVisible) ? 'block' : 'none';
    });

    if (noResult) {
        noResult.style.display = (visible === 0 && query) ? 'flex' : 'none';
    }

    const countEl = document.getElementById('resultCount');
    if (countEl) {
        countEl.innerHTML = query
            ? `Found <strong>${visible}</strong> branches for "${query}"`
            : `Showing <strong>65+</strong> branches`;
    }
}

// ========== RESET SEARCH ==========
function resetSearch() {
    const input = document.getElementById('branchSearch');
    if (input) input.value = '';

    document.querySelectorAll('.state-section')
            .forEach(s => s.style.display = 'block');
    document.querySelectorAll('.branch-card-full')
            .forEach(c => c.style.display = 'block');

    const noResult = document.getElementById('noBranchResults');
    if (noResult) noResult.style.display = 'none';

    const countEl = document.getElementById('resultCount');
    if (countEl) {
        countEl.innerHTML = `Showing <strong>65+</strong> branches`;
    }
}

// ========== DETECT LOCATION ==========
function detectLocation() {
    const btn = document.querySelector('.detect-btn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
        btn.disabled  = true;
    }

    if (!navigator.geolocation) {
        showToast('❌ Geolocation not supported!');
        resetDetectBtn(btn);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        () => {
            showToast('✅ Location detected! Showing nearby branches.');
            resetDetectBtn(btn);
        },
        () => {
            showToast('❌ Could not detect location. Please search manually.');
            resetDetectBtn(btn);
        },
        { timeout: 8000 }
    );
}

function resetDetectBtn(btn) {
    if (!btn) return;
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-location-arrow"></i> Detect Location';
        btn.disabled  = false;
    }, 1500);
}

// ========== SWITCH VIEW ==========
function switchView(view) {
    const grids  = document.querySelectorAll('.branches-grid');
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');

    grids.forEach(grid => {
        grid.classList.toggle('list-view', view === 'list');
    });

    gridBtn?.classList.toggle('active', view === 'grid');
    listBtn?.classList.toggle('active', view === 'list');
}

// ========== YEAR FILTER (Growth Journey) ==========
function filterYear(year, btn) {
    document.querySelectorAll('.year-btn')
            .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('.journey-card');
    let count   = 0;

    cards.forEach(card => {
        const cardYear = card.getAttribute('data-year');
        const show     = year === 'all' || cardYear === year;

        card.style.display = show ? 'block' : 'none';
        if (show) {
            count++;
            card.style.animation = 'fadeIn 0.3s ease';
        }
    });

    const countEl = document.getElementById('storeCount');
    if (countEl) {
        countEl.innerHTML = year === 'all'
            ? `Showing <strong>65+</strong> stores`
            : `Showing <strong>${count}</strong> stores from ${year}`;
    }
}

// ========== SCROLL ANIMATIONS - FIXED ✅ ==========
document.addEventListener('DOMContentLoaded', () => {

    // ✅ Branch cards + story + journey cards
    const allCards = document.querySelectorAll(
        '.branch-card-full, .fcta-stat, .hbs-item, ' +
        '.journey-card, .story-block, .founder-card, ' +
        '.story-stat, .fcta-stat'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ✅ Immediately show - no staggered delay on trigger
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        // ✅ Trigger when 1% visible - very early
        threshold: 0.01,
        // ✅ Trigger 30px before element enters screen
        rootMargin: '0px 0px -10px 0px'
    });

    allCards.forEach((el, i) => {
        // ✅ If already in viewport (above fold) - show immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
            return;
        }

        el.style.opacity   = '0';
        el.style.transform = 'translateY(18px)';

        // ✅ Cap delay at 0.10s max
        const delay = Math.min(i * 0.02, 0.10);
        el.style.transition = `opacity 0.3s ease ${delay}s,
                               transform 0.3s ease ${delay}s`;
        observer.observe(el);
    });
});

// ========== ANIMATION CSS ==========
const branchStyle = document.createElement('style');
branchStyle.textContent = `

    /* ===== ANIMATIONS ===== */
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(15px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to   { opacity: 1; transform: scale(1); }
    }

    /* ===== LIST VIEW ===== */
    .branches-grid.list-view {
        grid-template-columns: 1fr !important;
    }

    .branches-grid.list-view .branch-card-full {
        display: grid;
        grid-template-columns: 1fr auto;
    }

    .branches-grid.list-view .bcf-top {
        grid-column: 1 / -1;
    }

    .branches-grid.list-view .bcf-details {
        grid-template-columns: repeat(4, 1fr);
    }

    .branches-grid.list-view .bcf-actions {
        grid-column: 1 / -1;
    }

    @media (max-width: 768px) {
        .branches-grid.list-view .branch-card-full {
            grid-template-columns: 1fr;
        }
        .branches-grid.list-view .bcf-details {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;
document.head.appendChild(branchStyle);