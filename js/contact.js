// ========== FORM TAB SWITCHER ==========
function switchFormTab(type, btn) {
    // Update tab styles
    document.querySelectorAll('.ftab').forEach(t => {
        t.classList.remove('active');
    });
    btn.classList.add('active');

    // Set hidden form type
    document.getElementById('formType').value = type;

    // Show/hide special fields
    const orderField = document.querySelector('.order-field');
    const franchiseFields = document.querySelector('.franchise-fields');
    const feedbackField = document.querySelector('.feedback-field');

    // Hide all first
    orderField.style.display = 'none';
    franchiseFields.style.display = 'none';
    feedbackField.style.display = 'none';

    // Show relevant fields
    if (type === 'order') {
        orderField.style.display = 'flex';
    } else if (type === 'franchise') {
        franchiseFields.style.display = 'block';
    } else if (type === 'feedback') {
        feedbackField.style.display = 'flex';
    }

    // Update subject placeholder
    const subjectPlaceholders = {
        general: 'What is this about?',
        order: 'Issue with my order...',
        franchise: 'Franchise inquiry for...',
        feedback: 'My feedback about...'
    };
    document.getElementById('subject').placeholder =
        subjectPlaceholders[type];
}

// ========== STAR RATING ==========
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('mouseover', function () {
        const val = this.getAttribute('data-value');
        stars.forEach(s => {
            s.classList.toggle(
                'active',
                s.getAttribute('data-value') <= val
            );
        });
    });

    star.addEventListener('mouseout', function () {
        const selected = document.getElementById('ratingValue').value;
        stars.forEach(s => {
            s.classList.toggle(
                'active',
                s.getAttribute('data-value') <= selected
            );
        });
    });

    star.addEventListener('click', function () {
        const val = this.getAttribute('data-value');
        document.getElementById('ratingValue').value = val;
        stars.forEach(s => {
            s.classList.toggle(
                'active',
                s.getAttribute('data-value') <= val
            );
        });
    });
});

// ========== CHAR COUNT ==========
function countChars(el) {
    const count = el.value.length;
    document.getElementById('charCount').textContent = count;

    if (count > 500) {
        el.value = el.value.substring(0, 500);
        document.getElementById('charCount').textContent = 500;
    }

    if (count > 400) {
        document.getElementById('charCount').style.color = '#E63946';
    } else {
        document.getElementById('charCount').style.color = '';
    }
}

// ========== FILE UPLOAD ==========
function handleFile(input) {
    const file = input.files[0];
    const label = document.getElementById('fileLabel');
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
        if (file.size > maxSize) {
            showToast('❌ File size exceeds 5MB limit!');
            input.value = '';
            label.textContent = 'Click to upload or drag & drop';
            return;
        }
        label.textContent = `✅ ${file.name}`;
        label.style.color = '#2ECC71';
    }
}

// Drag & Drop Support
const fileUpload = document.querySelector('.file-upload');
if (fileUpload) {
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.style.borderColor = 'var(--primary)';
        fileUpload.style.background = 'rgba(230,57,70,0.08)';
    });

    fileUpload.addEventListener('dragleave', () => {
        fileUpload.style.borderColor = '';
        fileUpload.style.background = '';
    });

    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.style.borderColor = '';
        fileUpload.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file) {
            document.getElementById('attachment').files = e.dataTransfer.files;
            document.getElementById('fileLabel').textContent = `✅ ${file.name}`;
        }
    });
}

// ========== FORM VALIDATION ==========
function validateForm() {
    let valid = true;

    const fields = [
        {
            id: 'firstName',
            errId: 'firstNameErr',
            msg: 'First name is required'
        },
        {
            id: 'lastName',
            errId: 'lastNameErr',
            msg: 'Last name is required'
        },
        {
            id: 'email',
            errId: 'emailErr',
            msg: 'Valid email is required'
        },
        {
            id: 'phone',
            errId: 'phoneErr',
            msg: 'Phone number is required'
        },
        {
            id: 'message',
            errId: 'messageErr',
            msg: 'Message is required'
        }
    ];

    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const err = document.getElementById(f.errId);
        if (!el.value.trim()) {
            err.textContent = f.msg;
            el.classList.add('error');
            valid = false;
        } else {
            err.textContent = '';
            el.classList.remove('error');
        }
    });

    // Email format validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        document.getElementById('emailErr').textContent =
            'Please enter a valid email address';
        email.classList.add('error');
        valid = false;
    }

    // Phone validation
    const phone = document.getElementById('phone');
    const phoneRegex = /^[\d\s\+\-]{8,15}$/;
    if (phone.value && !phoneRegex.test(phone.value)) {
        document.getElementById('phoneErr').textContent =
            'Please enter a valid phone number';
        phone.classList.add('error');
        valid = false;
    }

    return valid;
}

// ========== SUBMIT FORM ==========
function submitForm(e) {
    e.preventDefault();

    if (!validateForm()) {
        showToast('❌ Please fill all required fields correctly!');
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate API call
    setTimeout(() => {
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        showToast('✅ Message sent successfully!');
    }, 2000);
}

// ========== RESET FORM ==========
function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactForm').style.display = 'flex';
    document.getElementById('formSuccess').style.display = 'none';

    const btn = document.getElementById('submitBtn');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

    document.getElementById('charCount').textContent = '0';
    document.getElementById('fileLabel').textContent =
        'Click to upload or drag & drop';
    document.getElementById('fileLabel').style.color = '';

    stars.forEach(s => s.classList.remove('active'));
    document.getElementById('ratingValue').value = '0';

    // Clear errors
    document.querySelectorAll('.error-msg').forEach(e => {
        e.textContent = '';
    });
    document.querySelectorAll('.error').forEach(e => {
        e.classList.remove('error');
    });
}

// ========== GOOGLE MAP BRANCHES ==========
const branchMaps = {
    ahmedabad: {
        src: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9!2d72.5!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1`,
        name: 'Martinoz Pizza - Ahmedabad HQ',
        address: 'SG Highway, Prahlad Nagar, Ahmedabad - 380015',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 79 2345 6789',
        mapsLink: 'https://maps.google.com/?q=SG+Highway+Ahmedabad'
    },
    surat: {
        src: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.9!2d72.8!3d21.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEyJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1`,
        name: 'Martinoz Pizza - Surat VR Mall',
        address: 'VR Mall, Dumas Road, Surat - 395007',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 261 345 6789',
        mapsLink: 'https://maps.google.com/?q=VR+Mall+Surat'
    },
    indore: {
        src: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.9!2d75.9!3d22.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQyJzAwLjAiTiA3NcKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1`,
        name: 'Martinoz Pizza - Indore Vijay Nagar',
        address: 'Scheme 54, Vijay Nagar, Indore - 452010',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 731 345 6789',
        mapsLink: 'https://maps.google.com/?q=Vijay+Nagar+Indore'
    },
    jaipur: {
        src: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.9!2d75.8!3d26.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzAwLjAiTiA3NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1`,
        name: 'Martinoz Pizza - Jaipur Malviya Nagar',
        address: 'Plot 8, Malviya Nagar, Tonk Road, Jaipur - 302017',
        hours: 'Mon - Sun: 10:00 AM - 11:00 PM',
        phone: '+91 141 345 6789',
        mapsLink: 'https://maps.google.com/?q=Malviya+Nagar+Jaipur'
    },
    auckland: {
        src: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.9!2d174.7!3d-36.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zLTM2wsDQ4JzAwLjAiUyAxNzTCsDQyJzAwLjAiRQ!5e0!3m2!1sen!2snz!4v1`,
        name: 'Martinoz Pizza - Auckland Queen Street',
        address: '145 Queen Street, Auckland CBD, Auckland 1010, NZ',
        hours: 'Mon - Sun: 10:00 AM - 10:00 PM',
        phone: '+64 9 123 4567',
        mapsLink: 'https://maps.google.com/?q=Queen+Street+Auckland'
    }
};

function changeBranch(select) {
    const branch = branchMaps[select.value];
    if (!branch) return;

    const mapLoading = document.getElementById('mapLoading');
    const googleMap = document.getElementById('googleMap');

    // Show loading
    mapLoading.style.display = 'flex';
    googleMap.style.opacity = '0';

    // Change map
    googleMap.src = branch.src;

    // Hide loading after load
    googleMap.onload = () => {
        mapLoading.style.display = 'none';
        googleMap.style.opacity = '1';
        googleMap.style.transition = 'opacity 0.3s ease';
    };

    // Update branch info
    document.getElementById('selectedBranchInfo').innerHTML = `
        <div class="sbi-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
                <strong>${branch.name}</strong>
                <span>${branch.address}</span>
            </div>
        </div>
        <div class="sbi-item">
            <i class="fas fa-clock"></i>
            <div>
                <strong>Opening Hours</strong>
                <span>${branch.hours}</span>
            </div>
        </div>
        <div class="sbi-item">
            <i class="fas fa-phone"></i>
            <div>
                <strong>Phone</strong>
                <span>${branch.phone}</span>
            </div>
        </div>
        <a href="${branch.mapsLink}" 
           target="_blank" 
           class="get-direction-btn">
            <i class="fas fa-directions"></i>
            Get Directions
        </a>
    `;
}

// Hide map loading on page load
window.addEventListener('load', () => {
    const googleMap = document.getElementById('googleMap');
    if (googleMap) {
        googleMap.onload = () => {
            const mapLoading = document.getElementById('mapLoading');
            if (mapLoading) mapLoading.style.display = 'none';
        };
    }
});

// ========== FAQ TOGGLE ==========
function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('open');
        q.nextElementSibling.style.maxHeight = '0';
    });

    // Open clicked
    if (!isOpen) {
        btn.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// ========== HAMBURGER ==========
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
}

// ========== INPUT REAL TIME VALIDATION ==========
document.querySelectorAll('.contact-form input, .contact-form textarea')
    .forEach(input => {
        input.addEventListener('blur', function () {
            if (!this.value.trim() && this.required) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });

        input.addEventListener('input', function () {
            if (this.value.trim()) {
                this.classList.remove('error');
                const errId = this.id + 'Err';
                const errEl = document.getElementById(errId);
                if (errEl) errEl.textContent = '';
            }
        });
    });