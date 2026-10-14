# Ansh Agrawal — AI/ML engineering portfolio

Source for **https://anshaiml369.github.io/**: a static site (HTML, CSS and vanilla JavaScript, no build step)
served by GitHub Pages. It presents five AI/ML projects, each with a case study, evaluation results labelled
by provenance, and a live or recorded demonstration.

| Project | Live demo | Case study |
|---|---|---|
| GraphMind — research-topic classification with a graph neural network | [anshaiml369.github.io/graphmind](https://anshaiml369.github.io/graphmind/) | [projects/graphmind.html](projects/graphmind.html) |
| Scholaryx — sequential multi-agent research pipeline | [anshaiml369.github.io/scholaryx](https://anshaiml369.github.io/scholaryx/) (usage-limited) | [projects/scholaryx.html](projects/scholaryx.html) |
| Moodalyx — emotion-label prediction from short English text | [anshaiml369.github.io/moodalyx](https://anshaiml369.github.io/moodalyx/) | [projects/moodalyx.html](projects/moodalyx.html) |
| CreditCompass — calibrated loan-default probability with XGBoost | [anshaiml369.github.io/creditcompass](https://anshaiml369.github.io/creditcompass/) | [projects/creditcompass.html](projects/creditcompass.html) |
| Verbalyx — question answering over what is said in a video | not hosted (recorded demo) | [projects/verbalyx.html](projects/verbalyx.html) |

Source code for the five projects is available on request.

## Files

```
index.html            home page
projects/*.html       five case studies
404.html              not-found page
css/main.css          design system and components
js/main.js            navigation, click-to-load videos, hero canvas (the site works without it)
assets/fonts/         IBM Plex Sans and Mono (SIL Open Font License, see OFL.txt)
assets/viz/           project diagrams generated from real project data
assets/data/          hero graph: real Cora citation subgraph
assets/posters/       frames taken from the demo recordings
recordings/           demo recordings (MP4, no audio)
.nojekyll             serve files as-is
```

The diagrams in `assets/viz/` and `assets/data/hero-graph.json` are generated from data returned by the
deployed applications and their evaluation files; no values are invented.

## Preview locally

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.
