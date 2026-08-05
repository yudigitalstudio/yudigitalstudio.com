/* ==========================================================================
   CAVERTA FINE DINING - MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Header Scroll States & Scroll Spy ---
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    // Sticky Header scroll height toggle
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll Spy active navigation state
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120; // adjust offset for sticky header
      const sectionHeight = section.offsetHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });

  // --- 2. Mobile Drawer Navigation Menu ---
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileClose = document.getElementById("mobile-close");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  const openMobileMenu = () => {
    mobileDrawer.classList.add("open");
    document.body.style.overflow = "hidden"; // Lock background scroll
  };

  const closeMobileMenu = () => {
    mobileDrawer.classList.remove("open");
    document.body.style.overflow = ""; // Unlock background scroll
  };

  mobileToggle.addEventListener("click", openMobileMenu);
  mobileClose.addEventListener("click", closeMobileMenu);

  // Close mobile menu when clicking menu items
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // --- 3. Scroll Reveal Animation using Intersection Observer ---
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const revealObserverOptions = {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: "0px 0px -50px 0px", // Offset bottom threshold trigger
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Optional: Unobserve element after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // --- 4. Signature Food Menu Category Switcher Tabs ---
  const tabItems = document.querySelectorAll(".tab-item");
  const menuPanes = document.querySelectorAll(".menu-pane");

  tabItems.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active classes
      tabItems.forEach((item) => item.classList.remove("active"));
      menuPanes.forEach((pane) => {
        pane.classList.remove("active");
        // Temporarily hide visually for animation reset
        pane.style.display = "none";
      });

      // Add active class to clicked tab
      tab.classList.add("active");

      // Show and animate current pane
      const targetPaneId = tab.getAttribute("data-target");
      const targetPane = document.getElementById(targetPaneId);

      if (targetPane) {
        targetPane.style.display = "block";
        // Trigger reflow to restart css animation
        void targetPane.offsetWidth;
        targetPane.classList.add("active");
      }
    });
  });

  // --- 5. Interactive Booking Reservation Form ---
  const bookingForm = document.getElementById("booking-form");
  const bookingFeedback = document.getElementById("booking-feedback");
  const feedbackSpinner = document.getElementById("feedback-spinner");
  const feedbackSuccess = document.getElementById("feedback-success");
  const successMessage = document.getElementById("success-message");

  // Set minimum date picker selection to today's local date
  const bookingDateInput = document.getElementById("booking-date");
  if (bookingDateInput) {
    const today = new Date().toISOString().split("T")[0];
    bookingDateInput.min = today;
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const dateVal = document.getElementById("booking-date").value;
      const timeVal = document.getElementById("booking-time").value;
      const guestsVal = document.getElementById("booking-guests").value;

      // Display loading interface
      bookingFeedback.classList.add("active");
      feedbackSpinner.style.display = "block";
      feedbackSuccess.style.display = "none";

      // Format nice display date
      const dateObj = new Date(dateVal);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = dateObj.toLocaleDateString("en-US", options);

      // Bangun pesan WhatsApp otomatis dari data form
      const waNumber = "6281222255086"; // GANTI dengan nomor WA restoran lo (62xxxxxxxxxx)
      const waMessage = `Halo, saya ingin melakukan reservasi meja di Caverta:%0A%0A📅 Tanggal: ${formattedDate}%0A🕒 Waktu: ${timeVal}%0A👥 Jumlah Tamu: ${guestsVal} orang%0A%0AMohon konfirmasi ketersediaan meja. Terima kasih!`;
      const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

      // Simulate short loading lalu redirect ke WhatsApp
      setTimeout(() => {
        feedbackSpinner.style.display = "none";
        feedbackSuccess.style.display = "block";

        successMessage.innerHTML = `Your table for <strong>${guestsVal} ${guestsVal === "1" ? "person" : "people"}</strong> on <strong>${formattedDate}</strong> at <strong>${timeVal}</strong> is being confirmed via WhatsApp.`;

        window.open(waLink, "_blank");
      }, 1800);
    });
  }

  // --- 6. Wide Banner Parallax Scrolling Effect ---
  const parallaxBg = document.querySelector(".banner-wide-bg");
  if (parallaxBg) {
    window.addEventListener("scroll", () => {
      const scrollPos = window.scrollY;
      const bannerOffset = parallaxBg.parentElement.offsetTop;
      const viewportHeight = window.innerHeight;

      // Check if banner is within viewport view before rendering transform
      if (
        scrollPos + viewportHeight > bannerOffset &&
        scrollPos < bannerOffset + 450
      ) {
        const yOffset = (scrollPos - bannerOffset) * 0.15; // scroll coefficient speed
        parallaxBg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    });
  }
});
