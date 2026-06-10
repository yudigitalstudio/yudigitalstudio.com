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
