// ============================================
// MARTINOZ PIZZA - Contact JS (Green Theme)
// ============================================

// ========== FORM TAB SWITCH ==========
function switchFormTab(type, btn) {
    document.querySelectorAll('.ftab')
            .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const formType = document.getElementById('formType');
    if (formType) formType.value = type;

    const orderField     = document.querySelector('.order-field');
    const franchiseField = document.querySelector('.franchise-fields');
    const feedbackField  = document.querySelector('.feedback-field');

    if (orderField)     orderField.style.display     = type === 'order'     ? 'block' : 'none';
    if (franchiseField) franchiseField.style.display = type === 'franchise' ? 'block' : 'none';
    if (feedbackField)  feedbackField.style.display  = type === 'feedback'  ? 'block' : 'none';
}

// ========== CHAR COUNT ==========
function countChars(el) {
    const max   = 500;
    const count = el.value.length;
    const el2   = document.getElementById('charCount');
    if (!el2) return;

    el2.textContent = count;

    if (count > max) {
        el.value        = el.value.substring(0, max);
        el2.textContent = max;
        el2.style.color = '#C62828';
    } else if (count > max * 0.8) {
        el2.style.color = '#F57F17';
    } else {
        el2.style.color = '#5A7A5A';
    }
}

// ========== FILE HANDLER ==========
function handleFile(input) {
    const file  = input.files[0];
    const label = document.getElementById('fileLabel');
    if (!file || !label) return;

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
        showToast('❌ File too large! Max 5MB allowed.');
        input.value       = '';
        label.textContent = 'Click to upload or drag & drop';
        return;
    }

    label.textContent = `✅ ${file.name}`;
    label.style.color = '#1B5E20';
    showToast(`✅ File "${file.name}" selected!`);
}

// ========== STAR RATING ==========
document.addEventListener('DOMContentLoaded', () => {
    const stars       = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('ratingValue');
    if (!stars.length) return;

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.getAttribute('data-value'));
            stars.forEach((s, i) => {
                s.style.color     = i < val ? '#F9A825' : '#D0D0D0';
                s.style.transform = i < val ? 'scale(1.2)' : 'scale(1)';
            });
        });

        star.addEventListener('mouseleave', () => {
            const current = parseInt(ratingInput?.value || '0');
            stars.forEach((s, i) => {
                s.style.color     = i < current ? '#F9A825' : '#D0D0D0';
                s.style.transform = 'scale(1)';
            });
        });

        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            if (ratingInput) ratingInput.value = val;
            stars.forEach((s, i) => {
                s.style.color = i < val ? '#F9A825' : '#D0D0D0';
            });
            showToast(`⭐ You rated us ${val} star${val > 1 ? 's' : ''}!`);
        });
    });
});

// ========== FORM SUBMIT ==========
function submitForm(e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    if (btn) {
        btn.disabled  = true;
        btn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Sending...
        `;
    }

    setTimeout(() => {
        const form    = document.getElementById('contactForm');
        const success = document.getElementById('formSuccess');
        if (form)    form.style.display    = 'none';
        if (success) success.style.display = 'block';
        showToast('✅ Message sent successfully!');
    }, 2000);
}

// ========== RESET FORM ==========
function resetForm() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const btn     = document.getElementById('submitBtn');

    if (form) {
        form.reset();
        form.style.display = 'block';
    }
    if (success) success.style.display = 'none';
    if (btn) {
        btn.disabled  = false;
        btn.innerHTML = `
            <i class="fas fa-paper-plane"></i>
            Send Message
        `;
    }

    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = '0';

    const stars = document.querySelectorAll('.star');
    stars.forEach(s => {
        s.style.color     = '#D0D0D0';
        s.style.transform = 'scale(1)';
    });

    const ratingInput = document.getElementById('ratingValue');
    if (ratingInput) ratingInput.value = '0';

    const fileLabel = document.getElementById('fileLabel');
    if (fileLabel) {
        fileLabel.textContent = 'Click to upload or drag & drop';
        fileLabel.style.color = '';
    }

    const firstTab = document.querySelector('.ftab');
    document.querySelectorAll('.ftab')
            .forEach((b, i) => b.classList.toggle('active', i === 0));
    if (firstTab) switchFormTab('general', firstTab);
}

// ========== MAP BRANCH CHANGE ==========
const branchData = {
    ahmedabad: {
        src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9!2d72.5!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890',
        name:  'Martinoz Pizza - Ahmedabad HQ',
        addr:  'SG Highway, Prahlad Nagar, Ahmedabad - 380015',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 79 2345 6789',
        link:  'https://maps.google.com/?q=SG+Highway+Ahmedabad'
    },
    surat: {
        src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720!2d72.8!3d21.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEyJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567891',
        name:  'Martinoz Pizza - Surat Branch',
        addr:  'VR Mall, Dumas Road, Surat - 395007',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 261 345 6789',
        link:  'https://maps.google.com/?q=VR+Mall+Surat'
    },
    indore: {
        src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679!2d75.8!3d22.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQyJzAwLjAiTiA3NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567892',
        name:  'Martinoz Pizza - Indore Branch',
        addr:  'Vijay Nagar, AB Road, Indore - 452010',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 731 345 6789',
        link:  'https://maps.google.com/?q=Vijay+Nagar+Indore'
    },
    jaipur: {
        src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558!2d75.8!3d26.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzAwLjAiTiA3NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567893',
        name:  'Martinoz Pizza - Jaipur Branch',
        addr:  'Malviya Nagar, Tonk Road, Jaipur - 302017',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 141 345 6789',
        link:  'https://maps.google.com/?q=Malviya+Nagar+Jaipur'
    },
    auckland: {
        src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193!2d174.7!3d-36.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zLTM2wqA0OCcwMC4wIlMgMTc0wrA0MicwMC4wIkU!5e0!3m2!1sen!2snz!4v1234567894',
        name:  'Martinoz Pizza - Auckland Branch',
        addr:  '145 Queen Street, Auckland CBD, Auckland 1010',
        hours: 'Mon - Sun: 10:00 AM - 10:00 PM',
        phone: '+64 9 123 4567',
        link:  'https://maps.google.com/?q=Queen+Street+Auckland'
    }
};

function changeBranch(select) {
    const key  = select.value;
    const data = branchData[key];
    if (!data) return;

    const map    = document.getElementById('googleMap');
    const loader = document.getElementById('mapLoading');
    const info   = document.getElementById('selectedBranchInfo');

    if (loader) loader.style.display = 'flex';

    if (map) {
        map.src    = data.src;
        map.onload = () => {
            if (loader) loader.style.display = 'none';
        };
    }

    if (info) {
        info.innerHTML = `
            <div class="sbi-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>${data.name}</strong>
                    <span>${data.addr}</span>
                </div>
            </div>
            <div class="sbi-item">
                <i class="fas fa-clock"></i>
                <div>
                    <strong>Opening Hours</strong>
                    <span>${data.hours}</span>
                </div>
            </div>
            <div class="sbi-item">
                <i class="fas fa-phone"></i>
                <div>
                    <strong>Phone</strong>
                    <span>${data.phone}</span>
                </div>
            </div>
            <a href="${data.link}"
               target="_blank"
               class="get-direction-btn">
                <i class="fas fa-directions"></i>
                Get Directions
            </a>
        `;
    }
}

// ========== FAQ TOGGLE ==========
function toggleFaq(btn) {
    const item   = btn.closest('.faq-item');
    const answer = item?.querySelector('.faq-answer');
    const icon   = btn.querySelector('i');
    const isOpen = item?.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
            openItem.classList.remove('open');
            const a = openItem.querySelector('.faq-answer');
            const i = openItem.querySelector('.faq-question i');
            if (a) a.style.maxHeight = '0';
            if (i) i.style.transform = 'rotate(0deg)';
        }
    });

    if (isOpen) {
        item.classList.remove('open');
        if (answer) answer.style.maxHeight = '0';
        if (icon)   icon.style.transform   = 'rotate(0deg)';
    } else {
        item?.classList.add('open');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon)   icon.style.transform   = 'rotate(180deg)';
    }
}

// ========== SCROLL ANIMATIONS - FIXED ✅ ==========
document.addEventListener('DOMContentLoaded', () => {

    const targets = document.querySelectorAll(
        '.cinfo-card, .faq-item, .social-card, ' +
        '.working-hours, .map-wrap, .contact-form-wrap'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ✅ Immediately show
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        // ✅ Trigger at 1% visibility
        threshold: 0.01,
        // ✅ Trigger early - before fully in view
        rootMargin: '0px 0px -10px 0px'
    });

    targets.forEach((el, i) => {
        // ✅ Already visible - show immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
            return;
        }

        el.style.opacity   = '0';
        el.style.transform = 'translateY(18px)';

        // ✅ Cap max delay at 0.10s
        const delay = Math.min(i * 0.04, 0.10);
        el.style.transition =
            `opacity 0.3s ease ${delay}s,
             transform 0.3s ease ${delay}s`;

        observer.observe(el);
    });

    // ✅ Init FAQ - max-height 0 by default
    document.querySelectorAll('.faq-answer').forEach(a => {
        a.style.maxHeight  = '0';
        a.style.overflow   = 'hidden';
        a.style.transition = 'max-height 0.35s ease';
    });
});