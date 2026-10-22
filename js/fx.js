/* FX (v7 "cinema"): intro curtain · 3D graph orb behind the name · giant word that grows on scroll ·
   system switcher card · 3D ring of the five systems turned by scroll · tilt cards · cursor spotlight ·
   scroll progress · drawn timeline. Motion off → everything renders once, flat and static. */
(() => {
  "use strict";
  const B = window.Brand, { motion, $, $$, clamp, scene } = B, D = window.PORTFOLIO;
  const fine = matchMedia("(pointer: fine)").matches;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const ACC = css("--accent"), INK = css("--ink");

  /* intro curtain — once per visit */
  const intro = $(".intro");
  B.introDone = new Promise((done) => {
    let seen = false; try { seen = sessionStorage.getItem("intro") === "1"; } catch { /* storage unavailable */ }
    if (!motion || seen) { intro.classList.add("gone"); done(); return; }
    try { sessionStorage.setItem("intro", "1"); } catch { /* storage unavailable */ }
    const count = $(".intro-count"), t0 = performance.now(), dur = 1100;
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      count.textContent = String(Math.round((1 - Math.pow(1 - k, 3)) * 100)).padStart(3, "0");
      if (k < 1) return requestAnimationFrame(step);
      intro.classList.add("open"); setTimeout(done, 350); setTimeout(() => intro.classList.add("gone"), 1100);
    };
    requestAnimationFrame(step);
  });

  /* hero orb — a 3D citation-style graph on a sphere; a message-passing pulse runs across it */
  const cv = $(".hero-orb"), ctx = cv.getContext("2d"), hero = $(".hero");
  const portrait = $(".hero-portrait"), pf = portrait && $(".pf", portrait);
  if (portrait) B.introDone.then(() => setTimeout(() => { portrait.classList.add("in"); setTimeout(() => portrait.classList.add("settled"), 1400); }, 120));
  const NN = 150, pts = [], edges = [];
  for (let i = 0; i < NN; i++) { // Fibonacci sphere, slightly jittered
    const y = 1 - (i / (NN - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996 + Math.sin(i) * .2;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  const adj = pts.map(() => []);
  pts.forEach((a, i) => {
    pts.map((b, j) => [j, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2]).sort((x, y) => x[1] - y[1]).slice(1, 4)
      .forEach(([j]) => { if (i < j || !adj[j].includes(i)) { edges.push([i, j]); adj[i].push(j); adj[j].push(i); } });
  });
  let W = 0, H = 0, rotY = 0, rotX = -.35, mx = 0, my = 0, tmx = 0, tmy = 0, heroP = 0, pulse = null;
  const size = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  const firePulse = (t) => {
    const src = Math.floor(Math.random() * NN), hop = new Array(NN).fill(99); hop[src] = 0;
    const q = [src]; while (q.length) { const u = q.shift(); for (const v of adj[u]) if (hop[v] > hop[u] + 1) { hop[v] = hop[u] + 1; q.push(v); } }
    pulse = { hop, t0: t };
    if (portrait) { portrait.classList.remove("ping"); void portrait.offsetWidth; portrait.classList.add("ping"); }
  };
  function drawOrb(t) {
    ctx.clearRect(0, 0, W, H);
    const R = W * .36 * (1 + heroP * .35), cx = W / 2 + mx * 18, cy = H / 2 + my * 18;
    const cy_ = Math.cos(rotY), sy = Math.sin(rotY), cx_ = Math.cos(rotX + my * .15), sx = Math.sin(rotX + my * .15);
    const P = pts.map(([x, y, z]) => {
      const x1 = x * cy_ + z * sy, z1 = -x * sy + z * cy_;
      const y2 = y * cx_ - z1 * sx, z2 = y * sx + z1 * cx_, f = 2.6 / (2.6 + z2);
      return [cx + x1 * R * f, cy + y2 * R * f, z2];
    });
    const k = pulse ? (t - pulse.t0) / 260 : -1;
    if (k > 14) pulse = null;
    ctx.lineWidth = 1;
    for (const [a, b] of edges) {
      const depth = (2 - (P[a][2] + P[b][2]) / 2) / 3, h = pulse ? Math.max(pulse.hop[a], pulse.hop[b]) : 99;
      const on = pulse && k >= h - 1 && k < h + .8;
      ctx.strokeStyle = on ? ACC : `rgba(242,237,228,${(.05 + depth * .16).toFixed(3)})`;
      ctx.globalAlpha = on ? .9 : 1;
      ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    P.forEach(([x, y, z], i) => {
      const depth = (1 - z) / 2, lit = pulse && k >= pulse.hop[i] && k < pulse.hop[i] + 2;
      ctx.fillStyle = lit || i % 23 === 0 ? ACC : INK;
      ctx.globalAlpha = lit ? 1 : .25 + depth * .6;
      ctx.beginPath(); ctx.arc(x, y, (lit ? 2.6 : 1.2) + depth * 1.8, 0, 6.283); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  addEventListener("resize", () => { size(); drawOrb(performance.now()); });
  size(); drawOrb(0);

  const word = $(".hero-word"), copy = $(".hero-copy");
  if (fine) addEventListener("pointermove", (e) => { tmx = e.clientX / innerWidth * 2 - 1; tmy = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  let nextPulse = 1500;
  if (motion) scene((s) => {
    heroP = clamp(s.y / hero.offsetHeight, 0, 1);
    if (heroP >= 1) return; // off screen: nothing to draw
    mx += (tmx - mx) * .05; my += (tmy - my) * .05;
    rotY += .0022 + Math.abs(s.vel) * .0009;
    if (s.t > nextPulse) { firePulse(s.t); nextPulse = s.t + 4200; }
    drawOrb(s.t);
    word.style.setProperty("--ws", (1 + heroP * .45).toFixed(3));
    copy.style.opacity = (1 - heroP * 1.5).toFixed(3);
    copy.style.transform = `translateY(${(-heroP * 70).toFixed(1)}px)`;
    cv.style.opacity = (1 - heroP * .9).toFixed(3);
    if (pf) { // drifts with the orb, then lifts and fades as the hero scrolls away
      pf.style.setProperty("--px", (mx * 26).toFixed(1) + "px");
      pf.style.setProperty("--py", (my * 26 - heroP * 60).toFixed(1) + "px");
      if (portrait.classList.contains("in")) pf.style.setProperty("--ps", (1 + heroP * .12).toFixed(3));
      portrait.style.opacity = (1 - heroP * 1.1).toFixed(3);
    }
  });

  /* switcher card — one system at a time (read from the contents list work.js rendered) */
  const sys = $$("#contents a").map((a) => ({ href: a.getAttribute("href"), n: $(".c-n", a).textContent, name: $(".c-name", a).firstChild.textContent, dom: $(".c-dom", a).textContent, fig: $(".c-fig", a).textContent }));
  const card = $(".sw-card"); let si = 0, auto = null;
  const show = (d) => {
    si = (si + d + sys.length) % sys.length; const x = sys[si];
    card.href = x.href; $(".sw-n", card).textContent = `${x.n} / 0${sys.length}`; $(".sw-name", card).textContent = x.name;
    $(".sw-dom", card).textContent = x.dom.split(" · ")[0]; $(".sw-fig", card).textContent = x.fig;
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
  };
  const restart = () => { clearInterval(auto); if (motion) auto = setInterval(() => { if (scrollY < innerHeight) show(1); }, 4500); };
  $$(".sw-arrow").forEach((b) => b.addEventListener("click", () => { show(+b.dataset.dir); restart(); }));
  show(0); restart();

  /* 3D ring — five posters on a cylinder, turned by scrolling through the pinned section */
  const ring = $("#ring"), sysSec = $("#systems"), links = $$("#contents a");
  ring.innerHTML = D.systems.map((s, i) => `<figure style="--n:${i}" data-href="#p-${s.id}"><img src="assets/posters/${s.id}.jpg?v=2" alt="" loading="lazy"><figcaption>${B.esc(s.name)}<span>${s.n}</span></figcaption></figure>`).join("");
  const figs = $$("figure", ring);
  ring.addEventListener("click", (e) => { const f = e.target.closest("figure"); if (f) B.scrollTo(f.dataset.href); });
  let front = -1;
  if (motion) scene((s) => {
    const r = sysSec.getBoundingClientRect();
    if (r.bottom < 0 || r.top > s.vh) return;
    const p = clamp(-r.top / (r.height - s.vh), 0, 1), n = figs.length;
    ring.style.setProperty("--ry", `${(-p * 360 * (n - 1) / n).toFixed(2)}deg`);
    ring.style.setProperty("--rx", `${(-12 + p * 8 + s.vel * .08).toFixed(2)}deg`);
    const f = Math.round(p * (n - 1));
    if (f !== front) { front = f; figs.forEach((g, i) => g.classList.toggle("front", i === f)); links.forEach((a, i) => a.classList.toggle("on", i === f)); }
  });

  /* figure cards tilt toward the pointer; a soft light follows it */
  if (motion && fine) {
    document.addEventListener("pointermove", (e) => {
      const box = e.target.closest && e.target.closest(".fig-box"); if (!box) return;
      const r = box.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      box.style.setProperty("--ty", `${((px - .5) * 6).toFixed(2)}deg`); box.style.setProperty("--tx", `${((.5 - py) * 5).toFixed(2)}deg`);
      box.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`); box.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    }, { passive: true });
    document.addEventListener("pointerout", (e) => { const box = e.target.closest && e.target.closest(".fig-box"); if (box && !box.contains(e.relatedTarget)) { box.style.setProperty("--tx", "0deg"); box.style.setProperty("--ty", "0deg"); } });
    const spot = $(".spot"); let sx = innerWidth / 2, sy = innerHeight / 3, tx = sx, ty = sy;
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; spot.classList.add("on"); }, { passive: true });
    document.addEventListener("pointerleave", () => spot.classList.remove("on"));
    scene(() => { sx += (tx - sx) * .12; sy += (ty - sy) * .12; spot.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`; });
    B.magnetic($$(".btn-pill, .sw-arrow"));
  }

  /* scroll progress · timeline line draws itself · big project numbers drift */
  const bar = $(".progress"), tls = $$(".tl-list"), items = $$(".work-item");
  if (motion) scene((s) => {
    bar.style.setProperty("--sp", (s.y / (document.documentElement.scrollHeight - s.vh || 1)).toFixed(4));
    tls.forEach((l) => l.style.setProperty("--lp", B.progress(l, .8, .5).toFixed(3)));
    items.forEach((it) => { const r = it.getBoundingClientRect(); if (r.bottom > 0 && r.top < s.vh) it.style.setProperty("--py", `${((r.top - s.vh / 2) * -.12).toFixed(1)}px`); });
  });
})();
