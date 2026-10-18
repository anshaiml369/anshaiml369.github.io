/* Research note: method row (done vs planned) and the scroll-linked results chart, in ink + one accent. */
(() => {
  "use strict";
  const { M, motion, T, $, $$, esc, scene } = window.Brand;
  const D = window.PORTFOLIO;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const INK = css("--ink"), INK2 = css("--ink-2"), INK3 = css("--ink-3"), RULE = css("--rule"), ACC = css("--accent"), WARN = css("--warn");

  const method = [
    ["Question", "How much does citation structure add over word features alone?", "done"],
    ["Hypothesis", "Linked papers share topics, so message passing should help.", "done"],
    ["Comparison", "GCN · GAT · MLP; validation-only tuning; five seeds.", "done"],
    ["Intervention", "Retrain on removed, halved and randomly rewired graphs.", "done"],
    ["Error analysis", "A checkpoint bug; a misleading earlier ablation.", "done"],
    ["Limits", "One dataset, one split, transductive, five seeds.", "done"],
    ["Next", "20 random splits; a homophily sweep.", "planned"]
  ];
  $("#method").innerHTML = method.map(([h, p, s], i) => `<li class="m-step ${s}"><span class="m-n">${String(i + 1).padStart(2, "0")}</span><b>${esc(h)}</b><span>${esc(p)}</span>${s === "planned" ? '<span class="m-tag">planned · not done</span>' : ""}</li>`).join("");

  const svg = $("#chart"), NS = "http://www.w3.org/2000/svg";
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };
  const mk = (n, at, txt) => { const e = document.createElementNS(NS, n); for (const k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; return e; };
  const conds = ["original", "drop50", "rewired", "no_edges"];
  const W = 640, H = 360, L = 172, R = 92, Tp = 18, Bt = 44, X = (v) => L + v * (W - L - R);
  let model = "gcn", focus = null, shown = false;
  function draw(animate) {
    const A = D.ablation; svg.replaceChildren();
    [0, .2, .4, .6, .8, 1].forEach((t) => {
      svg.append(mk("line", { x1: X(t), x2: X(t), y1: Tp, y2: H - Bt, stroke: RULE }));
      svg.append(mk("text", { x: X(t), y: H - Bt + 20, fill: INK3, "font-size": 12, "text-anchor": "middle" }, t.toFixed(1)));
    });
    svg.append(mk("text", { x: (L + W - R) / 2, y: H - 6, fill: INK3, "font-size": 12, "text-anchor": "middle" }, "Test accuracy · 1,000 papers"));
    const mm = mean(A.mlp);
    svg.append(mk("line", { x1: X(mm), x2: X(mm), y1: Tp, y2: H - Bt, stroke: INK2, "stroke-dasharray": "4 4" }));
    svg.append(mk("text", { x: X(mm) + 6, y: Tp + 12, fill: INK2, "font-size": 12 }, `MLP, no graph ${mm.toFixed(3)}`));
    const band = (H - Bt - Tp - 12) / conds.length;
    conds.forEach((c, i) => {
      const v = A[model][c], m = mean(v), s = sd(v), cy = Tp + 22 + band * i + band / 2 - 10;
      const g = mk("g", { class: `row${focus === c ? " focus" : ""}`, "data-c": c });
      g.append(mk("text", { x: L - 14, y: cy + 5, fill: INK, "font-size": 14, "text-anchor": "end" }, A.labels[c]));
      const bar = mk("rect", { x: L, y: cy - 10, height: 20, width: animate && motion ? 0 : X(m) - L, fill: c === "original" ? ACC : INK, opacity: c === "original" ? 1 : .78 });
      g.append(bar);
      g.append(mk("line", { x1: X(m - s), x2: X(m + s), y1: cy, y2: cy, stroke: INK, "stroke-width": 1.4 }));
      [m - s, m + s].forEach((e) => g.append(mk("line", { x1: X(e), x2: X(e), y1: cy - 6, y2: cy + 6, stroke: INK, "stroke-width": 1.4 })));
      v.forEach((p) => g.append(mk("circle", { cx: X(p), cy: cy + 20, r: 2.8, fill: "none", stroke: INK, "stroke-width": 1.1 })));
      g.append(mk("text", { x: X(m + s) + 9, y: cy + 5, fill: INK, "font-size": 13, "font-family": "Plex Mono, monospace" }, `${m.toFixed(3)} ± ${s.toFixed(3)}`));
      svg.append(g);
      if (animate && motion) M.animate(0, X(m) - L, { duration: .9, delay: i * .08, ease: T.ease, onUpdate: (w) => bar.setAttribute("width", w) });
    });
    svg.classList.toggle("has-focus", !!focus);
  }
  const seg = $(".tabs[aria-label=Model]");
  $$("button", seg).forEach((b) => b.addEventListener("click", () => {
    $$("button", seg).forEach((o) => o.setAttribute("aria-checked", String(o === b)));
    model = b.dataset.model; draw(true);
  }));
  seg.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const bs = $$("button", seg), i = bs.findIndex((b) => b.getAttribute("aria-checked") === "true"), n = bs[(i + 1) % 2]; n.click(); n.focus();
  });
  draw(false);
  const steps = $$(".step");
  scene((s) => {
    let best = null, bd = Infinity;
    steps.forEach((st) => { const r = st.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - s.vh / 2); if (d < bd) { bd = d; best = st; } });
    steps.forEach((st) => st.classList.toggle("active", st === best));
    if (!shown && svg.getBoundingClientRect().top < s.vh * .85) { shown = true; if (motion) draw(true); }
    const nf = best && bd < s.vh * .45 && best.dataset.focus ? best.dataset.focus : null;
    if (nf !== focus) { focus = nf; svg.classList.toggle("has-focus", !!focus); $$("#chart .row").forEach((g) => g.classList.toggle("focus", g.dataset.c === focus)); }
  });
})();
