/* Site shell: header, mobile menu, sources lens, motion switch, and the one motion language
   (heading lines rise · content enters · nothing else moves on its own). */
(() => {
  "use strict";
  const B = window.Brand, { motion, $, $$, scene, revealOnEnter, store } = B;

  const lens = $("#lens");
  const setLens = (on) => { document.body.classList.toggle("lens", on); lens.setAttribute("aria-pressed", String(on)); };
  lens.addEventListener("click", () => setLens(!document.body.classList.contains("lens")));
  addEventListener("keydown", (e) => {
    if ((e.key === "e" || e.key === "E") && !e.metaKey && !e.ctrlKey && !e.altKey && !/input|textarea|select/i.test(e.target.tagName)) setLens(!document.body.classList.contains("lens"));
    if (e.key === "Escape") closeMenu();
  });
  const mBtn = $("#motion");
  mBtn.setAttribute("aria-pressed", String(motion));
  mBtn.addEventListener("click", () => { store.set("motion", motion ? "off" : "on"); location.reload(); });

  const menu = $("#menu"), menuBtn = $(".menu-btn");
  const closeMenu = () => { menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.addEventListener("click", () => { const o = !menu.classList.contains("open"); menu.classList.toggle("open", o); menuBtn.setAttribute("aria-expanded", String(o)); });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });

  // reveals: headings rise line by line; content blocks enter once
  const rises = $$(".rise"), enters = $$(".enter");
  if (!motion) { rises.concat(enters).forEach((e) => e.classList.add("in")); }
  else {
    revealOnEnter(rises.filter((r) => !r.closest(".hero")));
    revealOnEnter(enters.filter((r) => !r.closest(".hero")));
  }

  const top = $("#top-bar"), links = $$(".menu a"), targets = links.map((a) => $(a.getAttribute("href")));
  scene((s) => {
    top.classList.toggle("scrolled", s.y > 8);
    if (motion) { if (s.y > 400 && s.dy > 3) top.classList.add("hide"); if (s.dy < -3 || s.y < 400) top.classList.remove("hide"); }
    let n = -1; targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < s.vh * .4) n = i; });
    links.forEach((a, i) => a.toggleAttribute("aria-current", i === n));
  });

  // certificates: a row of thumbnails; each opens full size with its caption
  const C = window.PORTFOLIO.certificates;
  $("#certs").innerHTML = C.map((c, i) => `<li><button class="cert-thumb" type="button" data-i="${i}" aria-label="Open certificate: ${B.esc(c.t)}"><img src="assets/certs/${c.f}" alt="" loading="lazy"></button><span>${B.esc(c.t)}</span></li>`).join("");
  $("#certs").addEventListener("click", (e) => {
    const b = e.target.closest(".cert-thumb"); if (!b) return; const c = C[+b.dataset.i];
    B.openMedia(`<img src="assets/certs/${c.f}" alt="${B.esc(c.cap)}">`, c.cap);
  });

  B.start();
  // opening: the name rises line by line, then the introduction and the contents enter
  if (motion) {
    const go = () => {
      $$(".hero .rise").forEach((r, i) => setTimeout(() => r.classList.add("in"), 120 + i * 140));
      $$(".hero .enter").forEach((e, i) => setTimeout(() => e.classList.add("in"), 520 + i * 160));
    };
    let done = false; const once = () => { if (!done) { done = true; go(); } };
    B.introDone.then(() => {
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(once);
      setTimeout(once, 900);
    });
  }
})();
