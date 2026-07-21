# Aeneid Trail

**Release 1.0**

Oregon Trail–style journey through Virgil’s *Aeneid*.  
You are Aeneas, from the fall of Troy to the founding of the Roman people.

---

## Play immediately (one file)

Open **`AeneidTrail.html`** in any modern browser.  
No folders, no server, no install required.

---

## Modular version (same folder)

```
aeneid-trail/
├── AeneidTrail.html      ← single-file game (recommended)
├── aeneid_game.html      ← modular entry point
├── index.html            ← redirects to aeneid_game.html
├── css/styles.css
├── js/game.js
├── data/content.js
├── docs/
│   ├── CHAPTER_STRUCTURE.md
│   └── GAME_STATE.md
├── PROJECT_INSTRUCTIONS.md
└── README.md
```

To run the modular version, keep this folder together and open `aeneid_game.html`  
(or serve the folder and visit the root).

```bash
# from inside this folder
python3 -m http.server 8000
# then open http://localhost:8000/
```

---

## Features

- Full narrative arc (Troy → Turnus)
- Resource management (men, ships, supplies, morale) + piety
- Meaningful choices with lasting flags
- Random events during travel
- Dynamic endings based on your decisions
- Local save/continue
- Works entirely in the browser

---

*Faithfulness → Agency → Oregon Trail loop → Simplicity*
