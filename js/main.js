/* Portfolio interactions: mobile navigation, active-section highlighting, click-to-load videos,
   and the hero's citation-graph canvas. Everything degrades gracefully: the page is fully usable
   without JavaScript, and the canvas is purely decorative. */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  /* ---------- Active link for in-page sections (home nav and case-study contents) ---------- */
  function trackSections(linkSelector) {
    const links = [...document.querySelectorAll(linkSelector)].filter((a) => a.hash && a.pathname === location.pathname);
    const map = new Map();
    links.forEach((a) => {
      const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (target) map.set(target, a);
    });
    if (!map.size || !("IntersectionObserver" in window)) return;
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
      const current = [...map.keys()].find((s) => visible.has(s));
      map.forEach((a, s) => (s === current ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    }, { rootMargin: "-30% 0px -60% 0px" });
    map.forEach((_, s) => io.observe(s));
  }
  trackSections(".nav-list a");
  trackSections(".toc a");

  /* ---------- Click-to-load demo videos (nothing heavy loads until asked) ---------- */
  document.querySelectorAll(".video-play[data-src]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const video = document.createElement("video");
      video.src = btn.dataset.src;
      video.controls = true;
      video.playsInline = true;
      video.preload = "auto";
      if (btn.dataset.poster) video.poster = btn.dataset.poster;
      video.setAttribute("aria-label", btn.dataset.label || "Demo video");
      btn.replaceWith(video);
      video.focus();
      const p = video.play();
      if (p && p.catch) p.catch(() => {}); // user can press play if autoplay is blocked
    });
  });

  /* ---------- Hero canvas: real Cora citation subgraph (decorative) ---------- */
  const canvas = document.querySelector(".hero-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const COLORS = ["#E07A8F", "#C9B458", "#7F8CF5", "#4FC1B3", "#E89B4A", "#7CC4F0", "#B07CD8"];
  let graph = null, w = 0, h = 0, dpr = 1, raf = 0, running = false, t0 = performance.now();
  const pulses = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Place the graph in the right part of the hero on wide screens, centred on narrow ones.
  function project([x, y], t) {
    const wide = w > 900;
    const gw = wide ? w * 0.55 : w * 0.95, gh = h * 0.86;
    const ox = wide ? w * 0.42 : w * 0.025, oy = h * 0.07;
    const drift = reduceMotion.matches ? 0 : 1;
    return [ox + x * gw + Math.sin(t * 0.0004 + y * 9) * 3 * drift, oy + y * gh + Math.cos(t * 0.00035 + x * 9) * 3 * drift];
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const pts = graph.nodes.map((n) => project(n, t));
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(160, 180, 200, 0.10)";
    ctx.beginPath();
    graph.edges.forEach(([a, b]) => { ctx.moveTo(pts[a][0], pts[a][1]); ctx.lineTo(pts[b][0], pts[b][1]); });
    ctx.stroke();
    graph.nodes.forEach((n, i) => {
      ctx.fillStyle = COLORS[n[2]] || "#9AA4B2";
      ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], 2.2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (reduceMotion.matches) return;
    // A few "messages" travelling along citation edges, echoing GCN message passing
    if (pulses.length < 14 && Math.random() < 0.08) {
      pulses.push({ e: graph.edges[(Math.random() * graph.edges.length) | 0], start: t, dur: 1400 + Math.random() * 1200 });
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i], k = (t - p.start) / p.dur;
      if (k >= 1) { pulses.splice(i, 1); continue; }
      const [a, b] = p.e, x = pts[a][0] + (pts[b][0] - pts[a][0]) * k, y = pts[a][1] + (pts[b][1] - pts[a][1]) * k;
      ctx.fillStyle = "rgba(63, 208, 232," + (0.9 * Math.sin(Math.PI * k)).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
  function start() { if (running || !graph) return; running = true; if (reduceMotion.matches) { draw(t0); running = false; } else raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  fetch(canvas.dataset.src)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => {
      graph = data;
      resize();
      let inView = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([en]) => { inView = en.isIntersecting; inView && !document.hidden ? start() : stop(); }).observe(canvas);
      }
      document.addEventListener("visibilitychange", () => (document.hidden ? stop() : inView && start()));
      window.addEventListener("resize", () => { resize(); if (!running) draw(performance.now()); }, { passive: true });
      reduceMotion.addEventListener("change", () => { stop(); start(); });
      start();
    })
    .catch(() => { canvas.remove(); });
})();
