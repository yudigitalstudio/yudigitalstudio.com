/* ==========================================================================
   MORPH MODERN CONSTRUCTION STUDIO - INTERACTIVITY & ANIMATIONS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. Sticky Header scroll handler
       ========================================================================== */
  const mainHeader = document.getElementById("mainHeader");

  const handleScrollHeader = () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScrollHeader);
  handleScrollHeader(); // Run initially in case page is refreshed while scrolled

  /* ==========================================================================
       2. Mobile Drawer Navigation
       ========================================================================== */
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerClose = document.getElementById("drawerClose");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  const openDrawer = () => {
    mobileDrawer.classList.add("open");
    drawerOverlay.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
    document.body.style.overflow = ""; // Restore scrolling
  };

  mobileToggle.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  /* ==========================================================================
       3. Active Navigation Link Highlighting on Scroll
       ========================================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const highlightNavLink = () => {
    let scrollY = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Offset for header height
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", highlightNavLink);
  highlightNavLink();

  /* ==========================================================================
       4. Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
  const revealElements = document.querySelectorAll(
    ".reveal-fade, .reveal-left, .reveal-right",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Once animate is complete, we can stop observing it
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Margins around root
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });
  }

  /* ==========================================================================
       5. Testimonial Slider / Carousel
       ========================================================================== */
  const slides = document.querySelectorAll(".testimonial-slide");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  let currentSlide = 0;
  const totalSlides = slides.length;

  const showSlide = (index) => {
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    currentSlide = (index + totalSlides) % totalSlides;
    slides[currentSlide].classList.add("active");
  };

  if (prevBtn && nextBtn && totalSlides > 0) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentSlide - 1);
    });

    nextBtn.addEventListener("click", () => {
      showSlide(currentSlide + 1);
    });

    // Auto rotate slides every 8 seconds
    let slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 8000);

    // Clear interval on manual click to avoid jumpy transitions
    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 8000);
    };

    prevBtn.addEventListener("click", resetInterval);
    nextBtn.addEventListener("click", resetInterval);
  }

  /* ==========================================================================
       6. Toast Notification & Form Handling
       ========================================================================== */
  const toast = document.getElementById("toastNotification");
  const toastClose = document.getElementById("toastClose");
  const contactForm = document.getElementById("contactForm");
  const newsletterForm = document.getElementById("newsletterForm");

  const showToast = (titleText, messageText) => {
    if (!toast) return;

    const toastTitle = toast.querySelector(".toast-title");
    const toastMsg = toast.querySelector(".toast-msg");

    if (titleText && toastTitle) toastTitle.textContent = titleText;
    if (messageText && toastMsg) toastMsg.textContent = messageText;

    toast.classList.add("show");

    // Auto hide after 4.5 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4500);
  };

  if (toastClose) {
    toastClose.addEventListener("click", () => {
      toast.classList.remove("show");
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById("submitFormBtn");
      const originalText = submitBtn.innerHTML;

      // Show loading animation on button
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-1"></i> Sending...';

      // Simulate API request delay
      setTimeout(() => {
        // Reset form fields
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show custom toast notification
        showToast(
          "Pesan Dikirim!",
          "Pesan Anda telah berhasil dikirim ke tim Morph Studio. Kami akan membalas dalam 1x24 jam.",
        );
      }, 1500);
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector(".newsletter-input");
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      setTimeout(() => {
        emailInput.value = "";
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        showToast(
          "Berlangganan!",
          "Terima kasih telah mendaftar newsletter kami.",
        );
      }, 1200);
    });
  }

  /* ==========================================================================
       7. Video Modal Player
       ========================================================================== */
  const playBtn = document.querySelector(".play-btn");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      // Create modal elements
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100vw";
      modal.style.height = "100vh";
      modal.style.backgroundColor = "rgba(13, 17, 23, 0.95)";
      modal.style.zIndex = "3000";
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      modal.style.opacity = "0";
      modal.style.transition = "opacity 0.3s ease";

      const modalContent = document.createElement("div");
      modalContent.style.position = "relative";
      modalContent.style.width = "90%";
      modalContent.style.maxWidth = "900px";
      modalContent.style.aspectRatio = "16/9";
      modalContent.style.backgroundColor = "#000";
      modalContent.style.borderRadius = "16px";
      modalContent.style.overflow = "hidden";
      modalContent.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";

      const closeButton = document.createElement("button");
      closeButton.innerHTML = "&times;";
      closeButton.style.position = "absolute";
      closeButton.style.top = "20px";
      closeButton.style.right = "20px";
      closeButton.style.fontSize = "2.5rem";
      closeButton.style.background = "none";
      closeButton.style.border = "none";
      closeButton.style.color = "#fff";
      closeButton.style.cursor = "pointer";
      closeButton.style.zIndex = "3100";
      closeButton.style.width = "44px";
      closeButton.style.height = "44px";
      closeButton.style.display = "flex";
      closeButton.style.alignItems = "center";
      closeButton.style.justifyContent = "center";
      closeButton.style.lineHeight = "1";

      // Embedding a high-end luxury villa tour video
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"; // Rick Roll or generic luxury house tour. Let's use a nice, real luxury house tour:
      iframe.src = "https://www.youtube.com/embed/tS0y1C-qDxs?autoplay=1"; // Beautiful architectural design video
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;

      modalContent.appendChild(iframe);
      modal.appendChild(modalContent);
      modal.appendChild(closeButton);
      document.body.appendChild(modal);

      // Trigger animation
      setTimeout(() => {
        modal.style.opacity = "1";
      }, 10);

      // Disable scroll
      document.body.style.overflow = "hidden";

      const destroyModal = () => {
        modal.style.opacity = "0";
        setTimeout(() => {
          modal.remove();
          document.body.style.overflow = "";
        }, 300);
      };

      closeButton.addEventListener("click", destroyModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          destroyModal();
        }
      });
    });
  }
});
