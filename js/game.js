/**
 * Aeneid Trail — Core Game Engine (Phase 3 Systems & Polish)
 * State, choices, conditions, random events during travel,
 * resource balance, dynamic multiple endings, clearer UI support,
 * accessibility-minded rendering.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "aeneid-trail-save-v3";
  const CHAPTER_LABELS = [
    "", "Fall of Troy", "Departure", "Wanderings", "Storm & Carthage",
    "Queen of Carthage", "Funeral Games", "Underworld", "Latium",
    "War for Italy", "Final Reckoning"
  ];

  let state = null;
  let currentSceneId = "start";
  let pendingNext = null; // used when a random event interrupts

  // ---------- Helpers ----------

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function el(id) {
    return document.getElementById(id);
  }

  function createNewGame() {
    state = deepClone(window.AENEID_DATA.startingState);
    state.startedAt = new Date().toISOString();
    state.lastSavedAt = state.startedAt;
    state.eventLog = ["The night Troy fell."];
    currentSceneId = "start";
    pendingNext = null;
    return state;
  }

  function applyEffects(effects) {
    if (!effects) return;

    ["men", "ships", "supplies", "morale", "piety", "junoHostility", "venusFavor", "health"].forEach((key) => {
      if (typeof effects[key] === "number") {
        state[key] = Math.max(0, (state[key] || 0) + effects[key]);
        if (["morale", "piety", "health", "venusFavor"].includes(key)) {
          state[key] = Math.min(100, state[key]);
        }
        if (key === "junoHostility") {
          state[key] = Math.min(100, Math.max(0, state[key]));
        }
      }
    });

    if (typeof effects.daysElapsed === "number") {
      state.travel.daysElapsed += effects.daysElapsed;
    }

    if (effects.flags) {
      Object.assign(state.flags, effects.flags);
    }

    if (effects.travel) {
      Object.assign(state.travel, effects.travel);
    }

    if (effects.companionStatus) {
      Object.entries(effects.companionStatus).forEach(([id, status]) => {
        const c = state.companions.find((x) => x.id === id);
        if (c) c.status = status;
      });
    }

    if (effects.log) {
      state.eventLog.push(effects.log);
      if (state.eventLog.length > 16) state.eventLog.shift();
    }

    // Permanent deaths via flags
    if (state.flags.creusaLost) {
      const creusa = state.companions.find((c) => c.id === "creusa");
      if (creusa && creusa.status === "alive") creusa.status = "dead";
    }
    if (state.flags.anchisesDead) {
      const anch = state.companions.find((c) => c.id === "anchises");
      if (anch && anch.status === "alive") anch.status = "dead";
    }
  }

  function choiceIsAvailable(choice) {
    if (!choice.requires) return true;
    const req = choice.requires;
    if (req.flag && !state.flags[req.flag]) return false;
    if (req.notFlag && state.flags[req.notFlag]) return false;
    if (typeof req.minPiety === "number" && state.piety < req.minPiety) return false;
    if (typeof req.minMorale === "number" && state.morale < req.minMorale) return false;
    if (typeof req.minMen === "number" && state.men < req.minMen) return false;
    return true;
  }

  // Weighted random event. Chance rises with Juno hostility / low resources.
  function maybeTriggerRandomEvent() {
    if (!window.AENEID_DATA.randomEvents || !window.AENEID_DATA.randomEvents.length) return null;

    let chance = 0.28;
    if (state.junoHostility > 65) chance += 0.14;
    if (state.junoHostility > 85) chance += 0.08;
    if (state.supplies < 35) chance += 0.10;
    if (state.morale < 40) chance += 0.10;
    if (state.venusFavor > 70) chance -= 0.10;
    if (state.piety > 80) chance -= 0.05;

    chance = Math.max(0.08, Math.min(0.62, chance));

    if (Math.random() > chance) return null;

    const pool = window.AENEID_DATA.randomEvents;
    const totalWeight = pool.reduce((s, e) => s + (e.weight || 10), 0);
    let r = Math.random() * totalWeight;
    for (const ev of pool) {
      r -= (ev.weight || 10);
      if (r <= 0) return ev;
    }
    return pool[0];
  }

  function checkGameOver() {
    if (state.men <= 0) {
      return {
        title: "The Line of Troy Is Ended",
        text: "No men remain. The journey ends here, far from the promised land. The household gods have no one left to carry them."
      };
    }
    // Ships and supplies only matter once the fleet has been assembled at Troy.
    // Before that (Fall of Troy sequence) ships start at 0 by design.
    if (state.flags.fleetAssembled && state.ships <= 0 && state.travel.currentChapter < 8) {
      return {
        title: "The Fleet Is Lost",
        text: "Without ships the sea cannot be crossed. You are stranded, and the destiny spoken by the gods remains unfulfilled."
      };
    }
    if (state.flags.fleetAssembled && state.supplies <= 0 && state.travel.currentChapter < 8) {
      return {
        title: "Starvation",
        text: "The last of the provisions are gone. Hunger does what the Greeks and the storms could not. The journey ends in emptiness."
      };
    }
    return null;
  }

  // ---------- Multiple endings ----------

  function buildEpilogue() {
    const f = state.flags;
    const lines = [];

    lines.push("The long voyage is over. On the banks of the Tiber the foundations of a new people can at last be laid. Ascanius will reign after you; the blood of Troy will mix with the blood of Italy.");

    // Turnus — primary moral axis
    if (f.turnusKilled) {
      lines.push("You slew Turnus as he begged for his life. The war ended in a single stroke of vengeance for Pallas. Some will call it justice; others will remember that the founder of the Roman line showed no mercy to a fallen enemy.");
    } else if (f.turnusSpared) {
      lines.push("You stayed your hand and spared Turnus, remembering the words of Anchises in the underworld: spare the conquered, war down the proud. Whether this mercy becomes a foundation of Roman character or a seed of later weakness, only the centuries will tell.");
    }

    // Dido
    if (f.didoCursed) {
      lines.push("Behind you lies the smoke of Dido’s pyre and her dying curse. Carthage and the future Rome are already set against each other. The cost of duty was paid in the life of a queen who loved you.");
    } else if (f.didoAffair) {
      lines.push("You left Carthage and the queen who had given you shelter and love. The parting was bitter, yet the curse was not fully spoken. The memory of Dido will remain a private wound.");
    } else if (f.didoMet) {
      lines.push("You passed through Carthage without binding yourself to its queen. The city gave aid; you gave thanks and continued. Some doors, once opened, are better left only partly entered.");
    }

    // Piety / divine relationship
    if (state.piety >= 85) {
      lines.push("Throughout the journey you kept the gods before your eyes. Omens were heeded, rites performed, the household gods protected. The divine favor that followed you was not accidental.");
    } else if (state.piety <= 45) {
      lines.push("There were moments when necessity or anger overrode piety. The gods took notice. Whether they will forgive the founder of a new people remains an open question.");
    }

    // Losses
    const dead = state.companions.filter((c) => c.status === "dead").map((c) => c.name);
    if (dead.length) {
      lines.push("You did not arrive alone in loss. " + dead.join(", ") + (dead.length > 1 ? " were" : " was") + " left behind along the way. Their absence is part of the foundation as much as any stone.");
    }

    // Final framing
    if (f.turnusSpared && state.piety >= 70 && !f.didoCursed) {
      lines.push("The city that rises from these choices may yet be one that knows both strength and restraint. That is a rarer inheritance than conquest alone.");
    } else if (f.turnusKilled && f.didoCursed) {
      lines.push("The city that rises will be strong, and it will remember its enemies. The price of that strength has already been paid in full.");
    } else {
      lines.push("What kind of people will remember you depends on the choices you made when the gods, the dead, the defeated, and those who loved you all laid claim to you at once.");
    }

    lines.push("");
    lines.push("— End of the journey —");

    return lines.join("\n\n");
  }

  // ---------- Persistence ----------

  function saveGame() {
    if (!state) return false;
    state.lastSavedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state,
        currentSceneId,
        pendingNext
      }));
      return true;
    } catch (e) {
      console.warn("Save failed", e);
      return false;
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      state = data.state;
      currentSceneId = data.currentSceneId || "start";
      pendingNext = data.pendingNext || null;
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearSave() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ---------- UI ----------

  function setStatClass(id, value, warnBelow, dangerBelow) {
    const node = el(id);
    if (!node) return;
    node.textContent = value;
    node.classList.remove("stat-warn", "stat-danger");
    if (typeof dangerBelow === "number" && value <= dangerBelow) {
      node.classList.add("stat-danger");
    } else if (typeof warnBelow === "number" && value <= warnBelow) {
      node.classList.add("stat-warn");
    }
  }

  function renderProgress() {
    const container = el("chapter-progress");
    if (!container) return;

    const current = state.travel.currentChapter || 1;
    let html = "";
    for (let i = 1; i <= 10; i++) {
      const cls = i < current ? "done" : (i === current ? "current" : "future");
      const label = CHAPTER_LABELS[i] || ("Ch " + i);
      html += `<div class="chapter-dot ${cls}" title="${label}"><span class="num">${i}</span></div>`;
    }
    container.innerHTML = html;

    const labelEl = el("chapter-label");
    if (labelEl) {
      labelEl.textContent = CHAPTER_LABELS[current] || "";
    }
  }

  function renderStatus() {
    if (!state) return;

    setStatClass("stat-men", state.men, 80, 30);
    setStatClass("stat-ships", state.ships, 8, 3);
    setStatClass("stat-supplies", state.supplies, 40, 15);
    setStatClass("stat-morale", state.morale, 40, 20);
    setStatClass("stat-piety", state.piety, 40, 25);

    const list = el("companion-list");
    if (list) {
      list.innerHTML = "";
      state.companions.forEach((c) => {
        const li = document.createElement("li");
        li.className = c.status === "alive" ? "alive" : "dead";
        li.textContent = `${c.name} (${c.role}) — ${c.status}`;
        list.appendChild(li);
      });
    }

    const flagsEl = el("flags-display");
    if (flagsEl) {
      const interesting = Object.entries(state.flags)
        .filter(([, v]) => v === true)
        .map(([k]) => k)
        .join(", ") || "none yet";
      flagsEl.textContent = interesting;
    }

    const travelEl = el("travel-info");
    if (travelEl) {
      travelEl.textContent =
        `Chapter ${state.travel.currentChapter} · ${state.travel.currentLeg} · Day ${state.travel.daysElapsed}`;
    }

    const logEl = el("event-log");
    if (logEl) {
      logEl.innerHTML = state.eventLog
        .slice(-8)
        .map((line) => `<div class="log-line">• ${line}</div>`)
        .join("");
    }

    renderProgress();
  }

  function renderScene() {
    const gameOver = checkGameOver();
    if (gameOver) {
      el("scene-title").textContent = gameOver.title;
      el("scene-text").textContent = gameOver.text;
      const choicesContainer = el("choices");
      choicesContainer.innerHTML = "";
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = "Begin the journey again from the fall of Troy.";
      btn.setAttribute("aria-label", "Restart the journey from the fall of Troy");
      btn.addEventListener("click", () => {
        clearSave();
        createNewGame();
        currentSceneId = "start";
        renderScene();
      });
      choicesContainer.appendChild(btn);
      const endNote = el("end-note");
      if (endNote) endNote.style.display = "block";
      renderStatus();
      return;
    }

    // Dynamic epilogue
    if (currentSceneId === "ending") {
      const epilogue = buildEpilogue();
      el("scene-title").textContent = "The End of the Journey";
      el("scene-text").textContent = epilogue;

      const choicesContainer = el("choices");
      choicesContainer.innerHTML = "";
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = "Begin the journey again from the fall of Troy.";
      btn.setAttribute("aria-label", "Restart the journey");
      btn.addEventListener("click", () => {
        clearSave();
        createNewGame();
        currentSceneId = "start";
        renderScene();
      });
      choicesContainer.appendChild(btn);

      const endNote = el("end-note");
      if (endNote) {
        endNote.style.display = "block";
        endNote.textContent = "Your choices shaped this ending. Replay to discover other fates.";
      }
      renderStatus();
      saveGame();
      return;
    }

    // Random-event interstitial
    if (currentSceneId === "__random__" && pendingNext) {
      const ev = pendingNext.event;
      el("scene-title").textContent = ev.title;
      el("scene-text").textContent = ev.text;

      const choicesContainer = el("choices");
      choicesContainer.innerHTML = "";
      (ev.choices || []).forEach((choice) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;
        btn.addEventListener("click", () => {
          applyEffects(choice.effects);
          currentSceneId = pendingNext.nextScene;
          pendingNext = null;
          renderScene();
        });
        choicesContainer.appendChild(btn);
      });

      const endNote = el("end-note");
      if (endNote) endNote.style.display = "none";
      renderStatus();
      saveGame();
      return;
    }

    const scene = window.AENEID_DATA.scenes[currentSceneId];
    if (!scene) {
      el("scene-title").textContent = "Error";
      el("scene-text").textContent = "Scene not found: " + currentSceneId;
      el("choices").innerHTML = "";
      return;
    }

    el("scene-title").textContent = scene.title;
    el("scene-text").textContent = scene.text;

    const choicesContainer = el("choices");
    choicesContainer.innerHTML = "";

    const available = (scene.choices || []).filter(choiceIsAvailable);
    available.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.setAttribute("aria-label", choice.text);
      btn.addEventListener("click", () => onChoice(choice));
      choicesContainer.appendChild(btn);
    });

    const endNote = el("end-note");
    if (endNote) {
      endNote.style.display = scene.isEnd ? "block" : "none";
    }

    renderStatus();
    saveGame();
  }

  function onChoice(choice) {
    applyEffects(choice.effects);

    if (choice.id === "restart") {
      clearSave();
      createNewGame();
      currentSceneId = "start";
      renderScene();
      return;
    }

    const nextId = choice.next || currentSceneId;

    // Opportunity for random event when travel/time advanced
    const advanced =
      (choice.effects && (choice.effects.travel || typeof choice.effects.daysElapsed === "number")) ||
      (choice.effects && (choice.effects.ships || choice.effects.men || choice.effects.supplies));

    if (advanced && nextId !== "ending" && nextId !== "start") {
      const ev = maybeTriggerRandomEvent();
      if (ev) {
        pendingNext = { event: ev, nextScene: nextId };
        currentSceneId = "__random__";
        renderScene();
        return;
      }
    }

    currentSceneId = nextId;
    renderScene();
  }

  // ---------- Boot ----------

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const target = el(id);
    if (target) target.classList.add("active");
  }

  function startNew() {
    clearSave();
    createNewGame();
    showScreen("game-screen");
    renderScene();
  }

  function continueGame() {
    if (loadGame()) {
      showScreen("game-screen");
      renderScene();
    } else {
      startNew();
    }
  }

  window.AeneidTrail = {
    init() {
      const btnNew = el("btn-new");
      const btnContinue = el("btn-continue");
      if (btnNew) btnNew.addEventListener("click", startNew);
      if (btnContinue) btnContinue.addEventListener("click", continueGame);

      if (localStorage.getItem(STORAGE_KEY)) {
        if (btnContinue) btnContinue.style.display = "inline-block";
      } else {
        if (btnContinue) btnContinue.style.display = "none";
      }

      showScreen("title-screen");
    }
  };
})();
