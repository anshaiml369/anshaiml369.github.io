# ANSH AGRAWAL — documentary portfolio (v4)

Static HTML / CSS / vanilla JS. Run: `python3 -m http.server 5517 --directory .`

## Structure
- `index.html` — six chapters: Opening · Journey · Workshop · Research · Profile · Next.
- `css/brand.css` — design tokens (colour, type scale, space, radii, motion durations, z-layers) and all components.
- `js/core.js` — motion tokens, Lenis setup, one scene scheduler, reveal/stagger/count-up/magnetic helpers. Static mode runs on scroll events (no animation frames needed).
- `js/ch-*.js` — one module per chapter. `js/data.js` (content), `js/evidence-data.js` (real graph, live outputs, measured timings).
- `data/` — raw evidence: `cora-neighbourhood.json` (from the GraphMind API), `live-outputs.json` (captured from the live demos, 2026-10-17).

## Toolchain — what each tool actually did
| Tool | Status | Contribution |
|---|---|---|
| UI UX Pro Max 2.2.3 | used | Design system (Kinetic Typography, OLED dark, one blue accent, Satoshi/General Sans, 150–300 ms feedback vs 400–600 ms+ cinematic), anti-patterns, pre-delivery checklist |
| Motion.dev 12.43.0 (vendored, MIT) | used | Kinetic name, curtain, masked titles, staggers, springs (cert tilt, magnetic buttons, needle), value tweens (count-ups, bars, Scholaryx run) |
| Lenis 1.3.27 (vendored, MIT) | used | Smooth scrolling; anchors and keyboard still native; disabled in static mode |
| 21st.dev | researched | Patterns adapted natively (no code copied): masked text reveal → chapter titles; scroll word highlight ("Rectangular Text Reveal") → manifesto; dark cinematic hero → perspective grid + light; split-character "Reveal Text" → name |
| Google Flow / Whisk | not used | Need the owner's Google account and credits; real graphs, outputs and screenshots were stronger evidence than generated imagery |

## Motion system
fast 0.2 s (feedback) · base 0.45 s (entrances) · cinematic 0.9 s (titles) · slow 1.2 s (opening) · expo-out arrivals, ease-in-out curtains ·
springs 220/22 and 120/16 · stagger 60 ms · reveal threshold 88% of viewport · reduced motion → fully static, readable page.

## v6 — "Research journal" redesign (17 Oct 2026, current)
Why v5 was replaced: GraphMind had become the brand (hero, logo, motifs); six competing accents; glows, grain,
outlined giant words; nested cards; four typefaces; three navigation systems; the five projects listed twice.

Direction chosen from three candidates (editorial journal · Swiss grid · warm graphite): warm paper, ink, one rust
accent; Crimson Pro display + Atkinson Hyperlegible text (UI UX Pro Max "academic/scholarly" pairing) + Plex Mono for numbers.
Hierarchy: name → positioning → contents of the five systems → about → five equal figure spreads → timeline →
research note + interests → skills table → experience & credentials → contact. One nav (menu on phones).
Motion language: heading lines rise · content enters once · data figures animate on entry or on request. No parallax,
glow, grain, marquee, custom cursor or 3D. Lenis smooth scroll; Motion.dev for figure animation.
Files: index.html, css/journal.css, js/{core,work,timeline,research,skills,site}.js (+ data.js, evidence-data.js).
Earlier versions are tagged in git: v4-documentary, v5-reference.
