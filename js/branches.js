// ============================================
// MARTINOZ PIZZA - Branches JS (Green Theme)
// ============================================

// ========== FILTER REGION ==========
function filterRegion(region, btn) {
    // Active tab
    document.querySelectorAll('.region-tab')
            .forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide state sections
    const sections = document.querySelectorAll('.state-section');
    let count = 0;

    sections.forEach(section => {
        const sectionRegion = section.getAttribute('data-region');
        if (region === 'all' || sectionRegion === region) {
            section.style.display = 'block';
            section.style.animation = 'fadeSlideUp 0.5s ease';
            count += section.querySelectorAll('.branch-card-full').length;
        } else {
            section.style.display = 'none';
        }
    });

    // Update count
    const countEl = document.getElementById('resultCount');
    if (countEl) {
        countEl.innerHTML = `Showing <strong>${count}</strong> branches`;
    }
}

// ========== SEARCH ==========
function searchBranches() {
    const input = document.getElementById('branchSearch');
    if (!input) return;

    const query = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.branch-card-full');
    const noResult = document.getElementById('noBranchResults');
    let visible = 0;

    cards.forEach(card => {
        const name   = card.getAttribute('data-name')?.toLowerCase() || '';
        const city   = card.getAttribute('data-city')?.toLowerCase() || '';
        const region = card.getAttribute('data-region')?.toLowerCase() || '';
        const addr   = card.querySelector('.bcf-address')?.textContent?.toLowerCase() || '';

        const match = !query ||
            name.includes(query) ||
            city.includes(query) ||
            region.includes(query) ||
            addr.includes(query);

        card.style.display = match ? 'block' : 'none';
        if (match) visible++;
    });

    // Show/hide sections based on visible cards
    document.querySelectorAll('.state-section').forEach(section => {
        const hasVisible = section.querySelectorAll(
            '.branch-card-full[style="display: block;"]'
        ).length > 0;
        section.style.display = (!query || hasVisible) ? 'block' : 'none';
    });

    // No results
    if (noResult) {
        noResult.style.display = (visible === 0 && query) ? 'flex' : 'none';
    }

    // Update count
    const countEl = document.getElementById('resultCount');
    if (countEl) {
        countEl.innerHTML = query
            ? `Found <strong>${visible}</strong> branches for "${query}"`
            : `Showing <strong>80+</strong> branches`;
    }
}

// ========== RESET SEARCH ==========
function resetSearch() {
    const input = document.getElementById('branchSearch');
    if (input) input.value = '';
    searchBranches();

    document.querySelectorAll('.state-section')
            .forEach(s => s.style.display = 'block');

    document.querySelectorAll('.branch-card-full')
            .forEach(c => c.style.display = 'block');

    const noResult = document.getElementById('noBranchResults');
    if (noResult) noResult.style.display = 'none';

    const countEl = document.getElementById('resultCount');
    if (countEl) {
        countEl.innerHTML = `Showing <strong>80+</strong> branches`;
    }
}

// ========== DETECT LOCATION ==========
function detectLocation() {
    const btn = document.querySelector('.detect-btn');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
        btn.disabled = true;
    }

    if (!navigator.geolocation) {
        showToast('❌ Geolocation not supported!');
        resetDetectBtn(btn);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            showToast('✅ Location detected! Showing nearby branches.');
            resetDetectBtn(btn);
        },
        (err) => {
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
        btn.disabled = false;
    }, 1500);
}

// ========== SWITCH VIEW ==========
function switchView(view) {
    const grids = document.querySelectorAll('.branches-grid');
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');

    grids.forEach(grid => {
        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    });

    if (gridBtn) gridBtn.classList.toggle('active', view === 'grid');
    if (listBtn) listBtn.classList.toggle('active', view === 'list');
}

// ========== SCROLL ANIMATIONS ==========
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll(
        '.branch-card-full, .fcta-stat, .hbs-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    cards.forEach((el, i) => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.04}s,
                               transform 0.5s ease ${i * 0.04}s`;
        observer.observe(el);
    });
});

// ========== ANIMATION CSS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    /* LIST VIEW */
    .branches-grid.list-view {
        grid-template-columns: 1fr !important;
    }

    .branches-grid.list-view .branch-card-full {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto auto;
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
document.head.appendChild(style);