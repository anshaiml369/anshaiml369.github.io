/* Work: five equal "figure spreads". Each project keeps its own visual form (graph · pipeline · text ·
   probability against a threshold · stage timings), all drawn in the same ink + one accent. */
(() => {
  "use strict";
  const { M, motion, T, $, $$, esc, clamp, scene, revealOnEnter, countUp } = window.Brand;
  const B = window.Brand, D = window.PORTFOLIO, E = window.EVIDENCE;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const INK = css("--ink"), INK3 = css("--ink-3"), RULE = css("--rule-2"), ACC = css("--accent");

  const meta = {
    graphmind: { dom: "Graph learning · node classification", fig: "0.792 accuracy", q: "Can 140 labelled papers and their citation links classify 2,708?" },
    scholaryx: { dom: "LLM agents · tool use", fig: "42.7 s per run", q: "Can a fixed chain of agents write a sourced report — and show every step?" },
    moodalyx: { dom: "NLP · sequence classification", fig: "0.880 macro-F1", q: "What does a sequence model read in a sentence — and where does it fail?" },
    creditcompass: { dom: "Tabular ML · calibration", fig: "0.953 ROC-AUC", q: "Can a default probability be taken at face value?" },
    verbalyx: { dom: "Speech · retrieval-augmented generation", fig: "4.5% WER", q: "Can you question a recording and check the answer against what was said?" }
  };

  // contents index in the hero — the five systems, equal weight
  $("#contents").innerHTML = D.systems.map((s) => `
    <li><a href="#p-${s.id}"><span class="c-n">${s.n}</span><span class="c-name">${esc(s.name)}<span class="c-dom">${esc(meta[s.id].dom)}</span></span><span class="c-fig">${esc(meta[s.id].fig)}</span></a></li>`).join("");

  const figure = {
    graphmind: `<div class="fig-top"><span class="label">Cora · 200-paper neighbourhood of paper 1358</span><button class="btn-line" type="button" data-act="pass">Pass messages</button></div>
      <canvas class="gm-canvas" role="img" aria-label="Citation graph of 200 Cora papers around paper 1358, shaded by true topic"></canvas>`,
    scholaryx: `<div class="fig-top"><span class="label">One measured run · gpt-4o-mini</span><button class="btn-line" type="button" data-act="run">Replay at 8×</button></div>
      <div class="pipe"></div><p class="pipe-total"><b class="sx-total">0.0 s</b> of 42.7 s · 5,897 tokens · $0.0018</p>`,
    moodalyx: `<div class="fig-top"><span class="label">Live API output</span><div class="tabs md-tabs" role="tablist" aria-label="Example sentences"></div></div>
      <p class="md-text" aria-live="polite"></p><div class="md-bars"></div><p class="md-note"></p>`,
    creditcompass: `<div class="fig-top"><span class="label">Live API output</span><div class="tabs cc-tabs" role="tablist" aria-label="Example applicants"></div></div>
      <dl class="cc-inputs"></dl>
      <div class="cc-scale" aria-hidden="true"><div class="cc-track"><span class="cc-thr"></span><span class="cc-needle"></span></div><div class="cc-ticks"><span>0</span><span>0.5</span><span>1</span></div></div>
      <p class="cc-out" aria-live="polite"></p><p class="cc-note">A statistical estimate from one public dataset — not a credit score or a lending decision.</p>`,
    verbalyx: `<div class="fig-top"><span class="label">One 88 s synthetic meeting</span><button class="btn-line" type="button" data-act="ask">Ask again</button></div>
      <div class="vx-stages"></div>
      <div class="vx-qa"><p class="vx-q"><span>Question</span><b></b></p><p class="vx-a"><span>Answer</span><b></b></p><p class="vx-ev"><span>Evidence</span><i></i></p></div>`
  };
  const caption = {
    graphmind: "Shade = true topic; hover a paper to read it. Passing messages shows what two GCN layers see: two hops.",
    scholaryx: "Four stages in a fixed order. Stage times are measured from one live run on the topic “CRISPR gene editing”.",
    moodalyx: "Three sentences sent to the live model on 17 Oct 2026, including one it gets confidently wrong.",
    creditcompass: "Two applicants sent to the live model on 17 Oct 2026; the needle is the predicted default probability.",
    verbalyx: "Stage times measured on a Mac; the question was answered on the hosted demo, with the passage it used."
  };

  $("#work-list").innerHTML = D.systems.map((s, i) => `
    <article class="work-item" id="p-${s.id}" data-n="${s.n}" aria-labelledby="w-${s.id}">
      <div class="w-text enter">
        <span class="w-n">${s.n} / 05</span>
        <h3 class="w-name" id="w-${s.id}">${esc(s.name)}</h3>
        <p class="w-dom">${esc(meta[s.id].dom)}</p>
        <p class="w-q">${esc(meta[s.id].q)}</p>
        <p class="w-line">${esc(s.line)}</p>
        <dl class="w-metrics">${s.metrics.map((m) => `<div data-ev="${m.ev}" data-src="${esc(m.src)}"><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join("")}</dl>
        <div class="w-more">
          <details><summary>How it works</summary><p>${esc(s.method)}</p></details>
          <details><summary>Limitations</summary><p>${esc(s.limits)}</p></details>
        </div>
        <div class="w-links">
          <a class="link-arrow" href="${s.demo}" target="_blank" rel="noopener">Live demo ↗</a>
          <a class="link-arrow" href="${s.repo}" target="_blank" rel="noopener">Source ↗</a>
          <button class="link-arrow" type="button" data-video="${s.id}">Recorded run</button>
        </div>
      </div>
      <figure class="fig enter">
        <div class="fig-box stage-${s.id}">${figure[s.id]}</div>
        <figcaption><b>Fig. ${i + 1}</b>${esc(caption[s.id])}</figcaption>
      </figure>
    </article>`).join("");

  $("#work-list").addEventListener("click", (e) => {
    const v = e.target.closest("[data-video]"); if (!v) return;
    const s = D.systems.find((x) => x.id === v.dataset.video);
    B.openMedia(`<video src="recordings/${s.id}.mp4?v=2" poster="assets/posters/${s.id}.jpg?v=2" controls playsinline></video>`, `${s.name} — recorded run of the real application.`);
  });

  /* GraphMind — the real neighbourhood; message passing on demand */
  (() => {
    const st = $(".stage-graphmind"), c = $("canvas", st), ctx = c.getContext("2d");
    const G = E.cora, N = G.nodes.length, adj = Array.from({ length: N }, () => []);
    G.edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    const hop = new Array(N).fill(Infinity); hop[0] = 0;
    const q = [0]; while (q.length) { const u = q.shift(); for (const v of adj[u]) if (hop[v] === Infinity) { hop[v] = hop[u] + 1; q.push(v); } }
    const shade = ["#8c8579", "#c9c1b3", INK, "#a69e90", "#6f685d", "#e2d9c8", "#7d9bb5"];
    const counts = {}; G.nodes.forEach((n) => { counts[n[2]] = (counts[n[2]] || 0) + 1; });
    const lg = document.createElement("p"); lg.className = "gm-legend";
    lg.innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span><i style="background:${shade[k]}"></i>${esc(G.classes[k].replace(/_/g, " "))} ${v}</span>`).join("");
    c.after(lg);
    let w = 0, h = 0, wave = -1, t0 = 0, hover = -1;
    const P = (n) => [16 + n[0] * (w - 32), 14 + n[1] * (h - 28)];
    const size = () => { const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); draw(performance.now()); };
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const k = wave < 0 ? -1 : (t - t0) / 1000;
      for (const [a, b] of G.edges) {
        const [x1, y1] = P(G.nodes[a]), [x2, y2] = P(G.nodes[b]), hh = Math.max(hop[a], hop[b]);
        const on = k >= hh - 1 && k < hh + 1.2;
        ctx.strokeStyle = on ? ACC : "rgba(242,237,228,.14)"; ctx.lineWidth = on ? 1.2 : .6;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      G.nodes.forEach((n, i) => {
        const [x, y] = P(n);
        ctx.globalAlpha = wave < 0 || k >= hop[i] ? 1 : .3;
        ctx.fillStyle = i === 0 ? ACC : shade[n[2]];
        ctx.beginPath(); ctx.arc(x, y, i === 0 ? 5.5 : i === hover ? 5 : 2.8, 0, 6.283); ctx.fill();
        ctx.globalAlpha = 1;
      });
      const [cx, cy] = P(G.nodes[0]); ctx.strokeStyle = ACC; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, 6.283); ctx.stroke();
      if (hover >= 0) {
        const [x, y] = P(G.nodes[hover]), label = `${hover === 0 ? "Paper 1358 · " : ""}hop ${hop[hover]} · ${G.classes[G.nodes[hover][2]].replace(/_/g, " ")}`;
        ctx.font = '400 12px "Plex Mono", monospace'; const tw = ctx.measureText(label).width;
        const bx = clamp(x + 10, 4, w - tw - 18), by = clamp(y - 28, 4, h - 24);
        ctx.fillStyle = INK; ctx.fillRect(bx, by, tw + 12, 20); ctx.fillStyle = "#0c0b0a"; ctx.fillText(label, bx + 6, by + 14);
      }
      if (wave >= 0 && k > 3.4) wave = -1;
    }
    $("[data-act=pass]", st).addEventListener("click", () => { wave = 0; t0 = performance.now(); });
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      let best = -1, bd = 12; G.nodes.forEach((n, i) => { const [x, y] = P(n), d = Math.hypot(x - px, y - py); if (d < bd) { bd = d; best = i; } });
      if (best !== hover) { hover = best; draw(performance.now()); }
    });
    c.addEventListener("pointerleave", () => { hover = -1; draw(performance.now()); });
    addEventListener("resize", size); size();
    scene((s) => { if (wave >= 0) { const r = c.getBoundingClientRect(); if (r.bottom > 0 && r.top < s.vh) draw(performance.now()); } });
  })();

  /* Scholaryx — the measured run, stage by stage */
  (() => {
    const st = $(".stage-scholaryx"), pipe = $(".pipe", st), total = $(".sx-total", st), S = E.scholaryx.stages;
    pipe.innerHTML = S.map(([n, d, sec], i) => `<div class="pipe-node"><span class="pipe-n">0${i + 1}</span><b>${esc(n)}</b><span class="pipe-d">${esc(d)}</span><span class="pipe-t">${sec.toFixed(1)} s</span><span class="pipe-bar"><i></i></span></div>`).join("");
    const nodes = $$(".pipe-node", pipe); let token = 0;
    async function run() {
      const my = ++token; let acc = 0;
      nodes.forEach((n) => { n.classList.remove("active"); $(".pipe-bar i", n).style.transform = "scaleX(0)"; });
      for (let i = 0; i < S.length; i++) {
        if (my !== token) return;
        const n = nodes[i], sec = S[i][2], dur = sec / 8;
        n.classList.add("active");
        if (motion) await Promise.all([
          M.animate($(".pipe-bar i", n), { scaleX: [0, 1] }, { duration: dur, ease: "linear" }),
          M.animate(acc, acc + sec, { duration: dur, ease: "linear", onUpdate: (v) => { total.textContent = `${v.toFixed(1)} s`; } })]);
        else $(".pipe-bar i", n).style.transform = "scaleX(1)";
        acc += sec; n.classList.remove("active");
      }
      total.textContent = "42.7 s";
    }
    $("[data-act=run]", st).addEventListener("click", run);
    if (motion) revealOnEnter([st], () => run()); else run();
  })();

  /* Moodalyx — real probabilities, including a confident mistake */
  (() => {
    const st = $(".stage-moodalyx"), tabs = $(".md-tabs", st), text = $(".md-text", st), bars = $(".md-bars", st), note = $(".md-note", st);
    const L = E.live.moodalyx, labels = ["sadness", "joy", "love", "anger", "fear", "surprise"];
    tabs.innerHTML = L.map((x, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${i === 2 ? "Failure" : `Example ${i + 1}`}</button>`).join("");
    bars.innerHTML = labels.map((l) => `<div class="md-row" data-l="${l}"><span>${l}</span><span class="md-track"><i></i></span><b>0.000</b></div>`).join("");
    function show(i) {
      const x = L[i];
      $$("button", tabs).forEach((b, j) => b.setAttribute("aria-selected", String(j === i)));
      text.textContent = `“${x.text}”`;
      note.textContent = i === 2 ? "Wrong, and confident: a happy sentence labelled “fear” at 0.79. It predicts a dataset label, not anyone’s emotional state." : `Predicted “${x.label}” with probability ${x.confidence.toFixed(3)}.`;
      note.classList.toggle("is-fail", i === 2);
      labels.forEach((l, j) => {
        const row = $(`[data-l=${l}]`, bars), p = x.probs[l] || 0;
        row.classList.toggle("top", l === x.label && i !== 2); row.classList.toggle("fail", i === 2 && l === x.label);
        if (motion) { M.animate($("i", row), { scaleX: p }, { duration: .7, delay: j * .04, ease: T.ease }); countUp($("b", row), p, { dec: 3 }); }
        else { $("i", row).style.transform = `scaleX(${p})`; $("b", row).textContent = p.toFixed(3); }
      });
    }
    tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
    if (motion) revealOnEnter([st], () => show(0)); else show(0);
  })();

  /* CreditCompass — probability against the decision threshold */
  (() => {
    const st = $(".stage-creditcompass"), tabs = $(".cc-tabs", st), inputs = $(".cc-inputs", st), out = $(".cc-out", st), needle = $(".cc-needle", st), L = E.live.creditcompass;
    const fields = [["loan_grade", "Loan grade"], ["loan_intent", "Intent"], ["person_income", "Income"], ["loan_amnt", "Loan"], ["loan_int_rate", "Rate %"], ["loan_percent_income", "Loan / income"], ["cb_person_default_on_file", "Past default"], ["person_age", "Age"]];
    tabs.innerHTML = L.map((x, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">Applicant ${"AB"[i]}</button>`).join("");
    $(".cc-thr", st).style.left = `${L[0].threshold * 100}%`;
    function show(i) {
      const x = L[i];
      $$("button", tabs).forEach((b, j) => b.setAttribute("aria-selected", String(j === i)));
      inputs.innerHTML = fields.map(([k, n]) => `<div><dt>${n}</dt><dd>${esc(x.input[k])}</dd></div>`).join("");
      if (motion) M.animate(needle, { left: `${x.probability * 100}%` }, T.springSoft); else needle.style.left = `${x.probability * 100}%`;
      out.innerHTML = `Default probability <b>${x.probability.toFixed(3)}</b> vs threshold ${x.threshold.toFixed(3)} → <span class="${x.result === "High Risk" ? "hi" : "lo"}">${esc(x.result)}</span>`;
    }
    tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
    needle.style.left = "0%"; show(0);
  })();

  /* Verbalyx — measured stages, then the real question and its evidence */
  (() => {
    const st = $(".stage-verbalyx"), wrap = $(".vx-stages", st), S = E.verbalyx.stages, max = 27.1, qa = E.verbalyx.qa;
    wrap.innerHTML = S.map(([n, d, sec]) => `<div class="vx-row"><span class="vx-n">${esc(n)}</span><span class="vx-d">${esc(d)}</span><span class="vx-track"><i data-w="${sec ? sec / max : 0}"></i></span><b>${sec ? sec.toFixed(1) + " s" : "on demand"}</b></div>`).join("");
    const qEl = $(".vx-q b", st), aEl = $(".vx-a b", st), evEl = $(".vx-ev i", st);
    const grow = () => $$(".vx-track i", wrap).forEach((b, i) => { const v = +b.dataset.w; if (motion) M.animate(b, { scaleX: [0, v] }, { duration: .9, delay: i * .1, ease: T.ease }); else b.style.transform = `scaleX(${v})`; });
    let tk = 0;
    function ask() {
      const my = ++tk; qEl.textContent = ""; aEl.textContent = ""; evEl.textContent = "";
      if (!motion) { qEl.textContent = qa.q; aEl.textContent = qa.a; evEl.textContent = qa.evidence; return; }
      const type = (el, s, k, next) => { if (my !== tk) return; el.textContent = s.slice(0, k); if (k < s.length) setTimeout(() => type(el, s, k + 1, next), 20); else next && setTimeout(next, 300); };
      type(qEl, qa.q, 0, () => type(aEl, qa.a, 0, () => { evEl.textContent = qa.evidence; }));
    }
    $("[data-act=ask]", st).addEventListener("click", ask);
    if (motion) revealOnEnter([st], () => { grow(); setTimeout(ask, 700); }); else { grow(); ask(); }
  })();
})();
