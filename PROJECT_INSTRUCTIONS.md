# Aeneid Trail — Project Instructions

**Governing document for the entire project**  
Last updated: 2026-07-21

---

## 1. High-Level Objective

Build a complete, playable, browser-based game that re-creates Virgil’s *Aeneid* in the style of *The Oregon Trail*.

The player takes the role of **Aeneas** and must make decisions that shape the journey from the fall of Troy to the founding of the Roman people in Italy. The game should feel faithful to the major events, tone, and moral weight of the *Aeneid* while delivering the resource-management, travel, risk, and consequence loop that made *The Oregon Trail* compelling.

**Success looks like**:  
A player who knows the *Aeneid* recognizes the story and feels the same pressures Aeneas faced.  
A player who does not know the *Aeneid* still experiences a coherent, dramatic, and satisfying epic journey.

---

## 2. Core Design Pillars

These four principles govern every decision:

1. **Faithfulness first**  
   Major plot beats, key characters, divine interventions, and the overall arc of the *Aeneid* must be preserved. Invented content is allowed only when it supports or clarifies Virgil’s narrative, never when it contradicts or trivializes it.

2. **Oregon Trail DNA**  
   - Journey broken into stages  
   - Resource management (men, ships, supplies, morale)  
   - Risk vs. reward travel choices  
   - Random (or semi-random) events  
   - Permanent consequences, including character death  
   - Clear feedback on how choices affect the party’s chances

3. **Meaningful agency as Aeneas**  
   The player’s decisions should feel like the kinds of choices Aeneas actually faces: duty vs. desire, piety vs. pragmatism, mercy vs. necessity, short-term survival vs. long-term destiny.

4. **Browser-native & lightweight**  
   The game must run entirely in a modern web browser with no installation and minimal load time. Prefer simple, robust technology over complex frameworks unless complexity is clearly justified.

---

## 3. Scope Boundaries

### In Scope
- Full narrative arc covering Books 1–12 of the *Aeneid*
- Core Oregon Trail-style systems (travel, resources, events, stats)
- Player choices that produce branching short-term outcomes and some long-term consequences
- Basic status screens, event text, and simple visual feedback
- Local save/load via browser storage
- Playable from start to (one or more) endings

### Out of Scope (for the initial complete version)
- Multiplayer
- Complex combat simulation or tactical battles
- Voice acting or heavy animation
- User-generated content tools
- Backend servers or accounts
- Mobile-native apps (responsive web is enough)

---

## 4. Recommended Approach

### Phase 1 — Foundation
- Lock the high-level chapter structure mapped to the *Aeneid*
- Define the core game state (stats, resources, party members, flags)
- Build a minimal vertical slice (Fall of Troy → first sea voyage) that proves the travel → event → choice → consequence loop

### Phase 2 — Narrative Skeleton
- Implement each major chapter as a sequence of travel legs and scripted + random events
- Write choice text and outcomes that stay close to Virgil while giving the player real agency
- Track long-term flags (e.g., relationships, divine favor, key deaths) that can surface later

### Phase 3 — Systems & Polish
- Balance resource drain, event frequency, and difficulty
- Add clear UI for status, inventory, and map/progress
- Implement multiple endings or epilogues based on major choices and final state
- Basic accessibility and responsive layout

### Phase 4 — Release & Iteration
- Package as a static site (GitHub Pages, Vercel, or similar)
- Playtest for clarity, fairness, and emotional impact
- Iterate on text, balance, and feedback based on real play

---

## 5. Technical Guidelines

- Prefer a simple, modern stack: Vite + React + TypeScript (or plain HTML/JS if the team prefers zero build step)
- All game logic and content must live in the client
- Keep content (events, choices, text) data-driven so the story can be edited without touching core systems
- Avoid heavy dependencies; every library must justify its weight
- Code should be readable by a future contributor who has never seen the project

---

## 6. Content & Tone Rules

- Language should feel elevated but not archaic or impenetrable
- Humor is welcome when it arises naturally from the situation or from Oregon Trail-style misfortune; it should never undercut the epic weight of the story
- Divine intervention and fate remain powerful forces — player skill and choices matter, but the gods and destiny are real
- Death of named companions should feel significant
- Avoid modern slang or anachronistic references that break immersion

---

## 7. Decision-Making Hierarchy

When trade-offs arise, use this order of priority:

1. Faithfulness to the spirit and major events of the *Aeneid*
2. Clarity and fairness of player agency
3. Strength of the Oregon Trail gameplay loop
4. Technical simplicity and maintainability
5. Visual or production polish

---

## 8. Working Agreement

- This document is the single source of truth for project direction.
- Any significant deviation from these instructions should be discussed and, if accepted, reflected in an update to this file.
- Prefer small, playable increments over large untested features.
- Keep the player experience (as Aeneas) at the center of every design choice.

---

*End of governing instructions.*
