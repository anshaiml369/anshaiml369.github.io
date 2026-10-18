/* Timeline: milestones grouped by year, an editorial list with a source toggle for each item. */
(() => {
  "use strict";
  const { $, esc } = window.Brand;
  const D = window.PORTFOLIO;
  const year = (m) => (m.next ? "Next" : (m.t.match(/\d{4}/g) || ["—"])[0]);
  const groups = [];
  D.milestones.forEach((m, i) => {
    const y = year(m); let g = groups.find((x) => x.y === y);
    if (!g) groups.push(g = { y, items: [] });
    g.items.push([m, i]);
  });
  const evText = { verified: "Verified", checked: "Document checked", self: "Self-reported" };
  $("#tl").innerHTML = groups.map((g) => `
    <div class="tl tl-years">
      <p class="tl-year" aria-hidden="true">${g.y}</p>
      <ol class="tl-list" aria-label="${g.y === "Next" ? "Planned" : g.y}">${g.items.map(([m, i]) => `
        <li class="tl-item enter${m.next ? " next" : ""}">
          <time>${esc(m.t)}</time>
          <div>
            <h3>${esc(m.h)}</h3>
            <p>${esc(m.p)}</p>
            ${m.img ? `<button class="tl-art" type="button" data-art="${i}" aria-label="Enlarge: ${esc(m.alt)}"><img src="${m.img}" alt="${esc(m.alt)}" loading="lazy"></button>` : ""}
            <div class="tl-meta"><span class="tl-tag">${esc(m.tag)}</span>${m.src ? `<button class="tl-src" type="button" aria-expanded="false" aria-controls="src-${i}">Source</button>` : ""}</div>
            ${m.src ? `<p class="tl-srctext" id="src-${i}" hidden>${evText[m.ev]} — ${esc(m.src)}</p>` : ""}
          </div>
        </li>`).join("")}</ol>
    </div>`).join("");
  $("#tl").addEventListener("click", (e) => {
    const b = e.target.closest(".tl-src");
    if (b) { const t = $("#" + b.getAttribute("aria-controls")), open = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(open)); b.textContent = open ? "Hide source" : "Source"; t.hidden = !open; }
    const a = e.target.closest(".tl-art");
    if (a) { const m = D.milestones[+a.dataset.art]; window.Brand.openMedia(`<img src="${m.img}" alt="${esc(m.alt)}">`, `${m.t} — ${m.alt}.`); }
  });
})();
