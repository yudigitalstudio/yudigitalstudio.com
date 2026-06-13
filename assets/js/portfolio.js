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

  // reset search saat ganti mode
  resetSearch();
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

/* ============================================
   SEARCH — kompleks: sidebar + kartu demo
   ============================================ */
(function () {
  /* Keyword yang dicari di dalam setiap kartu:
     - .demo-name  → nama demo (Kumis & Sisir, BlackGold Coffee, dll)
     - .demo-type  → tipe (Barbershop, Coffee Shop, Bakery, dll)
     - .panel-title di panel induknya → nama kategori (Barbershop, Kuliner, dll)
     - .tag        → tag (Landing Page, Responsive, dll)
  */
  function getCardKeywords(card, panel) {
    const name = card.querySelector(".demo-name")?.textContent || "";
    const type = card.querySelector(".demo-type")?.textContent || "";
    const cat = panel.querySelector(".panel-title")?.textContent || "";
    const tags = Array.from(panel.querySelectorAll(".tag"))
      .map((t) => t.textContent)
      .join(" ");
    return `${name} ${type} ${cat} ${tags}`.toLowerCase();
  }

  function getTabKeywords(tab, panel) {
    const title = tab.querySelector(".tab-title")?.textContent || "";
    const cat = panel?.querySelector(".panel-title")?.textContent || "";
    const tags = Array.from(panel?.querySelectorAll(".tag") || [])
      .map((t) => t.textContent)
      .join(" ");
    return `${title} ${cat} ${tags}`.toLowerCase();
  }

  /* Highlight teks keyword dalam elemen */
  function highlight(el, keyword) {
    if (!keyword) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      if (regex.test(node.textContent)) {
        const span = document.createElement("span");
        span.innerHTML = node.textContent.replace(
          regex,
          '<mark class="porto-hl">$1</mark>',
        );
        node.parentNode.replaceChild(span, node);
      }
    });
  }

  /* Hapus semua highlight */
  function clearHighlights(root) {
    root.querySelectorAll(".porto-hl").forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    root.querySelectorAll("span:empty").forEach((s) => s.remove());
  }

  /* Reset semua state search */
  window.resetSearch = function () {
    const input = document.getElementById("portoSearch");
    if (input) {
      input.value = "";
    }
    doSearch("");
  };

  function doSearch(q) {
    q = (q || "").toLowerCase().trim();

    const clearBtn = document.getElementById("portoSearchClear");
    const countEl = document.getElementById("portoCount");
    const emptyEl = document.getElementById("portoEmptyTabs");

    if (clearBtn) clearBtn.style.display = q ? "inline-flex" : "none";

    const activeSection = document.querySelector(".section.active");
    if (!activeSection) return;

    const tabs = Array.from(activeSection.querySelectorAll(".tab-item"));
    const panels = Array.from(activeSection.querySelectorAll(".panel"));

    /* Bersihkan highlight lama */
    panels.forEach((p) => clearHighlights(p));
    tabs.forEach((t) => clearHighlights(t));

    if (!q) {
      /* Tanpa keyword — kembalikan semua ke normal */
      tabs.forEach((t) => {
        t.classList.remove(
          "porto-tab-hidden",
          "porto-tab-dim",
          "porto-tab-match",
        );
      });
      panels.forEach((p) => {
        p.querySelectorAll(".demo-card").forEach((c) => {
          c.classList.remove("porto-card-hidden", "porto-card-match");
        });
      });
      if (countEl) countEl.textContent = "";
      if (emptyEl) emptyEl.style.display = "none";
      return;
    }

    /* ---- Cek setiap tab + panel ---- */
    let totalMatches = 0;
    let firstMatchTab = null;

    tabs.forEach((tab, i) => {
      const panel = panels[i];
      if (!panel) return;

      /* Cek kartu di dalam panel ini */
      const cards = Array.from(panel.querySelectorAll(".demo-card"));
      let panelHasMatch = false;
      let cardMatchCount = 0;

      cards.forEach((card) => {
        const keywords = getCardKeywords(card, panel);
        const matches = keywords.includes(q);

        if (matches) {
          card.classList.remove("porto-card-hidden");
          card.classList.add("porto-card-match");
          highlight(card.querySelector(".demo-name"), q);
          highlight(card.querySelector(".demo-type"), q);
          panelHasMatch = true;
          cardMatchCount++;
          totalMatches++;
        } else {
          card.classList.add("porto-card-hidden");
          card.classList.remove("porto-card-match");
        }
      });

      /* Cek nama tab sendiri */
      const tabKeywords = getTabKeywords(tab, panel);
      const tabMatches = tabKeywords.includes(q);

      if (panelHasMatch || tabMatches) {
        tab.classList.remove("porto-tab-hidden", "porto-tab-dim");
        tab.classList.add("porto-tab-match");
        highlight(tab.querySelector(".tab-title"), q);
        if (!firstMatchTab) firstMatchTab = { tab, index: i };

        /* Kalau match dari nama tab tapi kartu ga ada keyword,
           tampilkan semua kartu di panel itu */
        if (tabMatches && !panelHasMatch) {
          cards.forEach((c) => {
            c.classList.remove("porto-card-hidden");
            c.classList.remove("porto-card-match");
          });
          totalMatches += cards.filter(
            (c) =>
              !c
                .querySelector(".demo-name")
                ?.textContent.includes("Coming Soon"),
          ).length;
        }
      } else {
        tab.classList.add("porto-tab-hidden");
        tab.classList.remove("porto-tab-match", "porto-tab-dim");
      }
    });

    /* Update counter */
    if (countEl) {
      const visibleTabs = tabs.filter(
        (t) => !t.classList.contains("porto-tab-hidden"),
      ).length;
      countEl.textContent = `${visibleTabs} kategori · ${totalMatches} demo ditemukan`;
    }

    /* Pesan kosong */
    const noResult = tabs.every((t) =>
      t.classList.contains("porto-tab-hidden"),
    );
    if (emptyEl) emptyEl.style.display = noResult ? "block" : "none";

    /* Pindah ke tab pertama yang match */
    if (firstMatchTab) {
      const currentActive = activeSection.querySelector(".tab-item.active");
      if (
        !currentActive ||
        currentActive.classList.contains("porto-tab-hidden")
      ) {
        firstMatchTab.tab.click();
      }
    }
  }

  /* ---- Event listeners ---- */
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("portoSearch");
    const clearBtn = document.getElementById("portoSearchClear");

    if (!input) return;

    input.addEventListener("input", (e) => doSearch(e.target.value));

    clearBtn?.addEventListener("click", () => {
      input.value = "";
      input.focus();
      doSearch("");
    });

    document.getElementById("btnDemo")?.addEventListener("click", () => {
      setTimeout(() => doSearch(input.value), 50);
    });

    document.getElementById("btnClient")?.addEventListener("click", () => {
      setTimeout(() => doSearch(input.value), 50);
    });
  });
})();
