/* Core: motion tokens, preferences, smooth scroll, one frame loop, reveal + interaction helpers.
   Chapters register scenes with Brand.scene(fn); each runs once per animation frame with scroll state. */
(() => {
  "use strict";
  const M = window.Motion || null;
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } }
  };
  const saved = store.get("motion");
  const motion = !!M && (saved ? saved === "on" : !matchMedia("(prefers-reduced-motion: reduce)").matches);
  root.classList.add(motion ? "motion-on" : "motion-off");

  /* Motion language (UI UX Pro Max: micro-interactions 150–300 ms; cinematic 400–600 ms+; never fast & cheap). */
  const T = {
    fast: 0.2,            // hover, press, toggles
    base: 0.45,           // standard entrances
    cinematic: 0.9,       // chapter titles, reveals
    slow: 1.2,            // opening sequence
    ease: [0.22, 1, 0.36, 1],       // expo-out: things arriving
    easeInOut: [0.76, 0, 0.24, 1],  // curtains, radial reveals
    spring: { type: "spring", stiffness: 220, damping: 22 },
    springSoft: { type: "spring", stiffness: 120, damping: 16 },
    stagger: 0.06,
    enter: 0.88           // element reveals when its top passes 88% of the viewport
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const progress = (el, start = 1, end = 0) => { // 0 when el top is at start*vh, 1 when el bottom reaches end*vh
    const r = el.getBoundingClientRect(), vh = innerHeight;
    return clamp((start * vh - r.top) / (r.height + (start - end) * vh), 0, 1);
  };

  /* smooth scroll — one engine, native scroll position, anchors keep working */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis; // used by automated tests to jump instantly
  }
  function scrollTo(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -8, duration: 1.3 });
    else el.scrollIntoView({ behavior: "auto" });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    scrollTo(id);
    history.replaceState(null, "", id);
    const t = $(id); // move focus for keyboard and screen-reader users
    if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "-1");
    t.focus({ preventScroll: true });
  });

  /* frame loop */
  const scenes = [];
  let lastY = scrollY, vel = 0, running = true;
  function tick(t) {
    const y = scrollY, dy = y - lastY; lastY = y; vel += (dy - vel) * 0.1;
    const state = { y, dy, vel, vh: innerHeight, vw: innerWidth, t };
    for (const s of scenes) s(state);
  }
  function loop(t) {
    if (!running) return;
    lenis && lenis.raf(t);
    tick(t);
    requestAnimationFrame(loop);
  }
  document.addEventListener("visibilitychange", () => { // nothing animates in a hidden tab
    running = !document.hidden;
    if (running && motion) requestAnimationFrame(loop);
  });

  /* reveals: checked every frame (no observer that can fail to fire), so nothing can stay hidden */
  const pending = [];
  function revealOnEnter(els, onEnter) { els.forEach((el) => pending.push({ el, onEnter })); }
  function revealScene(s) {
    for (let i = pending.length - 1; i >= 0; i--) {
      const p = pending[i];
      if (p.el.getBoundingClientRect().top < s.vh * T.enter) { pending.splice(i, 1); p.el.classList.add("in"); p.onEnter && p.onEnter(p.el); }
    }
  }

  /* masked title + staggered groups */
  function staggerIn(container, selector) {
    const items = $$(selector, container);
    if (!motion) return;
    items.forEach((i) => { i.style.opacity = 0; });
    revealOnEnter([container], () => M.animate(items, { opacity: [0, 1], y: [28, 0] }, { duration: T.base + 0.2, delay: M.stagger(T.stagger), ease: T.ease }));
  }

  function countUp(el, to, { dec = 0, prefix = "", suffix = "" } = {}) {
    if (!motion) { el.textContent = prefix + to.toFixed(dec) + suffix; return; }
    M.animate(0, to, { duration: 1.4, ease: T.ease, onUpdate: (v) => { el.textContent = prefix + v.toFixed(dec) + suffix; } });
  }

  function magnetic(els) {
    if (!motion || !matchMedia("(pointer: fine)").matches) return;
    els.forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        M.animate(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.3 }, T.spring);
      });
      el.addEventListener("pointerleave", () => M.animate(el, { x: 0, y: 0 }, T.springSoft));
    });
  }

  /* media dialog (recorded runs, screenshots) */
  function openMedia(html, caption) {
    const d = $("#media");
    $("#media-body").innerHTML = html;
    $("#media-cap").textContent = caption;
    d.showModal();
    const v = $("video", d); v && v.play().catch(() => {});
  }
  $("#media").addEventListener("close", () => { $$("#media video").forEach((v) => v.pause()); });

  window.Brand = {
    M, motion, T, $, $$, esc, clamp, progress, store, lenis, scrollTo,
    scene(fn) { scenes.push(fn); }, revealOnEnter, staggerIn, countUp, magnetic, openMedia,
    start() {
      scenes.push(revealScene);
      if (motion) { requestAnimationFrame(loop); return; }
      // without motion nothing waits for animation frames: state follows ordinary scroll events
      const now = () => tick(performance.now());
      addEventListener("scroll", now, { passive: true }); addEventListener("resize", now); now();
    }
  };
})();
