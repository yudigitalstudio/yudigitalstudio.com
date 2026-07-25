// =========================================================
// SAVORA — Full Menu catalog (vanilla JS, no frameworks)
// =========================================================

const CATALOG = [
  {
    cat: "starter",
    name: "Stuffed Mushrooms",
    desc: "Jamur portobello isi keju dan rempah pilihan.",
    price: 45000,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80",
    badge: "Best Seller",
  },
  {
    cat: "starter",
    name: "Italian Pasta Bites",
    desc: "Gulungan pasta renyah dengan saus tomat rumahan.",
    price: 52000,
    img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "starter",
    name: "Turkey Sandwich",
    desc: "Roti panggang isi kalkun asap dan sayuran segar.",
    price: 48000,
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "starter",
    name: "Greek Salad",
    desc: "Tomat, mentimun, zaitun, dan feta cheese.",
    price: 40000,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
  },

  {
    cat: "main",
    name: "Grilled Salmon",
    desc: "Salmon panggang dengan saus lemon butter.",
    price: 128000,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "main",
    name: "Wagyu Steak",
    desc: "Wagyu premium disajikan dengan kentang truffle.",
    price: 245000,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "main",
    name: "Seafood Paella",
    desc: "Nasi Spanyol klasik dengan aneka hasil laut segar.",
    price: 135000,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "main",
    name: "Herb Roasted Chicken",
    desc: "Ayam panggang rempah dengan sayuran musiman.",
    price: 95000,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
  },

  {
    cat: "dessert",
    name: "Tiramisu Classico",
    desc: "Lapisan kopi, mascarpone, dan kakao lembut.",
    price: 55000,
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "dessert",
    name: "Molten Choco Lava",
    desc: "Kue cokelat hangat dengan inti leleh.",
    price: 58000,
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "dessert",
    name: "Berry Cheesecake",
    desc: "Cheesecake lembut dengan saus beri segar.",
    price: 52000,
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "dessert",
    name: "Creme Brulee",
    desc: "Custard vanila dengan lapisan karamel renyah.",
    price: 50000,
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
  },

  {
    cat: "drinks",
    name: "Signature Mocktail",
    desc: "Racikan buah segar dengan soda dan mint.",
    price: 38000,
    img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "drinks",
    name: "Cold Brew Coffee",
    desc: "Kopi seduh dingin selama 18 jam, halus dan kaya.",
    price: 32000,
    img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "drinks",
    name: "House Red Wine",
    desc: "Pilihan wine merah rekomendasi sommelier kami.",
    price: 85000,
    img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=500&q=80",
  },
  {
    cat: "drinks",
    name: "Fresh Citrus Sparkling",
    desc: "Perpaduan jeruk segar dan air soda.",
    price: 30000,
    img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=500&q=80",
  },
];

const CAT_LABEL = {
  starter: "Starter",
  main: "Main Dish",
  dessert: "Dessert",
  drinks: "Drinks",
};

function renderFilters() {
  const counts = { all: CATALOG.length };
  CATALOG.forEach((item) => {
    counts[item.cat] = (counts[item.cat] || 0) + 1;
  });

  const buttons = [
    { key: "all", label: "Semua" },
    { key: "starter", label: "Starter" },
    { key: "main", label: "Main Dishes" },
    { key: "dessert", label: "Desserts" },
    { key: "drinks", label: "Drinks" },
  ];

  filtersWrap.innerHTML = buttons
    .map(
      (b) => `
    <button class="catalog__filter ${b.key === "all" ? "is-active" : ""}" data-filter="${b.key}">
      ${b.label} <span class="catalog__filter-count">${counts[b.key] || 0}</span>
    </button>
  `,
    )
    .join("");
}
const grid = document.getElementById("catalogGrid");
const emptyState = document.getElementById("catalogEmpty");
const countEl = document.getElementById("catalogCount");
const filtersWrap = document.getElementById("catalogFilters");
const searchInput = document.getElementById("catalogSearch");

let activeFilter = "all";
let searchTerm = "";

function formatPrice(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function renderFilters() {
  const counts = { all: CATALOG.length };
  CATALOG.forEach((item) => {
    counts[item.cat] = (counts[item.cat] || 0) + 1;
  });

  const buttons = [
    { key: "all", label: "Semua" },
    { key: "starter", label: "Starter" },
    { key: "main", label: "Main Dishes" },
    { key: "dessert", label: "Desserts" },
    { key: "drinks", label: "Drinks" },
  ];

  filtersWrap.innerHTML = buttons
    .map(
      (b) => `
    <button class="catalog__filter ${b.key === activeFilter ? "is-active" : ""}" data-filter="${b.key}">
      ${b.label} <span class="catalog__filter-count">${counts[b.key] || 0}</span>
    </button>
  `,
    )
    .join("");

  document.querySelectorAll(".catalog__filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const filtered = CATALOG.filter((item) => {
    const matchCat = activeFilter === "all" || item.cat === activeFilter;
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.desc.toLowerCase().includes(searchTerm);
    return matchCat && matchSearch;
  });

  grid.innerHTML = filtered
    .map(
      (item, i) => `
    <div class="menu-card" style="animation-delay:${Math.min(i * 0.05, 0.4)}s">
      <div class="menu-card__img-wrap">
        <div class="menu-card__img" style="background-image:url('${item.img}')"></div>
        <span class="menu-card__tag">${CAT_LABEL[item.cat]}</span>
        ${item.badge ? `<span class="menu-card__badge">${item.badge}</span>` : ""}
      </div>
      <div class="menu-card__body">
        <div class="menu-card__top">
          <h3 class="menu-card__name">${item.name}</h3>
          <span class="menu-card__price">${formatPrice(item.price)}</span>
        </div>
        <p class="menu-card__desc">${item.desc}</p>
        <a href="https://wa.me/6281234567890?text=${encodeURIComponent("Halo Savora, saya ingin pesan " + item.name + ".")}" target="_blank" class="menu-card__cta">Pesan via WhatsApp &rarr;</a>
      </div>
    </div>
  `,
    )
    .join("");

  emptyState.classList.toggle("is-visible", filtered.length === 0);
  countEl.textContent =
    filtered.length === CATALOG.length
      ? `Menampilkan semua ${filtered.length} menu`
      : `Menampilkan ${filtered.length} dari ${CATALOG.length} menu`;
}

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderGrid();
});

renderFilters();
renderGrid();
