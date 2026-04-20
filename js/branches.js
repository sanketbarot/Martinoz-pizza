// ========== SEARCH BRANCHES ==========
function searchBranches() {
    const query = document.getElementById('branchSearch')
                          .value.toLowerCase().trim();

    const cards = document.querySelectorAll('.branch-card-full');
    const sections = document.querySelectorAll('.state-section');
    const noResults = document.getElementById('noBranchResults');
    let found = 0;

    cards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const city = card.getAttribute('data-city').toLowerCase();
        const address = card.querySelector('.bcf-address').textContent.toLowerCase();

        if (
            name.includes(query) || 
            city.includes(query) || 
            address.includes(query) || 
            query === ''
        ) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease';
            found++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide sections based on visible cards
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll(
            '.branch-card-full:not([style*="display: none"])'
        );
        section.style.display = visibleCards.length > 0 ? '' : 'none';
    });

    // Update count
    document.getElementById('resultCount').innerHTML =
        `Showing <strong>${found}</strong> branch${found !== 1 ? 'es' : ''}`;

    noResults.style.display = found === 0 ? 'block' : 'none';
}

// ========== RESET SEARCH ==========
function resetSearch() {
    document.getElementById('branchSearch').value = '';
    searchBranches();
}

// ========== FILTER BY REGION ==========
function filterRegion(region, btn) {
    // Update tab styles
    document.querySelectorAll('.region-tab').forEach(t => {
        t.classList.remove('active');
    });
    btn.classList.add('active');

    const sections = document.querySelectorAll('.state-section');
    const cards = document.querySelectorAll('.branch-card-full');
    let found = 0;

    sections.forEach(section => {
        const sectionRegion = section.getAttribute('data-region');
        if (region === 'all' || sectionRegion === region) {
            section.style.display = '';
            section.style.animation = 'fadeIn 0.4s ease';
        } else {
            section.style.display = 'none';
        }
    });

    // Count visible cards
    cards.forEach(card => {
        const cardRegion = card.getAttribute('data-region');
        if (region === 'all' || cardRegion === region) {
            found++;
        }
    });

    document.getElementById('resultCount').innerHTML =
        `Showing <strong>${found}+</strong> branches`;
    document.getElementById('noBranchResults').style.display = 'none';
}

// ========== DETECT LOCATION ==========
function detectLocation() {
    const btn = document.querySelector('.detect-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
    btn.disabled = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                btn.innerHTML = '<i class="fas fa-check"></i> Location Found!';
                btn.style.background = '#2ECC71';

                // Show nearest branch toast
                showToast('📍 Nearest branch: Martinoz Pizza - SG Highway, Ahmedabad');

                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-location-arrow"></i> Detect Location';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            },
            (error) => {
                btn.innerHTML = '<i class="fas fa-times"></i> Permission Denied';
                btn.style.background = '#E63946';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-location-arrow"></i> Detect Location';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 2000);
                showToast('❌ Please allow location access');
            }
        );
    } else {
        showToast('❌ Geolocation not supported on this browser');
        btn.innerHTML = '<i class="fas fa-location-arrow"></i> Detect Location';
        btn.disabled = false;
    }
}

// ========== SWITCH VIEW ==========
function switchView(type) {
    const grid = document.querySelectorAll('.branches-grid');
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');

    if (type === 'list') {
        grid.forEach(g => g.classList.add('list-view'));
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    } else {
        grid.forEach(g => g.classList.remove('list-view'));
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    }
}

// ========== HAMBURGER ==========
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
}

// ========== SCROLL ANIMATIONS ==========
const branchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.05 });

document.querySelectorAll('.branch-card-full, .fcta-stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    branchObserver.observe(el);
});