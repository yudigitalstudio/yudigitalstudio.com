window.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline();

  // Badge
  tl.from(".hero-badge", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  // Title
  //tl.from(
  //".hero-title .line",
  //{
  //yPercent: 120,
  //stagger: 0.15,
  //duration: 1.2,
  //ease: "power4.out",
  //},
  //"-=0.4",
  //);

  // Description
  //tl.from(
  //".hero-desc",
  //{
  //y: 30,
  //opacity: 0,
  //duration: 1,
  //ease: "power3.out",
  //},
  //"-=0.8",
  //);

  // Buttons
  //tl.from(
  //".hero-actions a",
  //{
  //y: 20,
  //opacity: 0,
  //stagger: 0.15,
  //duration: 0.8,
  //ease: "power3.out",
  //},
  //"-=0.6",
  //);

  // Scroll text
  tl.from(
    ".hero-scroll",
    {
      opacity: 0,
      x: -20,
      duration: 0.8,
    },
    "-=0.4",
  );

  // Background floating
  gsap.to(".hero-bg-num", {
    y: 20,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Rotating text
  gsap.to(".rotating-text", {
    rotation: 360,
    duration: 25,
    repeat: -1,
    ease: "none",
    transformOrigin: "center center",
  });
});

window.addEventListener("DOMContentLoaded", () => {
  new Swiper(".aboutSwiper", {
    loop: true,

    effect: "fade",

    speed: 1500,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });
});

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  mobileNav.classList.toggle("open");

  hamburger.setAttribute("aria-expanded", isOpen);
  mobileNav.setAttribute("aria-hidden", !isOpen);

  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Tutup saat link diklik
mobileNav.querySelectorAll(".mob-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    mobileNav.setAttribute("aria-hidden", true);
    document.body.style.overflow = "";
  });
});

// Tutup saat tekan Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && hamburger.classList.contains("open")) {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    mobileNav.setAttribute("aria-hidden", true);
    document.body.style.overflow = "";
  }
});

const mobClose = document.getElementById("mobClose");

mobClose.addEventListener("click", () => {
  hamburger.classList.remove("open");
  mobileNav.classList.remove("open");
  document.body.style.overflow = "";
});

//portofolio
function switchMode(mode) {
  const wrap = document.getElementById("mainWrap");
  const btnDemo = document.getElementById("btnDemo");
  const btnClient = document.getElementById("btnClient");
  const secDemo = document.getElementById("sectionDemo");
  const secClient = document.getElementById("sectionClient");
  const heroEm = document.getElementById("heroEm");
  const heroDesc = document.getElementById("heroDesc");

  if (mode === "demo") {
    secDemo.classList.add("active");
    secClient.classList.remove("active");
    wrap.classList.remove("mode-client");
    btnDemo.classList.add("active-demo");
    btnClient.classList.remove("active-client");
    heroEm.textContent = "Archive";
    heroDesc.textContent =
      "Pilih project di panel kiri untuk lihat semua demo-nya.";
  } else {
    secClient.classList.add("active");
    secDemo.classList.remove("active");
    wrap.classList.add("mode-client");
    btnClient.classList.add("active-client");
    btnDemo.classList.remove("active-demo");
    heroEm.textContent = "Client Work";
    heroDesc.textContent =
      "Real projects untuk klien nyata — dari brief sampai delivered.";
  }
}

function switchTab(mode, index, el) {
  const section =
    mode === "demo"
      ? document.getElementById("sectionDemo")
      : document.getElementById("sectionClient");

  section
    .querySelectorAll(".tab-item")
    .forEach((t) => t.classList.remove("active"));
  section
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  section.querySelectorAll(".panel")[index].classList.add("active");
}
