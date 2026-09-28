// Basic page logic (Phase 3): mobile menu, active section link, header scroll state.
(() => {
  "use strict";

  const desktopQuery = window.matchMedia("(min-width: 48rem)");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  const navbar = toggle && toggle.closest(".navbar");
  const header = document.querySelector(".site-header");
  const navItems = [...document.querySelectorAll('.navbar-links a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(({ section }) => section);

  const setMenuOpen = (open) => {
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  };
  const isMenuOpen = () => toggle?.getAttribute("aria-expanded") === "true";

  if (toggle && menu && navbar) {
    setMenuOpen(false);
    navbar.classList.add("is-enhanced");
    toggle.addEventListener("click", () => setMenuOpen(!isMenuOpen()));

    navbar.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !isMenuOpen()) return;
      setMenuOpen(false);
      toggle.focus();
    });

    document.addEventListener("click", (event) => {
      if (isMenuOpen() && !navbar.contains(event.target)) setMenuOpen(false);
    });

    desktopQuery.addEventListener("change", (event) => {
      if (event.matches) setMenuOpen(false);
    });
  }

  let currentLink = null;
  const updateScrollState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
    const activeLine = window.innerHeight * 0.35;
    let nextLink = null;

    for (const { link, section } of navItems) {
      if (section.getBoundingClientRect().top <= activeLine) nextLink = link;
    }

    const atBottom =
      window.scrollY > 0 &&
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom && navItems.length) nextLink = navItems.at(-1).link;

    if (nextLink === currentLink) return;
    currentLink?.removeAttribute("aria-current");
    nextLink?.setAttribute("aria-current", "location");
    currentLink = nextLink;
  };

  let framePending = false;
  const scheduleScrollUpdate = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => {
      framePending = false;
      updateScrollState();
    });
  };

  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollUpdate);
  window.addEventListener("load", scheduleScrollUpdate);
  updateScrollState();
})();
