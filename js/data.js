/* Content and numbers for the page. Every value is copied from a source file named in `src`.
   Status: "verified" = re-run or re-checked; "checked" = document inspected; "self" = self-reported. */
window.PORTFOLIO = {
  systems: [
    {
      id: "graphmind", n: "01", name: "GraphMind",
      field: "Graph neural networks · node classification",
      line: "Classifies 2,708 research papers into seven topics from their words and citation links — and measures how much the links matter.",
      metrics: [
        { v: "0.823 ± 0.007", k: "GCN test accuracy, 5 seeds", ev: "verified", src: "RESEARCH_REPORT.md §8.2 (summary.csv)" },
        { v: "+0.24", k: "gain over feature-only MLP", ev: "verified", src: "comparisons.csv" },
        { v: "14 / 14", k: "methodology tests pass", ev: "verified", src: "tests/test_experiment.py, 17 Oct 2026" }
      ],
      demo: "https://anshag-graphmind.hf.space/", repo: "https://github.com/anshaiml369/graphmind",
      problem: "Semi-supervised node classification on the Cora citation graph: only 140 of 2,708 papers are labelled.",
      method: "Two-layer GCN and GAT (PyTorch Geometric) against an MLP that never sees the graph; validation-only tuning; five seeds; retrained graph ablations (edges removed, 50% dropped, degree-preserving rewiring). The deployed explorer serves the original GCN via ONNX Runtime and FastAPI.",
      limits: "One dataset and one split; transductive setting; five seeds cannot separate GCN from GAT. The deployed model is the original single run (test accuracy 0.792), not the tuned study model.",
      tags: ["PyTorch Geometric", "GCN", "GAT", "ONNX", "FastAPI"]
    },
    {
      id: "scholaryx", n: "02", name: "Scholaryx",
      field: "Agentic AI · tool-using LLM agents",
      line: "A sequential multi-agent pipeline that turns a topic into a sourced research report with a self-critique — and shows every step.",
      metrics: [
        { v: "28–43 s", k: "end to end, two live runs", ev: "checked", src: "Scholaryx case study; two measured runs" },
        { v: "$0.002", k: "OpenAI cost per run", ev: "checked", src: "measured token usage, two runs" },
        { v: "5 / 5", k: "cited URLs found in sources", ev: "checked", src: "citation cross-check, both runs" }
      ],
      demo: "https://anshag-scholaryx.hf.space/", repo: "https://github.com/anshaiml369/scholaryx",
      problem: "Gather recent web material on a free-text topic, read a source in depth, and write a structured report — with each step’s inputs and outputs visible.",
      method: "Search agent (Tavily) → reader agent (scraping) → writer chain → critic chain, all gpt-4o-mini via LangChain. Added a live workbench, per-stage timing, measured cost, a citation cross-check, usage limits and SSRF protection, covered by 11 tests.",
      limits: "Only two measured runs — not a benchmark. Strictly sequential: the critique does not feed back into the report. Live runs use paid APIs and are limited to 20 a day.",
      tags: ["LangChain", "OpenAI", "Tavily", "FastAPI"]
    },
    {
      id: "moodalyx", n: "03", name: "Moodalyx",
      field: "Natural language processing · recurrent networks",
      line: "Predicts which of six emotion labels a short English sentence most resembles, with the full probability distribution.",
      metrics: [
        { v: "0.921", k: "accuracy, 2,000 test sentences", ev: "checked", src: "re-evaluation of the saved model" },
        { v: "0.880", k: "macro-F1", ev: "checked", src: "re-evaluation of the saved model" },
        { v: "0.048", k: "expected calibration error", ev: "checked", src: "re-evaluation of the saved model" }
      ],
      demo: "https://anshag-moodalyx.hf.space/", repo: "https://github.com/anshaiml369/moodalyx",
      problem: "Six-class, imbalanced classification of short English text (dair-ai/emotion): joy has 695 test sentences, surprise only 66.",
      method: "Embedding → two bidirectional GRU layers (TensorFlow/Keras), served with FastAPI using exactly the evaluation preprocessing. Re-evaluated with per-class metrics, calibration and error analysis.",
      limits: "The test split was used for early stopping, so the score is optimistic. Weakest on surprise and love. It predicts a dataset label, not anyone’s emotional state, and can be confidently wrong.",
      tags: ["TensorFlow", "Bi-GRU", "Calibration", "FastAPI"]
    },
    {
      id: "creditcompass", n: "04", name: "CreditCompass",
      field: "Tabular ML · probability calibration",
      line: "Calibrated loan-default probabilities with XGBoost — a research demonstration of ranking, calibration and threshold trade-offs.",
      metrics: [
        { v: "0.953", k: "ROC-AUC, 6,305 held out", ev: "checked", src: "held-out re-evaluation" },
        { v: "0.910", k: "PR-AUC (21.6% defaults)", ev: "checked", src: "held-out re-evaluation" },
        { v: "0.052", k: "Brier score (base 0.169)", ev: "checked", src: "held-out re-evaluation" }
      ],
      demo: "https://anshag-creditcompass.hf.space/", repo: "https://github.com/anshaiml369/creditcompass",
      problem: "Imbalanced binary classification where accuracy misleads: always predicting “no default” would be about 78% accurate and catch nothing.",
      method: "Imputation + one-hot encoding → XGBoost (randomised search, 150 candidates × 5 folds) → sigmoid calibration. The interface shows the observed default rate among similar held-out applicants and a one-feature sensitivity tool.",
      limits: "One public dataset of undocumented origin. No fairness audit. Not a credit score or lending decision.",
      tags: ["XGBoost", "scikit-learn", "Calibration", "FastAPI"]
    },
    {
      id: "verbalyx", n: "05", name: "Verbalyx",
      field: "Speech recognition · retrieval-augmented generation",
      line: "Answers questions about what was said in a recording, and shows the transcript passages behind every answer.",
      metrics: [
        { v: "4.5%", k: "word error rate, one 88 s meeting", ev: "checked", src: "single synthetic test recording" },
        { v: "3 / 3", k: "questions answered correctly", ev: "checked", src: "one attribution error noted" },
        { v: "55 s", k: "hosted analysis of that meeting", ev: "verified", src: "live run on the Space, 14 Oct 2026" }
      ],
      demo: "https://anshag-verbalyx.hf.space/", repo: "https://github.com/anshaiml369/verbalyx",
      problem: "Long recordings are slow to search. Produce a usable written record and answer specific questions — verifiably.",
      method: "ffmpeg → Whisper “small” transcription → Mistral summary, actions and decisions → MiniLM embeddings in Chroma → answers grounded in the four most relevant chunks. Fixed a bug that let answers draw on previously analysed recordings.",
      limits: "Evaluated on one synthetic recording only. No timestamps or speaker labels. The public demo accepts uploads up to 10 minutes, 10 analyses a day.",
      tags: ["Whisper", "Mistral", "Chroma", "RAG"]
    }
  ],

  /* GraphMind study, test accuracy per seed 0–4 (results/per_seed_results.csv). */
  ablation: {
    mlp: [0.572, 0.599, 0.586, 0.573, 0.584],
    gcn: {
      original: [0.824, 0.831, 0.826, 0.818, 0.814],
      drop50:   [0.780, 0.763, 0.769, 0.753, 0.746],
      rewired:  [0.295, 0.289, 0.305, 0.308, 0.307],
      no_edges: [0.585, 0.581, 0.542, 0.556, 0.592]
    },
    gat: {
      original: [0.806, 0.812, 0.834, 0.810, 0.825],
      drop50:   [0.771, 0.727, 0.765, 0.768, 0.768],
      rewired:  [0.248, 0.248, 0.270, 0.298, 0.293],
      no_edges: [0.526, 0.499, 0.491, 0.476, 0.489]
    },
    labels: { original: "Original graph", drop50: "50% of links removed", rewired: "Rewired (same degrees)", no_edges: "No links" },
    notes: {
      gcn: "Removing links costs 0.25; rewiring costs 0.52 — a random-neighbour graph is worse than no graph.",
      gat: "GAT’s “no links” score is depressed by attention dropout tuned for the full graph; re-tuned, it reaches 0.576, level with the MLP."
    }
  },

  /* Technical profile: each skill lists only the projects whose code uses it (checked in the repositories). */
  projectsShort: { graphmind: "GraphMind", scholaryx: "Scholaryx", moodalyx: "Moodalyx", creditcompass: "CreditCompass", verbalyx: "Verbalyx", chatbot: "AI Cell chatbot" },
  skills: [
    { group: "Machine & deep learning", items: [
      ["PyTorch Geometric · GCN / GAT", ["graphmind"]], ["TensorFlow / Keras · Bi-GRU", ["moodalyx"]],
      ["scikit-learn", ["creditcompass", "graphmind"]], ["XGBoost", ["creditcompass"]], ["ONNX Runtime", ["graphmind"]] ] },
    { group: "LLMs, agents & retrieval", items: [
      ["LangChain agents & chains", ["scholaryx", "verbalyx"]], ["OpenAI API", ["scholaryx", "chatbot"]], ["Mistral API", ["verbalyx"]],
      ["Tavily search", ["scholaryx"]], ["Chroma + sentence-transformers", ["verbalyx", "chatbot"]], ["BM25 + reciprocal rank fusion", ["chatbot"]], ["Whisper speech-to-text", ["verbalyx"]] ] },
    { group: "Evaluation & experiments", items: [
      ["Seeded runs · ablation", ["graphmind"]], ["Calibration · Brier · ECE", ["creditcompass", "moodalyx"]], ["Macro-F1 · per-class error analysis", ["moodalyx", "graphmind"]],
      ["Word error rate", ["verbalyx"]], ["Citation cross-check", ["scholaryx"]] ] },
    { group: "Engineering & deployment", items: [
      ["FastAPI", ["graphmind", "scholaryx", "moodalyx", "creditcompass", "verbalyx", "chatbot"]], ["Docker · Hugging Face Spaces", ["graphmind", "scholaryx", "moodalyx", "creditcompass", "verbalyx"]],
      ["Automated tests (unittest / pytest)", ["graphmind", "scholaryx", "verbalyx", "chatbot"]], ["Vanilla JS research interfaces", ["graphmind", "scholaryx", "moodalyx", "creditcompass", "verbalyx"]] ] }
  ],

  /* Certificates shown in the Experience section (all inspected; no issuer verification link checked). */
  certificates: [
    { f: "sih-2026-internal.jpg", t: "1st rank · internal hackathon for SIH 2026", cap: "Universal AI University · Certificate of Achievement, internal hackathon for Smart India Hackathon 2026. The 1st rank is ticked by hand on a printed 1st / 2nd / 3rd line." },
    { f: "aicell-training-vertical.jpg", t: "AI Cell · Training Vertical", cap: "Universal AI University, AI Cell · Certificate of Appreciation, member of the AI Training Program Vertical, academic year 2025–26." },
    { f: "aicell-calling-agent-session.jpg", t: "AI Cell · AI Calling Agent session", cap: "Universal AI University, AI Cell · Certificate of Participation, session “Build Your Own AI Calling Agent”, 20 Feb 2026." },
    { f: "light-of-life-smart-programme.jpg", t: "AI in Village · Light of Life Trust", cap: "Light of Life Trust · Certificate of Participation, Smart Programme (Environment), 9–11 Dec 2025." },
    { f: "uai-smart-award.jpg", t: "SMART Award", cap: "Universal AI University, Centre for Social, Sustainable & Spiritual Development · SMART Award, Certificate of Participation, 12 Dec 2025." },
    { f: "outskill-generative-ai-mastermind.jpg", t: "Outskill · Generative AI Mastermind", cap: "Outskill · Certificate of Completion, Generative AI Mastermind. No credential ID or verification link is printed on it." },
  ],

  /* Journey: only dated, documented milestones. */
  milestones: [
    { t: "May 2025", h: "First build — VidSnap AI", p: "A Flask app that turns images and a script into a short vertical video with ElevenLabs text-to-speech and ffmpeg.", tag: "Building", ev: "checked", src: "Project folder admin/VidSnapAI, files dated 8 May 2025" },
    { t: "Jul 2025", h: "Began B.Tech in AI & ML", p: "Universal AI University, School of AI & Future Technologies, Karjat. Expected 2029.", tag: "Learning", ev: "checked", src: "Course schedule from 15 Jul 2025; résumé; offer letter" },
    { t: "Oct 2025 – Mar 2026", h: "AI Training Program Vertical, AI Cell", p: "Event documentation for “AI Tools for Hackathon” and “Build Your Own AI Calling Agent” (20 Feb 2026). Certificate of Appreciation for the 2025–26 academic year.", tag: "Contributing", ev: "checked", src: "AI Cell certificates of appreciation and participation, inspected; AI Cell event report", img: "assets/certs/aicell-training-vertical.jpg", alt: "AI Cell certificate of appreciation for membership of the AI Training Program Vertical, 2025–26" },
    { t: "Dec 2025", h: "AI in Village – Smart Project", p: "Collected community feedback in villages around Karjat in Light of Life Trust’s Smart Programme (Environment), 9–11 Dec 2025; SMART Award certificate of participation from the university, 12 Dec 2025.", tag: "Contributing", ev: "checked", src: "Light of Life Trust and UAi SMART Award certificates, inspected", img: "assets/certs/light-of-life-smart-programme.jpg", alt: "Light of Life Trust certificate of participation in the Smart Programme (Environment), 9–11 December 2025" },
    { t: "May – Jul 2026", h: "AI Intern, AI Cell", p: "Built a university-information chatbot: MiniLM + Chroma and BM25 retrieval fused by reciprocal rank fusion, intent routing, cited answers, FastAPI, tests.", tag: "Building", ev: "checked", src: "Offer letter (4 May – 14 Jul 2026); internship report; repository", img: "assets/artifacts/aicell-chatbot-answer.jpg", alt: "The AI Cell chatbot answering a fee question with three cited university sources" },
    { t: "Jun 2026 →", h: "Advanced AI Engineering, IIT Roorkee × Scaler", p: "In progress.", tag: "Learning · ongoing", ev: "self", src: "Self-reported; no certificate yet", open: true },
    { t: "2026", h: "Five ML systems, deployed and re-evaluated", p: "GraphMind, Scholaryx, Moodalyx, CreditCompass, Verbalyx — each began from a public tutorial and was extended, with AI coding assistants, into a live system with tests and documented limits.", tag: "Building", ev: "verified", src: "Repositories, re-evaluation scripts, live demos" },
    { t: "Sep 2026", h: "1st of 24 teams — internal SIH 2026 round", p: "Team Regnum Carya; role: research & development. Explainable-AI design for diabetic-retinopathy screening.", tag: "Award", ev: "checked", src: "Certificate of Achievement inspected (1st rank ticked); team count from a LinkedIn post", img: "assets/certs/sih-2026-internal.jpg", alt: "Universal AI University certificate of achievement for 1st rank in the internal hackathon for Smart India Hackathon 2026" },
    { t: "Sep 2026", h: "Generative AI Mastermind — Outskill", p: "Certificate of completion.", tag: "Learning", ev: "checked", src: "Certificate PDF inspected", img: "assets/certs/outskill-generative-ai-mastermind.jpg", alt: "Outskill certificate of completion for Generative AI Mastermind" },
    { t: "Oct 2026 →", h: "Industry Outreach Associate, AI ConnectX", p: "Part-time student initiative.", tag: "Contributing · ongoing", ev: "self", src: "LinkedIn (self-reported)", open: true },
    { t: "Oct 2026", h: "First controlled experiment", p: "Audited GraphMind, fixed a checkpoint bug, measured what citation structure contributes — tuned baselines, five seeds, retrained ablations.", tag: "Experimenting", ev: "verified", src: "Research branch: 45 runs, 14 tests, rerun bit-identical", key: true, img: "assets/artifacts/graphmind-ablation.png", alt: "Bar chart from the GraphMind study: test accuracy of GCN and GAT on four graph conditions against the MLP baseline" },
    { t: "Next", h: "Random-split replication", p: "Planned, not started: 20 random splits to separate split variance from seed variance.", tag: "Planned", next: true }
  ],

  /* Portfolio graph: nodes and real relations (project → method / role → method). */
  graph: {
    nodes: [
      { id: "graphmind", label: "GraphMind", kind: "project" },
      { id: "scholaryx", label: "Scholaryx", kind: "project" },
      { id: "moodalyx", label: "Moodalyx", kind: "project" },
      { id: "creditcompass", label: "CreditCompass", kind: "project" },
      { id: "verbalyx", label: "Verbalyx", kind: "project" },
      { id: "chatbot", label: "AI Cell chatbot", kind: "role" },
      { id: "study", label: "Controlled study", kind: "research" },
      { id: "gnn", label: "Graph learning", kind: "method" },
      { id: "agents", label: "LLM agents", kind: "method" },
      { id: "rag", label: "Retrieval (RAG)", kind: "method" },
      { id: "nlp", label: "Sequence models", kind: "method" },
      { id: "calib", label: "Calibration", kind: "method" },
      { id: "eval", label: "Evaluation", kind: "method" },
      { id: "speech", label: "Speech", kind: "method" },
      { id: "deploy", label: "Deployment", kind: "method" }
    ],
    edges: [
      ["graphmind", "gnn"], ["graphmind", "eval"], ["graphmind", "deploy"], ["study", "graphmind"], ["study", "eval"], ["study", "gnn"],
      ["scholaryx", "agents"], ["scholaryx", "eval"], ["scholaryx", "deploy"],
      ["moodalyx", "nlp"], ["moodalyx", "calib"], ["moodalyx", "eval"], ["moodalyx", "deploy"],
      ["creditcompass", "calib"], ["creditcompass", "eval"], ["creditcompass", "deploy"],
      ["verbalyx", "rag"], ["verbalyx", "speech"], ["verbalyx", "deploy"],
      ["chatbot", "rag"], ["chatbot", "deploy"]
    ]
  }
};
