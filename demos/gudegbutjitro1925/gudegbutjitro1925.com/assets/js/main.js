document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Header scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  // Toggle dropdown submenu di mobile
  const dropdownLinks = document.querySelectorAll(".dropdown > .nav-link");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      // Toggle hamburger animation
      const spans = menuToggle.querySelectorAll("span");
      if (navMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
    dropdownLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Cuma jalankan toggle kalau lagi mode mobile
        if (window.innerWidth <= 768) {
          e.preventDefault(); // biar gak loncat ke "#"
          const submenu = link.nextElementSibling;
          submenu.classList.toggle("active");
        }
      });
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const spans = menuToggle.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll(".reveal");
  const revealOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((element) => {
    revealOnScroll.observe(element);
  });

  // 4. Smooth Scrolling for Internal Links
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 5. Dynamic Form Submissions (Mock with Premium Toast notification)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect Form Data
      const formData = new FormData(form);
      let formDetails = {};
      formData.forEach((value, key) => {
        formDetails[key] = value;
      });

      // Show a premium toast notification
      showToast(
        "Pengajuan Anda berhasil dikirim! Tim kami akan menghubungi Anda segera.",
        "success",
      );
      form.reset();
    });
  });

  function showToast(message, type = "success") {
    // Create Toast Container if not exists
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      // Simple inline styling for Toast Container to avoid CSS dependency
      Object.assign(toastContainer.style, {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      });
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    // Inline styling for Toast
    Object.assign(toast.style, {
      background: type === "success" ? "#C5A85C" : "#5C0618",
      color: type === "success" ? "#2B050B" : "#F7EFF0",
      padding: "1rem 2rem",
      borderRadius: "50px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: "600",
      fontSize: "0.9rem",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      transform: "translateY(50px)",
      opacity: "0",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    });

    toastContainer.appendChild(toast);

    // Animate In
    setTimeout(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    }, 10);

    // Animate Out & Remove
    setTimeout(() => {
      toast.style.transform = "translateY(-20px)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }
});
