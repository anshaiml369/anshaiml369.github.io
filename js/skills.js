/* Skills: a project × skill table built from data.js (each dot = the project's code uses it). */
(() => {
  "use strict";
  const { $, esc } = window.Brand;
  const D = window.PORTFOLIO, P = Object.entries(D.projectsShort);
  $("#skills-table").innerHTML = `
    <caption class="sr-only">Skills used by each project</caption>
    <thead><tr><th scope="col" style="text-align:left">Skill</th>${P.map(([, n]) => `<th scope="col">${esc(n)}</th>`).join("")}</tr></thead>
    <tbody>${D.skills.map((g) => `<tr class="grp"><th colspan="${P.length + 1}" scope="rowgroup">${esc(g.group)}</th></tr>` +
      g.items.map(([name, ps]) => `<tr><th scope="row">${esc(name)}</th>${P.map(([id, n]) => `<td>${ps.includes(id) ? `<span class="dot" role="img" aria-label="${esc(n)} uses ${esc(name)}"></span>` : `<span class="sr-only">not used</span>`}</td>`).join("")}</tr>`).join("")).join("")}</tbody>`;
})();
