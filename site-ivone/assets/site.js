{
const WA = "5541997730757";
const top = document.querySelector(".top");
const onScroll = () => top && top.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, {passive: true}); onScroll();

const menu = document.querySelector(".menu"), nav = document.querySelector(".nav");
if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); } });
}

let io = null;
const watch = root => {
  const els = root.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
  if (!io) io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), {rootMargin: "0px 0px -8% 0px"});
  els.forEach(el => io.observe(el));
};

document.addEventListener("click", e => {
  const b = e.target.closest("[data-map]");
  if (!b) return;
  const box = b.closest(".map");
  const f = document.createElement("iframe");
  f.src = b.dataset.map; f.loading = "lazy"; f.title = "Mapa da Casa de Repouso Ivone";
  f.referrerPolicy = "no-referrer-when-downgrade";
  box.appendChild(f); b.remove();
});

document.querySelectorAll("form[data-wa]").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const lines = [form.dataset.wa];
    form.querySelectorAll("[name]").forEach(el => {
      const v = (el.value || "").trim();
      if (v) lines.push(el.dataset.label + ": " + v);
    });
    const url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    const done = form.nextElementSibling;
    if (done && done.classList.contains("done")) {
      const a = done.querySelector("a"); if (a) a.href = url;
      done.classList.add("show");
    }
    try { window.open(url, "_blank", "noopener"); } catch (err) {}
  });
});

if (window.REVIEW) {
  document.querySelectorAll("form[data-netlify]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault(); location.hash = "obrigado";
  }));
  const pages = [...document.querySelectorAll("[data-page]")];
  const show = () => {
    let id = decodeURIComponent(location.hash.slice(1)) || "inicio";
    if (!pages.some(p => p.dataset.page === id)) id = "inicio";
    pages.forEach(p => p.hidden = p.dataset.page !== id);
    const pg = pages.find(p => p.dataset.page === id);
    document.title = pg.dataset.title;
    document.querySelectorAll(".nav a").forEach(a => {
      const h = a.getAttribute("href").slice(1);
      if (h === id || (id.startsWith("blog") && h === "blog")) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    pg.querySelectorAll(".hero").forEach(h => { h.classList.remove("hero-in"); void h.offsetWidth; h.classList.add("hero-in"); });
    watch(pg);
  };
  window.addEventListener("hashchange", show); show();
} else {
  document.querySelectorAll(".hero").forEach(h => h.classList.add("hero-in"));
  watch(document);
}
}
