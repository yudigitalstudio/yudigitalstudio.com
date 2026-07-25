/* ==========================================================================
   DREAMSRENTAL INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initToast();
  initHeroSearch();
  initTabFilters();
  initStatsCounter();
  initRecommendedCarousel();
  initFaqAccordion();
  initBookingModal();
  initNewsletter();
});

let currentSearch = null;

function combineDateAndTime(dateValue, timeValue) {
  return `${dateValue}T${timeValue || '00:00'}`;
}

function getActiveCategory() {
  const activeTab = document.querySelector('.tab-btn.active');
  return activeTab ? activeTab.getAttribute('data-filter') : 'all';
}

function cardMatchesCurrentFilters(card) {
  const activeCategory = getActiveCategory();
  const cardCategory = card.getAttribute('data-category');
  const locations = (card.getAttribute('data-locations') || '')
    .split(',')
    .map(location => location.trim());

  const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
  const matchesLocation = !currentSearch || locations.includes(currentSearch.location);

  return matchesCategory && matchesLocation;
}

function applyCarFilters(animate = true) {
  const carCards = document.querySelectorAll('.cars-grid .car-card');
  const noResults = document.getElementById('no-results');
  let visibleCount = 0;

  carCards.forEach(card => {
    const shouldShow = cardMatchesCurrentFilters(card);
    if (shouldShow) visibleCount += 1;

    if (!animate) {
      card.style.display = shouldShow ? 'flex' : 'none';
      card.style.opacity = shouldShow ? '1' : '0';
      card.style.transform = shouldShow ? 'scale(1)' : 'scale(0.85)';
      return;
    }

    card.style.opacity = '0';
    card.style.transform = 'scale(0.85)';
    card.style.transition = 'all 0.3s ease';

    setTimeout(() => {
      card.style.display = shouldShow ? 'flex' : 'none';

      if (shouldShow) {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      }
    }, 300);
  });

  if (noResults) {
    noResults.hidden = visibleCount > 0;
  }

  return visibleCount;
}

function updateSearchSummary(visibleCount) {
  const summary = document.getElementById('search-result-summary');
  const summaryText = document.getElementById('search-result-text');

  if (!summary || !summaryText) return;

  if (!currentSearch) {
    summary.hidden = true;
    summaryText.textContent = '';
    return;
  }

  summary.hidden = false;
  summaryText.textContent =
    `${visibleCount} mobil tersedia di ${currentSearch.location} untuk ${currentSearch.pickupDate} sampai ${currentSearch.returnDate}.`;
}

/* ==========================================
   TOAST NOTIFICATION SYSTEM
   ========================================== */
function initToast() {
  window.showToast = function(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on toast type
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger transition Reflow
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Remove toast after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      // Wait for transition before deleting
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  };
}

/* ==========================================
   NAVBAR & SCROLL EFFECTS
   ========================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        
        // Active states
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Close menu when clicking outside of menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }
}

/* ==========================================
   HERO SEARCH PANEL
   ========================================== */
function initHeroSearch() {
  const searchForm = document.getElementById('search-form');
  if (!searchForm) return;

  // Set default pickup/return dates to tomorrow and day after tomorrow
  const pickupLocationInput = document.getElementById('pickup-loc');
  const pickupDateInput = document.getElementById('pickup-date');
  const returnDateInput = document.getElementById('return-date');
  const pickupTimeInput = document.getElementById('pickup-time');
  const returnTimeInput = document.getElementById('return-time');
  const resetFilterBtn = document.getElementById('reset-search-filter');
  
  if (pickupDateInput && returnDateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    pickupDateInput.min = today.toISOString().split('T')[0];
    pickupDateInput.value = tomorrow.toISOString().split('T')[0];
    
    returnDateInput.min = tomorrow.toISOString().split('T')[0];
    returnDateInput.value = dayAfter.toISOString().split('T')[0];

    // Keep return date ahead of pickup date
    pickupDateInput.addEventListener('change', () => {
      const selectedPickup = new Date(pickupDateInput.value);
      const minReturn = new Date(selectedPickup);
      minReturn.setDate(minReturn.getDate() + 1);
      returnDateInput.min = minReturn.toISOString().split('T')[0];
      
      if (new Date(returnDateInput.value) <= selectedPickup) {
        returnDateInput.value = minReturn.toISOString().split('T')[0];
      }
    });
  }

  // Handle Search Submission
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = pickupLocationInput.value;
    const pDate = pickupDateInput.value;
    const rDate = returnDateInput.value;
    const pTime = pickupTimeInput.value;
    const rTime = returnTimeInput.value;
    const pickupDateTime = new Date(combineDateAndTime(pDate, pTime));
    const returnDateTime = new Date(combineDateAndTime(rDate, rTime));

    if (returnDateTime <= pickupDateTime) {
      showToast('error', 'Tanggal dan jam kembali harus setelah waktu jemput.');
      return;
    }

    currentSearch = {
      location,
      pickupDate: pDate,
      returnDate: rDate,
      pickupTime: pTime,
      returnTime: rTime,
      pickupDateTimeValue: combineDateAndTime(pDate, pTime),
      returnDateTimeValue: combineDateAndTime(rDate, rTime),
    };

    const visibleCount = applyCarFilters(true);
    updateSearchSummary(visibleCount);
    showToast('success', `${visibleCount} mobil ditemukan di ${location}.`);
    
    setTimeout(() => {
      const targetSection = document.getElementById('popular-cars');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  });

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      currentSearch = null;
      if (pickupLocationInput) pickupLocationInput.value = '';
      updateSearchSummary(0);
      applyCarFilters(true);
      showToast('info', 'Filter pencarian sudah direset.');
    });
  }
}

/* ==========================================
   EXPLORE CARS - TABS FILTERING
   ========================================== */
function initTabFilters() {
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on tab buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const visibleCount = applyCarFilters(true);
      updateSearchSummary(visibleCount);
    });
  });
}

/* ==========================================
   STAT COUNTER ANIMATION
   ========================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  const statsSection = document.getElementById('stats');
  if (!statsSection || counters.length === 0) return;

  let animated = false;

  const runCounter = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 2000; // 2 seconds duration
      const increment = target / (duration / 16); // ~60fps refresh rate

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.floor(count).toLocaleString() + '+';
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target.toLocaleString() + '+';
        }
      };
      
      updateCount();
    });
  };

  // Trigger counter when entering viewport using Intersection Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          runCounter();
          animated = true;
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  } else {
    // Fallback: Run immediately if observer is not supported
    runCounter();
  }
}

/* ==========================================
   RECOMMENDED CARS CAROUSEL
   ========================================== */
function initRecommendedCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track || !prevBtn || !nextBtn) return;

  let scrollPosition = 0;
  
  // Calculate item width including gap
  const getCardWidth = () => {
    const firstCard = track.querySelector('.car-card');
    if (!firstCard) return 0;
    const style = window.getComputedStyle(firstCard);
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    return cardWidth + gap;
  };

  // Next button click
  nextBtn.addEventListener('click', () => {
    const cardWidth = getCardWidth();
    const maxScroll = track.scrollWidth - track.getBoundingClientRect().width;
    
    scrollPosition += cardWidth;
    if (scrollPosition > maxScroll) {
      scrollPosition = 0; // Loop back to start
    }
    track.style.transform = `translateX(-${scrollPosition}px)`;
  });

  // Prev button click
  prevBtn.addEventListener('click', () => {
    const cardWidth = getCardWidth();
    const maxScroll = track.scrollWidth - track.getBoundingClientRect().width;
    
    scrollPosition -= cardWidth;
    if (scrollPosition < 0) {
      scrollPosition = Math.ceil(maxScroll / cardWidth) * cardWidth; // Loop to end
    }
    track.style.transform = `translateX(-${scrollPosition}px)`;
  });

  // Recalculate position on resize
  window.addEventListener('resize', () => {
    scrollPosition = 0;
    track.style.transform = 'translateX(0)';
  });
}

/* ==========================================
   FAQ ACCORDION
   ========================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================
   BOOKING MODAL WINDOW
   ========================================== */
function initBookingModal() {
  const overlay = document.getElementById('booking-modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('btn-cancel-booking');
  const bookingForm = document.getElementById('booking-form');

  if (!overlay) return;

  // Open booking modal globally
  window.openBookingModal = function(carName, price, imagePath) {
    const previewImg = document.getElementById('modal-preview-img');
    const previewTitle = document.getElementById('modal-preview-title');
    const previewPrice = document.getElementById('modal-preview-price');
    const bookLocation = document.getElementById('book-loc');
    const bookStart = document.getElementById('book-start');
    const bookEnd = document.getElementById('book-end');

    if (previewImg) previewImg.src = imagePath;
    if (previewTitle) previewTitle.innerText = carName;
    if (previewPrice) previewPrice.innerText = `$${price} / hari`;

    // Preset booking dates in modal
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(10, 0, 0, 0);

    // Format to local ISO datetime string format (YYYY-MM-DDThh:mm)
    const formatDateTimeLocal = (date) => {
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date - tzOffset)).toISOString().slice(0, 16);
      return localISOTime;
    };

    if (bookStart) bookStart.value = formatDateTimeLocal(tomorrow);
    if (bookEnd) bookEnd.value = formatDateTimeLocal(dayAfter);

    if (currentSearch) {
      if (bookLocation) bookLocation.value = currentSearch.location;
      if (bookStart) bookStart.value = currentSearch.pickupDateTimeValue;
      if (bookEnd) bookEnd.value = currentSearch.returnDateTimeValue;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Disable background scrolling
  };

  // Close modal function
  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = ''; // Enable background scrolling
    if (bookingForm) bookingForm.reset();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Handle booking form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const carName = document.getElementById('modal-preview-title').innerText;
      const name = document.getElementById('book-name').value;
      const email = document.getElementById('book-email').value;
      const startDateTime = document.getElementById('book-start').value;
      const driver = document.getElementById('book-driver').value;

      closeModal();
      
      const driverText = driver === 'yes' ? 'dengan sopir' : 'lepas kunci';
      showToast('success', `Terima kasih ${name}! Pesanan ${carName} (${driverText}) pada ${startDateTime.replace('T', ' ')} sudah dikonfirmasi. Invoice kami kirim ke ${email}.`);
    });
  }
}

/* ==========================================
   NEWSLETTER SUBSCRIPTION
   ========================================== */
function initNewsletter() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    if (!emailInput) return;
    
    const email = emailInput.value;
    showToast('success', `Berhasil! ${email} sudah berlangganan newsletter DreamsRental.`);
    newsletterForm.reset();
  });
}
