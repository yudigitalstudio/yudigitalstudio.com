document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // STICKY HEADER & ACTIVE LINK HIGHLIGHTING
  // ==========================================================================
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Add scrolled class to header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight active link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking links
  document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });

  // ==========================================================================
  // HERO IMAGE DOTS SLIDER CAROUSEL (MOCK SLIDER EFFECT)
  // ==========================================================================
  const heroDots = document.querySelectorAll('.hero-dots .dot');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-desc');
  const heroImage = document.querySelector('.hero-image');

  const heroSlides = [
    {
      title: "TIME TO DISCOVER COFFEE HOUSE",
      desc: "Experience the aroma of premium handcrafted coffee beans sourced directly from sustainable organic farms. Roasted to perfection every single day.",
      image: "images/hero_coffee.png"
    },
    {
      title: "ARTISANAL ESPRESSO & ROASTS",
      desc: "Every batch is micro-roasted to unlock subtle floral, caramel, and chocolate notes unique to its origin. Freshness guaranteed in every cup.",
      image: "images/hero_coffee.png"
    },
    {
      title: "COZY SPACES & COLD EXTRACTIONS",
      desc: "Reserve a quiet corner for your morning routine or join us at the bar for a chilled, slow-steeped cold brew experience tailored to your palate.",
      image: "images/hero_coffee.png"
    }
  ];

  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      // Set active dot
      heroDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Add fade out animation class
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(15px)';
      heroDesc.style.opacity = '0';
      heroDesc.style.transform = 'translateY(15px)';
      heroImage.style.opacity = '0';
      heroImage.style.transform = 'scale(0.9) translateY(10px)';

      setTimeout(() => {
        // Change text and image
        heroTitle.textContent = heroSlides[index].title;
        heroDesc.textContent = heroSlides[index].desc;
        heroImage.src = heroSlides[index].image;

        // Animate back in
        heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
        
        heroDesc.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        heroDesc.style.opacity = '1';
        heroDesc.style.transform = 'translateY(0)';
        
        heroImage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'scale(1) translateY(0)';
      }, 300);
    });
  });

  // ==========================================================================
  // LEAFLET MAP INITIALIZATION
  // ==========================================================================
  const mapElement = document.getElementById('reservationMap');
  if (mapElement && typeof L !== 'undefined') {
    // Coordinate for Jakarta (reference HQ location)
    const hqCoords = [-6.2088, 106.8456];
    
    // Initialize map
    const map = L.map('reservationMap', {
      center: hqCoords,
      zoom: 15,
      scrollWheelZoom: false
    });

    // Premium looking light cartodb basemap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Custom Coffee Marker Icon
    const coffeeIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background-color: #be9c79; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
          <svg style="color: white; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="2" x2="6" y2="4"></line>
            <line x1="10" y1="2" x2="10" y2="4"></line>
            <line x1="14" y1="2" x2="14" y2="4"></line>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Add marker to map
    L.marker(hqCoords, { icon: coffeeIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: 'Oswald', sans-serif; text-transform: uppercase;">
          <h5 style="margin: 0; color: #121418; font-size: 1.1rem; letter-spacing: 0.5px;">Kofi Roastery HQ</h5>
          <p style="margin: 4px 0 0; color: #be9c79; font-size: 0.85rem; font-family: 'Inter', sans-serif;">Premium Coffee Lounge</p>
        </div>
      `, { closeButton: false })
      .openPopup();
  }

  // ==========================================================================
  // RESERVATION FORM HANDLING & VALIDATION
  // ==========================================================================
  const bookingForm = document.getElementById('bookingForm');
  const formSuccessMsg = document.getElementById('formSuccessMsg');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate inputs
    const inputs = bookingForm.querySelectorAll('input, select');
    inputs.forEach(input => {
      const formGroup = input.closest('.form-group');
      if (!input.value || (input.tagName === 'SELECT' && input.selectedIndex === 0)) {
        formGroup.classList.add('invalid');
        isValid = false;
      } else {
        formGroup.classList.remove('invalid');
      }
    });

    // Submit mock success
    if (isValid) {
      formSuccessMsg.style.display = 'block';
      bookingForm.reset();
      
      // Remove success msg after 5s
      setTimeout(() => {
        formSuccessMsg.style.display = 'none';
      }, 5000);
    }
  });

  // Remove invalid warning classes on input
  bookingForm.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      const formGroup = input.closest('.form-group');
      if (input.value) {
        formGroup.classList.remove('invalid');
      }
    });
    
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        const formGroup = input.closest('.form-group');
        if (input.value) {
          formGroup.classList.remove('invalid');
        }
      });
    }
  });

  // ==========================================================================
  // CLIENT TESTIMONIAL CAROUSEL SLIDER
  // ==========================================================================
  const testimonialSlider = document.getElementById('testimonialSlider');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('#testimonialDots .dot');
  let currentSlide = 0;
  let slideInterval;

  const goToSlide = (slideIndex) => {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialSlides[slideIndex].classList.add('active');
    testimonialDots[slideIndex].classList.add('active');
    
    // Slide transition translate effect
    testimonialSlider.style.transform = `translateX(-${slideIndex * 100}%)`;
    currentSlide = slideIndex;
  };

  const nextSlide = () => {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= testimonialSlides.length) {
      nextIndex = 0;
    }
    goToSlide(nextIndex);
  };

  // Dots click handler
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetSlideTimer();
    });
  });

  // Auto scroll timer
  const startSlideTimer = () => {
    slideInterval = setInterval(nextSlide, 6000);
  };

  const resetSlideTimer = () => {
    clearInterval(slideInterval);
    startSlideTimer();
  };

  startSlideTimer();

  // ==========================================================================
  // REVEAL ON SCROLL OBSERVER
  // ==========================================================================
  const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    scrollRevealObserver.observe(el);
  });

  // ==========================================================================
  // INTERACTIVE OVERLAYS: SEARCH & CART
  // ==========================================================================
  
  // Search Overlay
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');

  searchBtn.addEventListener('click', () => {
    searchModal.classList.add('open');
    setTimeout(() => searchInput.focus(), 300);
  });

  const closeSearch = () => {
    searchModal.classList.remove('open');
  };

  closeSearchBtn.addEventListener('click', closeSearch);
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeCart();
    }
  });

  // Cart Drawer
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');

  const openCart = () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
  };

  const closeCart = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
  };

  cartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Cart Item Removal logic
  const removeButtons = document.querySelectorAll('.remove-cart-item');
  const cartBadge = document.querySelector('.cart-badge');
  const cartTotal = document.querySelector('.cart-total strong');
  const cartItemsContainer = document.querySelector('.cart-items');

  removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cartItem = e.target.closest('.cart-item');
      cartItem.style.opacity = '0';
      cartItem.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        cartItem.remove();
        updateCartTotals();
      }, 300);
    });
  });

  const updateCartTotals = () => {
    const itemsRemaining = document.querySelectorAll('.cart-item');
    // Update badge
    cartBadge.textContent = itemsRemaining.length;
    
    if (itemsRemaining.length === 0) {
      cartBadge.style.display = 'none';
      cartItemsContainer.innerHTML = '<p style="text-align: center; color: #656970; margin-top: 50px;">Your cart is empty.</p>';
      cartTotal.textContent = '$0.00';
    } else {
      // Recalculate totals (mock logic)
      let total = 0;
      itemsRemaining.forEach(item => {
        const text = item.querySelector('.cart-item-details p').textContent;
        const price = parseFloat(text.split('x')[0].replace('$', '').trim());
        const qty = parseInt(text.split('x')[1].trim());
        total += price * qty;
      });
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }
  };

  // Mock "Add to Cart" button actions
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const title = card.querySelector('.product-title').textContent;
      const priceText = card.querySelector('.product-price').textContent;
      const priceClean = priceText.includes('$') ? priceText.split('$')[1].trim() : priceText;
      const price = parseFloat(priceClean);
      const imgUrl = card.querySelector('.product-img-holder img').src;

      // Check if item already exists in cart sidebar
      let existingItem = null;
      document.querySelectorAll('.cart-item').forEach(item => {
        if (item.querySelector('.cart-item-details h5').textContent === title) {
          existingItem = item;
        }
      });

      if (existingItem) {
        const detailsPara = existingItem.querySelector('.cart-item-details p');
        const text = detailsPara.textContent;
        const qty = parseInt(text.split('x')[1].trim()) + 1;
        detailsPara.textContent = `$${price.toFixed(2)} x ${qty}`;
      } else {
        // Add new item html
        const newItem = document.createElement('div');
        newItem.classList.add('cart-item');
        newItem.innerHTML = `
          <img src="${imgUrl}" alt="${title}">
          <div class="cart-item-details">
            <h5>${title}</h5>
            <p>$${price.toFixed(2)} x 1</p>
          </div>
          <button class="remove-cart-item">&times;</button>
        `;
        
        // Add remove listener to new button
        newItem.querySelector('.remove-cart-item').addEventListener('click', (e) => {
          const item = e.target.closest('.cart-item');
          item.style.opacity = '0';
          item.style.transform = 'translateX(20px)';
          setTimeout(() => {
            item.remove();
            updateCartTotals();
          }, 300);
        });

        // Insert at beginning of cart list
        const container = document.querySelector('.cart-items');
        // Clear empty cart text if needed
        if (container.querySelector('p')) {
          container.innerHTML = '';
        }
        container.insertBefore(newItem, container.firstChild);
      }

      cartBadge.style.display = 'flex';
      updateCartTotals();
      openCart(); // Show drawer
    });
  });

  // Newsletter Form Submit
  const newsletterForm = document.getElementById('newsletterForm');
  const newsSuccess = newsletterForm.querySelector('.news-success');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input');
    if (emailInput.value && emailInput.value.includes('@')) {
      newsSuccess.style.display = 'block';
      emailInput.value = '';
      setTimeout(() => {
        newsSuccess.style.display = 'none';
      }, 4000);
    }
  });

});
