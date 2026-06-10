/**
 * Custom Cursor Animation
 * Usage: taruh script ini sebelum </body>, lalu panggil initCursor()
 *
 * Options:
 *   color   - warna utama kursor (default: '#7F77DD')
 *   trail   - jumlah trail dots (default: 12)
 *   burst   - jumlah partikel saat klik (default: 8)
 */

function initCursor(options = {}) {
  const color = options.color || "#0e7600";
  const TRAIL = options.trail || 12;
  const BURST = options.burst || 8;

  // --- inject CSS ---
  const style = document.createElement("style");
  style.textContent = `
    * { cursor: none !important; }

    #_cursor-main {
      position: fixed; width: 16px; height: 16px;
      border-radius: 50%; background: ${color};
      pointer-events: none; z-index: 99999;
      transform: translate(-50%, -50%);
      transition: transform 0.15s, opacity 0.15s;
    }
    #_cursor-ring {
      position: fixed; width: 36px; height: 36px;
      border-radius: 50%; border: 2px solid ${color};
      pointer-events: none; z-index: 99998; opacity: 0.55;
      transform: translate(-50%, -50%);
    }
    ._cursor-trail {
      position: fixed; border-radius: 50%;
      pointer-events: none; z-index: 99990;
      transform: translate(-50%, -50%);
    }
    ._cursor-burst {
      position: fixed; width: 6px; height: 6px;
      border-radius: 50%; background: ${color};
      pointer-events: none; z-index: 99995;
      transform: translate(-50%, -50%);
      animation: _cursorBurst 0.5s ease-out forwards;
    }
    ._cursor-ring-burst {
      position: fixed; border-radius: 50%;
      border: 2px solid ${color};
      pointer-events: none; z-index: 99995;
      transform: translate(-50%, -50%);
      animation: _cursorRing 0.45s ease-out forwards;
    }
    @keyframes _cursorBurst {
      0%   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
      100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2); }
    }
    @keyframes _cursorRing {
      0%   { width: 8px; height: 8px; opacity: 1; }
      100% { width: 64px; height: 64px; opacity: 0; margin-left: -28px; margin-top: -28px; }
    }
  `;
  document.head.appendChild(style);

  // --- buat elemen kursor ---
  const main = document.createElement("div");
  main.id = "_cursor-main";
  document.body.appendChild(main);

  const ringEl = document.createElement("div");
  ringEl.id = "_cursor-ring";
  document.body.appendChild(ringEl);

  // --- trail dots ---
  const trailDots = [];
  const trailPos = Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 }));

  for (let i = 0; i < TRAIL; i++) {
    const size = Math.max(3, 13 - i);
    const dot = document.createElement("div");
    dot.className = "_cursor-trail";
    dot.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      opacity:${(((TRAIL - i) / TRAIL) * 0.65).toFixed(2)};
      z-index:${99990 - i};
    `;
    document.body.appendChild(dot);
    trailDots.push(dot);
  }

  // --- state ---
  let mx = -200,
    my = -200,
    rx = -200,
    ry = -200;

  // --- mouse move ---
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    main.style.left = mx + "px";
    main.style.top = my + "px";
  });

  // --- hover effect pada elemen interaktif ---
  document.addEventListener("mouseover", (e) => {
    const tag = e.target.tagName;
    if (
      ["A", "BUTTON", "INPUT", "LABEL", "SELECT", "TEXTAREA"].includes(tag) ||
      e.target.getAttribute("role") === "button"
    ) {
      main.style.transform = "translate(-50%,-50%) scale(1.7)";
      main.style.opacity = "0.6";
    }
  });
  document.addEventListener("mouseout", (e) => {
    const tag = e.target.tagName;
    if (
      ["A", "BUTTON", "INPUT", "LABEL", "SELECT", "TEXTAREA"].includes(tag) ||
      e.target.getAttribute("role") === "button"
    ) {
      main.style.transform = "translate(-50%,-50%) scale(1)";
      main.style.opacity = "1";
    }
  });

  // --- klik effect ---
  document.addEventListener("click", (e) => {
    // ring expand
    const cr = document.createElement("div");
    cr.className = "_cursor-ring-burst";
    cr.style.left = e.clientX + "px";
    cr.style.top = e.clientY + "px";
    document.body.appendChild(cr);
    setTimeout(() => cr.remove(), 500);

    // partikel burst
    for (let i = 0; i < BURST; i++) {
      const angle = (i / BURST) * Math.PI * 2;
      const dist = 28 + Math.random() * 20;
      const p = document.createElement("div");
      p.className = "_cursor-burst";
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
  });

  // --- animation loop ---
  function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ringEl.style.left = rx + "px";
    ringEl.style.top = ry + "px";

    for (let i = TRAIL - 1; i > 0; i--) {
      trailPos[i].x = trailPos[i - 1].x;
      trailPos[i].y = trailPos[i - 1].y;
    }
    trailPos[0].x += (mx - trailPos[0].x) * 0.35;
    trailPos[0].y += (my - trailPos[0].y) * 0.35;

    trailDots.forEach((dot, i) => {
      dot.style.left = trailPos[i].x + "px";
      dot.style.top = trailPos[i].y + "px";
    });

    requestAnimationFrame(loop);
  }
  loop();
}

// Auto-init jika dipanggil langsung (opsional)
// initCursor({ color: '#7F77DD' });
