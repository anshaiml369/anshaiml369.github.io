# Ansh Agrawal — AI/ML project portfolio

Source for **https://anshaiml369.github.io/**, a static landing page (HTML, CSS and a little vanilla JavaScript)
served by GitHub Pages. It summarises five projects and links to each one's repository:

| Project | Repository |
|---|---|
| GraphMind: topic classification on the Cora citation graph (GCN) | [graphmind](https://github.com/anshaiml369/graphmind) · [live demo](https://graphmind-n10l.onrender.com/) |
| Moodalyx: emotion-label prediction with a bidirectional GRU | [moodalyx](https://github.com/anshaiml369/moodalyx) · [live demo](https://moodalyx.onrender.com/) |
| CreditCompass: calibrated loan-default probability with XGBoost | [creditcompass](https://github.com/anshaiml369/creditcompass) · [live demo](https://creditcompass-h0m5.onrender.com/) |
| Scholaryx: a sequential multi-agent research pipeline | [scholaryx](https://github.com/anshaiml369/scholaryx) · [live demo](https://scholaryx.onrender.com/) |
| Verbalyx: question answering over what is said in a video (RAG) | [verbalyx](https://github.com/anshaiml369/verbalyx) |

Each project began from a public YouTube tutorial and was extended with a research interface, re-evaluation,
error analysis and documented limitations. Every metric on the page is labelled with its source.

## Files

```
index.html        the page
css/core.css      shared design system (same as in the project repositories)
css/site.css      page-specific styles
js/core.js        shared helpers (mobile navigation)
assets/*.jpg      screenshots of each project's interface, taken from real runs
.nojekyll         serve files as-is (no Jekyll processing)
```

## Preview locally

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.
