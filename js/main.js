// === helpers ===
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// === slide util ===
const slide = {
  down(el, dur = 200) {
    el.removeAttribute("hidden");
    el.style.display = "block";
    const h = el.scrollHeight;
    el.style.overflow = "hidden";
    el.style.maxHeight = "0px";
    el.style.transition = `max-height ${dur}ms ease`;
    requestAnimationFrame(() => (el.style.maxHeight = `${h}px`));
    const end = (e) => {
      if (e.propertyName !== "max-height") return;
      el.style.maxHeight = "none";
      el.style.overflow = "";
      el.style.transition = "";
      el.removeEventListener("transitionend", end);
    };
    el.addEventListener("transitionend", end);
  },
  up(el, dur = 200) {
    const h = el.scrollHeight;
    el.style.overflow = "hidden";
    el.style.maxHeight = `${h}px`;
    el.style.transition = `max-height ${dur}ms ease`;
    requestAnimationFrame(() => (el.style.maxHeight = "0px"));
    const end = (e) => {
      if (e.propertyName !== "max-height") return;
      el.setAttribute("hidden", "");
      el.style.overflow = "";
      el.style.transition = "";
      el.removeEventListener("transitionend", end);
    };
    el.addEventListener("transitionend", end);
  },
};

// === hamburger ===
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".js-btn");
  const targetElements = document.querySelectorAll(
    ".l-header__nav, .c-hamburger__line"
  );
  if (button) {
    button.addEventListener("click", () => {
      targetElements.forEach((el) => el.classList.toggle("open"));
    });
  }

  initAccordion();
});

// === accordion ===
function initAccordion() {
  const groups = $$("[data-accordion]");
  if (!groups.length) return;

  groups.forEach((acc, gIdx) => {
    const items = $$(".c-accordion__item", acc);

    items.forEach((item, i) => {
      const btn = $(".c-accordion__trigger", item);
      const panel = $(".c-accordion__panel", item);
      if (!btn || !panel) return;

      const pid = panel.id || `acc-${gIdx + 1}-panel-${i + 1}`;
      panel.id = pid;
      btn.setAttribute("aria-controls", pid);

      const expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) {
        panel.style.maxHeight = "none";
      } else {
        panel.setAttribute("hidden", "");
        panel.style.maxHeight = "0px";
        panel.style.overflow = "hidden";
        btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        isOpen ? slide.up(panel, 200) : slide.down(panel, 200);
      });
    });

    // 開いているパネルの高さをリセット
    window.addEventListener("resize", () => {
      $$('.c-accordion__trigger[aria-expanded="true"]', acc).forEach((b) => {
        const p = b
          .closest(".c-accordion__item")
          ?.querySelector(".c-accordion__panel");
        if (p) p.style.maxHeight = "none";
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".l-header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  });
});
