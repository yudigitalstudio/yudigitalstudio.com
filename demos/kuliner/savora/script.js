// =========================================================
// RASA — interactions
// =========================================================

/* ---------- Navbar scroll state + mobile toggle ---------- */
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 40);
});

burger.addEventListener("click", () => {
  burger.classList.toggle("is-open");
  navLinks.classList.toggle("is-open");
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    burger.classList.remove("is-open");
    navLinks.classList.remove("is-open");
  });
});

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ---------- Toast helper ---------- */
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

/* ---------- Menu data + tabs ---------- */
const MENU_DATA = {
  starter: {
    watermark: "STARTER",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=700&q=80",
    items: [
      {
        name: "Stuffed Mushrooms",
        desc: "Jamur portobello isi keju dan rempah pilihan.",
        price: "Rp 45.000",
      },
      {
        name: "Italian Pasta Bites",
        desc: "Gulungan pasta renyah dengan saus tomat rumahan.",
        price: "Rp 52.000",
      },
      {
        name: "Turkey Sandwich",
        desc: "Roti panggang isi kalkun asap dan sayuran segar.",
        price: "Rp 48.000",
      },
      {
        name: "Greek Salad",
        desc: "Tomat, mentimun, zaitun, dan feta cheese.",
        price: "Rp 40.000",
      },
    ],
  },
  main: {
    watermark: "MAIN",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    items: [
      {
        name: "Grilled Salmon",
        desc: "Salmon panggang dengan saus lemon butter.",
        price: "Rp 128.000",
      },
      {
        name: "Wagyu Steak",
        desc: "Wagyu premium disajikan dengan kentang truffle.",
        price: "Rp 245.000",
      },
      {
        name: "Seafood Paella",
        desc: "Nasi Spanyol klasik dengan aneka hasil laut segar.",
        price: "Rp 135.000",
      },
      {
        name: "Herb Roasted Chicken",
        desc: "Ayam panggang rempah dengan sayuran musiman.",
        price: "Rp 95.000",
      },
    ],
  },
  dessert: {
    watermark: "DESSERT",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80",
    items: [
      {
        name: "Tiramisu Classico",
        desc: "Lapisan kopi, mascarpone, dan kakao lembut.",
        price: "Rp 55.000",
      },
      {
        name: "Molten Choco Lava",
        desc: "Kue cokelat hangat dengan inti leleh.",
        price: "Rp 58.000",
      },
      {
        name: "Berry Cheesecake",
        desc: "Cheesecake lembut dengan saus beri segar.",
        price: "Rp 52.000",
      },
      {
        name: "Creme Brulee",
        desc: "Custard vanila dengan lapisan karamel renyah.",
        price: "Rp 50.000",
      },
    ],
  },
  drinks: {
    watermark: "DRINKS",
    image:
      "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=700&q=80",
    items: [
      {
        name: "Signature Mocktail",
        desc: "Racikan buah segar dengan soda dan mint.",
        price: "Rp 38.000",
      },
      {
        name: "Cold Brew Coffee",
        desc: "Kopi seduh dingin selama 18 jam, halus dan kaya.",
        price: "Rp 32.000",
      },
      {
        name: "House Red Wine",
        desc: "Pilihan wine merah rekomendasi sommelier kami.",
        price: "Rp 85.000",
      },
      {
        name: "Fresh Citrus Sparkling",
        desc: "Perpaduan jeruk segar dan air soda.",
        price: "Rp 30.000",
      },
    ],
  },
};

const menuTabs = document.querySelectorAll(".menu__tab");
const menuList = document.getElementById("menuList");
const menuShowcaseImg = document.getElementById("menuShowcaseImg");
const menuWatermark = document.getElementById("menuWatermark");

function renderMenu(key) {
  const data = MENU_DATA[key];

  menuList.innerHTML = data.items
    .map(
      (item, i) => `
    <div class="menu-row" style="animation-delay:${i * 0.08}s">
      <div>
        <p class="menu-row__name">${item.name}</p>
        <p class="menu-row__desc">${item.desc}</p>
      </div>
      <p class="menu-row__price">${item.price}</p>
    </div>
  `,
    )
    .join("");

  menuShowcaseImg.style.opacity = 0;
  setTimeout(() => {
    menuShowcaseImg.style.backgroundImage = `url('${data.image}')`;
    menuShowcaseImg.style.opacity = 1;
  }, 200);

  menuWatermark.textContent = data.watermark;
}

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    menuTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    renderMenu(tab.dataset.tab);
  });
});

renderMenu("starter");

/* ---------- Testimonials slider ---------- */
const TESTIMONIALS = [
  {
    text: "Pengalaman bersantap yang tak terlupakan. Setiap hidangan adalah maha karya, dan suasananya begitu sempurna dari awal hingga akhir kunjungan kami.",
    name: "Anisa Putri",
    role: "Food Blogger",
  },
  {
    text: "Pelayanan yang hangat dan detail rasa yang luar biasa. Rasa berhasil membuat perayaan ulang tahun kami menjadi momen yang sangat berkesan.",
    name: "Bagas Santoso",
    role: "Pengunjung Reguler",
  },
  {
    text: "Dari appetizer hingga dessert, semuanya seimbang dan penuh karakter. Tempat favorit baru kami untuk makan malam spesial.",
    name: "Clara Wijaya",
    role: "Kritikus Kuliner",
  },
];

const testiText = document.getElementById("testiText");
const testiName = document.getElementById("testiName");
const testiRole = document.getElementById("testiRole");
const testiAvatars = document.querySelectorAll(".testi-avatar");
let testiIndex = 0;
let testiTimer;

function renderTestimonial(i) {
  const t = TESTIMONIALS[i];
  testiText.style.opacity = 0;
  setTimeout(() => {
    testiText.textContent = t.text;
    testiName.textContent = t.name;
    testiRole.textContent = t.role;
    testiText.style.opacity = 1;
  }, 250);
  testiAvatars.forEach((a) => a.classList.remove("is-active"));
  testiAvatars[i].classList.add("is-active");
  testiIndex = i;
}

testiAvatars.forEach((btn) => {
  btn.addEventListener("click", () => {
    renderTestimonial(Number(btn.dataset.i));
    resetTestiAutoplay();
  });
});

function resetTestiAutoplay() {
  clearInterval(testiTimer);
  testiTimer = setInterval(() => {
    renderTestimonial((testiIndex + 1) % TESTIMONIALS.length);
  }, 6000);
}
resetTestiAutoplay();

/* ---------- Play button (placeholder video) ---------- */
document.getElementById("playBtn").addEventListener("click", () => {
  showToast("▶ Video preview belum tersedia di demo ini.");
});

/* ---------- Book a table form → WhatsApp ---------- */
const WA_NUMBER = "6281234567890"; // ganti sesuai nomor WA resto (format: kode negara tanpa +, tanpa 0 di depan)

document.getElementById("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = e.target.querySelectorAll("input");
  const [nama, telepon, email, tamu, tanggal, waktu] = inputs;
  const pesan = e.target.querySelector("textarea").value;

  const text = `Halo Savora, saya ingin reservasi meja:

Nama: ${nama.value}
Telepon: ${telepon.value}
Email: ${email.value}
Jumlah Tamu: ${tamu.value}
Tanggal: ${tanggal.value}
Jam: ${waktu.value}
Catatan: ${pesan || "-"}`;

  const waUrl = `https://wa.me/${6281222255086}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank");

  showToast("Membuka WhatsApp...");
  e.target.reset();
});

/* ---------- Custom placeholder untuk date & time ---------- */
document
  .querySelectorAll(
    '.field-wrap input[type="date"], .field-wrap input[type="time"]',
  )
  .forEach((input) => {
    const wrap = input.closest(".field-wrap");
    input.addEventListener("input", () => {
      wrap.classList.toggle("is-empty", !input.value);
    });
  });

/* ---------- Newsletter form ---------- */
document.getElementById("newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Terima kasih telah berlangganan newsletter Rasa!");
  e.target.reset();
});
