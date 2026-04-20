// ========== SEARCH MENU ==========
function searchMenu() {
    const query = document.getElementById('menuSearch')
                          .value.toLowerCase().trim();
    const items = document.querySelectorAll('.menu-item');
    const categories = document.querySelectorAll('.menu-category');
    const noResults = document.getElementById('noResults');
    let found = 0;

    items.forEach(item => {
        const name = item.getAttribute('data-name').toLowerCase();
        const details = item.querySelector('.item-details');
        const desc = details ? details.textContent.toLowerCase() : '';

        if (name.includes(query) || desc.includes(query) || query === '') {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.3s ease';
            found++;
        } else {
            item.style.display = 'none';
        }
    });

    // Show/hide categories based on visible items
    categories.forEach(cat => {
        const visibleItems = cat.querySelectorAll(
            '.menu-item:not([style*="display: none"])'
        );
        cat.style.display = visibleItems.length > 0 ? '' : 'none';
    });

    noResults.style.display = found === 0 ? 'block' : 'none';
}

// ========== CLEAR SEARCH ==========
function clearSearch() {
    document.getElementById('menuSearch').value = '';
    searchMenu();
    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.display = '';
    });
    document.querySelectorAll('.menu-category').forEach(cat => {
        cat.style.display = '';
    });
    document.getElementById('noResults').style.display = 'none';
}

// ========== QUICK FILTER ==========
function quickFilter(type, btn) {
    // Update button styles
    document.querySelectorAll('.qf-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');

    const items = document.querySelectorAll('.menu-item');
    const categories = document.querySelectorAll('.menu-category');
    let found = 0;

    items.forEach(item => {
        const itemType = item.getAttribute('data-type');
        const itemTags = item.getAttribute('data-tags') || '';

        let show = false;

        if (type === 'all') {
            show = true;
        } else if (type === 'veg' && itemType === 'veg') {
            show = true;
        } else if (type === 'nonveg' && itemType === 'nonveg') {
            show = true;
        } else if (type === 'bestseller' && itemTags.includes('bestseller')) {
            show = true;
        } else if (type === 'new' && itemTags.includes('new')) {
            show = true;
        } else if (type === 'offer' && itemTags.includes('offer')) {
            show = true;
        }

        item.style.display = show ? '' : 'none';
        if (show) found++;
    });

    // Show/hide categories
    categories.forEach(cat => {
        const visibleItems = cat.querySelectorAll(
            '.menu-item:not([style*="display: none"])'
        );
        cat.style.display = visibleItems.length > 0 ? '' : 'none';
    });

    const noResults = document.getElementById('noResults');
    noResults.style.display = found === 0 ? 'block' : 'none';
}

// ========== SCROLL TO CATEGORY ==========
function scrollToCategory(id, btn) {
    // Update sidebar buttons
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    // Update mobile bar buttons
    document.querySelectorAll('.mobile-cat-bar button').forEach(b => {
        b.classList.remove('active');
    });

    if (id === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========== SIZE SELECTOR ==========
function selectSize(btn, itemName) {
    const group = btn.closest('.size-btns');
    group.querySelectorAll('.sz').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update price display
    const price = btn.getAttribute('data-price');
    const card = btn.closest('.menu-item');
    const priceEl = card.querySelector('.curr-price');
    if (priceEl) priceEl.textContent = `$${parseFloat(price).toFixed(2)}`;

    // Update add button price
    const addBtn = card.querySelector('.add-btn');
    if (addBtn) {
        addBtn.onclick = () => addToCart(itemName, parseFloat(price));
    }
}

// ========== HIGHLIGHT ACTIVE CATEGORY ON SCROLL ==========
window.addEventListener('scroll', () => {
    const categories = document.querySelectorAll('.menu-category');
    const catBtns = document.querySelectorAll('.cat-btn');
    const mobileBtns = document.querySelectorAll('.mobile-cat-bar button');

    let current = '';

    categories.forEach(cat => {
        const top = cat.getBoundingClientRect().top;
        if (top <= 150) {
            current = cat.getAttribute('id');
        }
    });

    catBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(
            current.replace('-', ' ').toLowerCase()
        )) {
            btn.classList.add('active');
        }
    });
});

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
}