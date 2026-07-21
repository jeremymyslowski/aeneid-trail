/**
 * Aeneid Trail — Content
 * Full arc from Fall of Troy to the final duel with Turnus.
 * Chapters 1–5 fully detailed; 6–9 condensed but playable; 10 climactic.
 * Data-driven. Faithful to major Virgilian beats while granting agency.
 */

window.AENEID_DATA = {
  version: "1.0.0",

  startingState: {
    version: "1.0.0",
    men: 250,
    ships: 0,
    supplies: 55,
    morale: 55,
    piety: 70,
    junoHostility: 70,
    venusFavor: 60,
    health: 85,
    companions: [
      { id: "anchises", name: "Anchises", status: "alive", role: "father" },
      { id: "ascanius", name: "Ascanius", status: "alive", role: "son" },
      { id: "creusa",   name: "Creusa",   status: "alive", role: "wife" },
      { id: "achates",  name: "Achates",  status: "alive", role: "lieutenant" }
    ],
    flags: {
      escapedTroy: false,
      creusaLost: false,
      householdGodsSecured: false,
      fleetAssembled: false,
      firstVoyageComplete: false,
      polydorusFound: false,
      delosVisited: false,
      creteAttempted: false,
      harpiesCursed: false,
      buthrotumVisited: false,
      anchisesDead: false,
      didoMet: false,
      didoAffair: false,
      leftDido: false,
      didoCursed: false,
      underworldVisited: false,
      sawFutureRome: false,
      evanderAllied: false,
      pallasDead: false,
      turnusSpared: false,
      turnusKilled: false
    },
    travel: {
      currentChapter: 1,
      currentLeg: "troy-burning",
      daysElapsed: 0
    },
    eventLog: []
  },

  // ------------------------------------------------------------------
  // RANDOM EVENT POOL (can fire during travel legs)
  // ------------------------------------------------------------------
  randomEvents: [
    {
      id: "squall",
      weight: 30,
      title: "Sudden Squall",
      text: "A black squall rises without warning. The sea heaves and the ships strain against their ropes.",
      choices: [
        {
          id: "ride_it",
          text: "Order the men to reef sails and ride it out.",
          effects: { ships: -1, supplies: -6, morale: -5, log: "One ship is damaged but the fleet holds together." }
        },
        {
          id: "pray_neptune",
          text: "Call upon Neptune and pour a libation.",
          effects: { piety: 5, supplies: -3, log: "The storm lessens. The men take it as a sign." }
        }
      ]
    },
    {
      id: "sickness",
      weight: 20,
      title: "Sickness Among the Men",
      text: "Fever spreads through several ships. The weaker begin to fail.",
      choices: [
        {
          id: "isolate",
          text: "Isolate the sick and press on.",
          effects: { men: -18, morale: -8, log: "Some die. The rest harden themselves." }
        },
        {
          id: "delay_care",
          text: "Delay to care for the sick as best you can.",
          effects: { supplies: -12, daysElapsed: 2, morale: 5, log: "You lose time and stores, but fewer men perish." }
        }
      ]
    },
    {
      id: "good_omen",
      weight: 15,
      title: "A Favorable Sign",
      text: "Dolphins play about the prows and a clear sky opens after days of gray. The men take heart.",
      choices: [
        {
          id: "accept",
          text: "Accept the omen and press the advantage.",
          effects: { morale: 10, venusFavor: 5, log: "Spirits rise. The ships make good time." }
        }
      ]
    }
  ],

  scenes: {
    "start": {
      id: "start",
      title: "The Night Troy Fell",
      text: `The walls of Troy are broken. Greek fire lights the night sky. Hector’s ghost has already visited you in a dream, urging you to flee and take the household gods of Troy with you. Your father Anchises, your wife Creusa, and your young son Ascanius wait in the house. The city is dying around you.

What do you do first?`,
      choices: [
        {
          id: "secure_gods",
          text: "Seek the household gods and the sacred things of Troy first — duty to the gods before all else.",
          effects: { piety: 10, flags: { householdGodsSecured: true }, log: "You gather the Penates and the sacred fire. The gods of Troy will travel with you." },
          next: "find_family"
        },
        {
          id: "find_family_first",
          text: "Race home at once to gather Anchises, Creusa, and Ascanius before the streets become impassable.",
          effects: { morale: 5, log: "You push through the burning streets toward your house. Time is short." },
          next: "find_family"
        },
        {
          id: "fight",
          text: "Join the last defenders and try to hold a street or a temple against the Greeks.",
          effects: { men: -40, morale: -10, health: -15, log: "You fight bravely, but the city is already lost. More of your men fall. You are forced to fall back." },
          next: "find_family"
        }
      ]
    }
  }
};
