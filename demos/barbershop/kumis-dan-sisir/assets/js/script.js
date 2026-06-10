window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");

  if (window.scrollY > 50) {
    nav.classList.add("nav-scrolled");
  } else {
    nav.classList.remove("nav-scrolled");
  }
});
