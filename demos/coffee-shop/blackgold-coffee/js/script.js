document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("slideDots");
  const progressBar = document.getElementById("slideProgress");
  const currentNumEl = document.getElementById("slideCurrentNum");
  const totalNumEl = document.getElementById("slideTotalNum");
  const slideshowContainer = document.querySelector(".hero-slideshow");

  // Kalau ga ada slides, exit
  if (!slides.length || !dotsContainer) return;

  let currentIndex = 0;
  let paused = false;
  let rafId;
  let startTime;
  const DURATION = 8000;

  if (totalNumEl)
    totalNumEl.textContent = String(slides.length).padStart(2, "0");

  // Buat dots
  slides.forEach(function (_, i) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", function () {
      goToSlide(i);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function goToSlide(index) {
    const prevSlide = slides[currentIndex];
    currentIndex = (index + slides.length) % slides.length;
    const nextSlide = slides[currentIndex];

    prevSlide.classList.add("leaving");
    nextSlide.classList.add("active");

    if (dots.length) {
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[currentIndex].classList.add("active");
    }

    if (currentNumEl) {
      currentNumEl.textContent = String(currentIndex + 1).padStart(2, "0");
    }

    setTimeout(() => {
      prevSlide.classList.remove("active");
      prevSlide.classList.remove("leaving");
    }, 1800);

    startProgress();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startProgress() {
    if (rafId) cancelAnimationFrame(rafId);
    startTime = null;

    function tick(ts) {
      if (paused) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (!startTime) startTime = ts;
      var pct = Math.min(((ts - startTime) / DURATION) * 100, 100);
      if (progressBar) progressBar.style.width = pct + "%";
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        nextSlide();
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  // Event listeners dengan pengecekan
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  if (slideshowContainer) {
    slideshowContainer.addEventListener("mouseenter", function () {
      paused = true;
    });
    slideshowContainer.addEventListener("mouseleave", function () {
      paused = false;
    });

    // Touch swipe untuk mobile
    var touchStartX = 0;
    slideshowContainer.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );
    slideshowContainer.addEventListener(
      "touchend",
      function (e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? nextSlide() : prevSlide();
        }
      },
      { passive: true },
    );
  }

  // Mobile menu toggle
  var mobileMenu = document.getElementById("mobile-menu");
  var navLinks = document.getElementById("nav-links");
  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
      });
    });
  }

  startProgress();
});
