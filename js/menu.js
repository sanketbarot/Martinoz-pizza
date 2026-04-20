// ============================================
// MARTINOZ PIZZA - Menu JS (Green Theme)
// ============================================

// ========== SEARCH MENU ==========
function searchMenu() {
    const query      = document.getElementById('menuSearch')
                               ?.value.toLowerCase().trim() || '';
    const items      = document.querySelectorAll('.menu-item');
    const categories = document.querySelectorAll('.menu-category');
    const noResults  = document.getElementById('noResults');
    let found = 0;

    items.forEach(item => {
        const name = (item.getAttribute('data-name') || '').toLowerCase();
        const desc = item.querySelector('.item-details')
                        ?.textContent.toLowerCase() || '';

        const match = query === '' ||
                      name.includes(query) ||
                      desc.includes(query);

        item.style.display = match ? '' : 'none';
        if (match) {
            found++;
            item.style.animation = 'fadeIn 0.25s ease';
        }
    });

    // Show/hide categories based on visible items
    categories.forEach(cat => {
        const visible = Array.from(cat.querySelectorAll('.menu-item'))
                             .some(el => el.style.display !== 'none');
        cat.style.display = visible ? '' : 'none';
    });

    if (noResults) {
        noResults.style.display = found === 0 ? 'block' : 'none';
    }
}

// ========== CLEAR SEARCH ==========
function clearSearch() {
    const input = document.getElementById('menuSearch');
    if (input) input.value = '';

    document.querySelectorAll('.menu-item')
            .forEach(item => item.style.display = '');
    document.querySelectorAll('.menu-category')
            .forEach(cat => cat.style.display = '');

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = 'none';
}

// ========== QUICK FILTER ==========
function quickFilter(type, btn) {
    document.querySelectorAll('.qf-btn')
            .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items      = document.querySelectorAll('.menu-item');
    const categories = document.querySelectorAll('.menu-category');
    let found = 0;

    items.forEach(item => {
        const itemType = item.getAttribute('data-type') || '';
        const itemTags = item.getAttribute('data-tags') || '';
        let show = false;

        if      (type === 'all')                                        show = true;
        else if (type === 'veg'        && itemType === 'veg')           show = true;
        else if (type === 'nonveg'     && itemType === 'nonveg')        show = true;
        else if (type === 'bestseller' && itemTags.includes('bestseller')) show = true;
        else if (type === 'new'        && itemTags.includes('new'))     show = true;
        else if (type === 'offer'      && itemTags.includes('offer'))   show = true;

        item.style.display = show ? '' : 'none';
        if (show) {
            found++;
            item.style.animation = 'fadeIn 0.25s ease';
        }
    });

    // Show/hide categories
    categories.forEach(cat => {
        const visible = Array.from(cat.querySelectorAll('.menu-item'))
                             .some(el => el.style.display !== 'none');
        cat.style.display = visible ? '' : 'none';
    });

    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = found === 0 ? 'block' : 'none';
    }
}

// ========== SCROLL TO CATEGORY ==========
function scrollToCategory(id, btn) {
    document.querySelectorAll('.cat-btn')
            .forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (id === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const target = document.getElementById(id);
    if (target) {
        const offset = target.getBoundingClientRect().top +
                       window.pageYOffset - 90;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
}

// ========== SIZE SELECTOR ==========
function selectSize(btn, itemName) {
    const group = btn.closest('.size-btns');
    if (!group) return;

    group.querySelectorAll('.sz')
         .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const price   = parseFloat(btn.getAttribute('data-price')) || 0;
    const card    = btn.closest('.menu-item');
    const priceEl = card?.querySelector('.curr-price');
    const addBtn  = card?.querySelector('.add-btn');

    if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
    if (addBtn && itemName) {
        addBtn.onclick = () => addToCart(itemName, price);
    }
}

// ========== ACTIVE CATEGORY ON SCROLL ==========
window.addEventListener('scroll', () => {
    const categories = document.querySelectorAll('.menu-category');
    let current = '';

    categories.forEach(cat => {
        const top = cat.getBoundingClientRect().top;
        if (top <= 150) current = cat.getAttribute('id') || '';
    });

    if (!current) return;

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
        const name  = btn.querySelector('.cat-name')
                         ?.textContent.toLowerCase() || '';
        const catId = current.replace(/-/g, ' ');

        if (catId.includes(name.split(' ')[0]) ||
            name.includes(catId.split(' ')[0])) {
            btn.classList.add('active');
        }
    });
}, { passive: true });

// ========== SCROLL ANIMATIONS - FIXED ✅ ==========
document.addEventListener('DOMContentLoaded', () => {

    const items = document.querySelectorAll('.menu-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ✅ Immediately show - no stagger on trigger
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        // ✅ Trigger at 1% visibility - very early
        threshold: 0.01,
        // ✅ Trigger before element enters viewport
        rootMargin: '0px 0px -10px 0px'
    });

    items.forEach((el, i) => {
        // ✅ Already visible (above fold) - show immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
            return;
        }

        el.style.opacity   = '0';
        el.style.transform = 'translateY(16px)';

        // ✅ Max delay cap at 0.08s
        const delay = Math.min(i * 0.02, 0.08);
        el.style.transition =
            `opacity 0.25s ease ${delay}s,
             transform 0.25s ease ${delay}s`;

        observer.observe(el);
    });
});

// ========== ANIMATION CSS ==========
const menuStyle = document.createElement('style');
menuStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to   { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(menuStyle);