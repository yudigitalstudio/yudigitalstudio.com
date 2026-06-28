document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       MOBILE MENU TOGGLE
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent body scroll when menu is open on mobile
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* ==========================================
       STICKY NAVBAR
       ========================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       ACTIVE LINK HIGHLIGHT ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset for sticky header
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    /* ==========================================
       FAQ ACCORDION
       ========================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isAlreadyActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(accordionItem => {
                accordionItem.classList.remove('active');
                const body = accordionItem.querySelector('.accordion-body');
                if (body) body.style.maxHeight = null;
            });
            
            // Open clicked item if it wasn't already active
            if (!isAlreadyActive) {
                item.classList.add('active');
                const body = item.querySelector('.accordion-body');
                if (body) {
                    body.style.maxHeight = body.scrollHeight + "px";
                }
            }
        });
    });

    /* ==========================================
       BOOKING FORM VALIDATION & SUBMISSION
       ========================================== */
    const bookingForm = document.getElementById('booking-form');
    const bookingMsg = document.getElementById('booking-msg');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button during loading
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing Booking...';
            
            // Clear message
            bookingMsg.className = 'form-message';
            bookingMsg.innerHTML = '';
            
            // Form inputs
            const fullName = document.getElementById('full-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const pickupDate = document.getElementById('pickup-date').value;
            const serviceType = document.getElementById('service-type').value;
            const address = document.getElementById('address').value.trim();

            // Client side validation
            if (!fullName || !email || !phone || !pickupDate || !serviceType || !address) {
                showBookingFeedback(false, 'Please fill in all fields correctly.');
                resetButton();
                return;
            }

            // Simulate Network Request (1.5 seconds delay)
            setTimeout(() => {
                // Success scenario
                showBookingFeedback(
                    true, 
                    `Thank you, <strong>${fullName}</strong>! Your laundry pickup has been scheduled for <strong>${formatDate(pickupDate)}</strong>. We will send a confirmation email to <strong>${email}</strong> shortly.`
                );
                bookingForm.reset();
                resetButton();
            }, 1500);

            function resetButton() {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showBookingFeedback(isSuccess, message) {
        bookingMsg.className = `form-message ${isSuccess ? 'success' : 'error'}`;
        bookingMsg.innerHTML = message;
        // Scroll to form message
        bookingMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ==========================================
       NEWSLETTER FORM VALIDATION & SUBMISSION
       ========================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMsg = document.getElementById('newsletter-msg');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const emailVal = emailInput.value.trim();
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            
            if (!emailVal) {
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Subscribing...';
            newsletterMsg.className = 'form-message';
            newsletterMsg.innerHTML = '';

            setTimeout(() => {
                newsletterMsg.className = 'form-message success';
                newsletterMsg.style.display = 'block';
                newsletterMsg.style.marginTop = '10px';
                newsletterMsg.innerHTML = 'Subscribed successfully! Welcome to the DirtyDry family.';
                emailInput.value = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Subscribe';

                // Fade out message after 4 seconds
                setTimeout(() => {
                    newsletterMsg.style.display = 'none';
                }, 4000);
            }, 1000);
        });
    }

    /* ==========================================
       HELPER FUNCTIONS
       ========================================== */
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
});

// CSS styles for booking button spinner
const style = document.createElement('style');
style.textContent = `
.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0,0,0,0.25);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
