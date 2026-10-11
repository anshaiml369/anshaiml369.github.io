# Ansh Agrawal — AI/ML project portfolio

Source for **https://anshaiml369.github.io/**, a static landing page (HTML, CSS and a little vanilla JavaScript)
served by GitHub Pages. It summarises five projects and links to each one's repository:

| Project | Repository |
|---|---|
| Topic classification on the Cora citation graph (GCN) | [cora-gcn-explorer](https://github.com/anshaiml369/cora-gcn-explorer) |
| Emotion-label prediction with a bidirectional GRU | [text-emotion-bigru](https://github.com/anshaiml369/text-emotion-bigru) |
| Calibrated loan-default probability with XGBoost | [credit-default-xgboost](https://github.com/anshaiml369/credit-default-xgboost) |
| Sequential multi-agent research pipeline | [multi-agent-research-workbench](https://github.com/anshaiml369/multi-agent-research-workbench) |
| Question answering over what is said in a video (RAG) | [ai-video-assistant-rag](https://github.com/anshaiml369/ai-video-assistant-rag) |

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
