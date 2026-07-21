# Aeneid Trail

**Release 1.0**

Browser-based Oregon Trail–style game adapting Virgil’s *Aeneid*.  
You play as Aeneas on the journey from the fall of Troy to the founding of the Roman people in Italy.

**Governing document:** [PROJECT_INSTRUCTIONS.md](PROJECT_INSTRUCTIONS.md)

**Play:** Open [`aeneid_game.html`](aeneid_game.html) (or the site root, which redirects there).

---

## Status

All four planned phases are complete:

| Phase | Focus | Status |
|-------|--------|--------|
| 1 | Foundation (chapter structure, game state, vertical slice) | Done |
| 2 | Narrative skeleton (full arc Troy → Turnus) | Done |
| 3 | Systems & polish (balance, random events, UI, multiple endings, a11y) | Done |
| 4 | Release packaging | Done |

The game is a complete, playable, client-side static site. No backend, no build step.

### Features

- Full narrative arc with major Virgilian beats
- Oregon Trail–style resources (men, ships, supplies, morale) + piety / divine favor
- Meaningful choices that set long-term flags
- Random events during travel (weighted by conditions)
- Dynamic epilogues shaped by Turnus fate, Dido, piety, and losses
- Chapter progress indicator, color-coded resource warnings
- Local save/continue via `localStorage`
- Basic accessibility and responsive layout

---

## Project Structure

```
├── index.html                 # Redirects to aeneid_game.html
├── aeneid_game.html           # Main entry point
├── css/styles.css
├── js/game.js
├── data/content.js
├── docs/
│   ├── CHAPTER_STRUCTURE.md
│   └── GAME_STATE.md
├── PROJECT_INSTRUCTIONS.md
└── README.md
```

---

## Local play

Open `aeneid_game.html` in any modern browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server
```

---

## Deployment

This is a pure static site. Deploy the contents of this folder to any static host (Vercel, GitHub Pages, Netlify, etc.).

Recommended: Vercel or GitHub Pages. The root `index.html` redirects to the game so the site root works cleanly.

---

*Built to the priorities in PROJECT_INSTRUCTIONS.md: Faithfulness → Agency → Oregon Trail loop → Simplicity.*
