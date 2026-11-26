/**
 * Kopfrechnen Beamer - Hauptanwendungslogik
 * Verwaltet Ansichten, State, Tastatursteuerung & UI-Interaktionen
 */

// Stufen-Metadaten für die Auswahlkarten
const LEVEL_METADATA = [
  {
    level: 1,
    title: "Stufe 1",
    subtitle: "Grundlagen bis 1000",
    tag: "Natürliche Zahlen",
    desc: "Nur Addition und Subtraktion bis 1000, nur natürliche Zahlen (Ergebnis ≥ 0), runde und gut im Kopf machbare Zahlen."
  },
  {
    level: 2,
    title: "Stufe 2",
    subtitle: "Überträge bis 1000",
    tag: "Höhere Schwierigkeit",
    desc: "Zahlenraum bis 1000, natürliche Zahlen, anspruchsvollere Zehner- und Hunderterübergänge, unrunde Zahlen."
  },
  {
    level: 3,
    title: "Stufe 3",
    subtitle: "1 Dezimalstelle (bis 200)",
    tag: "Positive Kommazahlen",
    desc: "Zahlenraum bis 200, rationale Zahlen mit maximal 1 Kommastelle, nur positive Ergebnisse (Addition, Subtraktion, einfache Multiplikation/Division)."
  },
  {
    level: 4,
    title: "Stufe 4",
    subtitle: "Multiplikation & Division (bis 500)",
    tag: "Großes 1x1 & Komma",
    desc: "Zahlenraum bis 500, zweistellige Zahlen mal einstellige Zahlen, saubere Divisionen und Dezimalzahlen mit 1 Nachkommastelle."
  },
  {
    level: 5,
    title: "Stufe 5",
    subtitle: "Zweistellige Faktoren (bis 1000)",
    tag: "Erweiterte Rechenarten",
    desc: "Zahlenraum bis 1000, Multiplikation und Division mit zweistelligen Faktoren (z. B. 15 · 24, 625 : 25) und Komma-Multiplikation."
  },
  {
    level: 6,
    title: "Stufe 6",
    subtitle: "2 Dezimalstellen",
    tag: "Hundertstel & Viertel",
    desc: "Addition und Subtraktion mit 2 Nachkommastellen (Geld-/Kommazahlen), Multiplikation und Division mit Viertel-, Fünftel- und Hundertstel-Ergebnissen."
  },
  {
    level: 7,
    title: "Stufe 7",
    subtitle: "Negative Zahlen",
    tag: "Vorzeichenregeln",
    desc: "Einführung von negativen Zahlen: Subtraktionen mit negativem Ergebnis, gemischte Vorzeichen (-a + b, a - (-b)) und rationale Zahlen."
  },
  {
    level: 8,
    title: "Stufe 8",
    subtitle: "Potenzen & Wurzeln",
    tag: "Quadrate, Kubik, √",
    desc: "Quadratzahlen bis 25², Potenzen von 2 und 3, Quadratwurzeln (√144 bis √900) sowie Multiplikation und Division mit negativen Zahlen."
  },
  {
    level: 9,
    title: "Stufe 9",
    subtitle: "Terme & Punkt vor Strich",
    tag: "Kombinierte Terme",
    desc: "Terme mit Punkt vor Strich, Potenzen mit negativer Basis, Dezimalpotenzen (z. B. 1,5²) und Vorzeichenrechnung bis 1000."
  },
  {
    level: 10,
    title: "Stufe 10",
    subtitle: "Königsklasse",
    tag: "Höchststufe",
    desc: "Volles Spektrum: Rationale Zahlen mit bis zu 2 Dezimalstellen, Potenzen, Wurzeln, negative Zahlen und mehrstufige Terme bis 1000."
  }
];

// Lustige Sprüche für den Abschlussbildschirm
const FINISH_QUOTES = [
  "Rauch steigt aus den Köpfen auf – die Synapsen haben Betriebstemperatur erreicht! 🔥🧠",
  "3 von 2 Menschen haben Probleme mit Mathe... aber ihr gehört definitiv nicht dazu! 🤓✨",
  "Kopfrechnen ist wie Fitnessstudio für das Gehirn – nur ohne Muskelkater am nächsten Tag! 💪🏋️",
  "Stift weglegen, durchatmen! Das waren 10 harte Nüsse, aber euer Gehirnschmalz hat gesiegt. 🥜⚡",
  "Mathe ist das Einzige, was zählt. Wortwörtlich! ➕➖✖️➗",
  "Wer braucht schon einen Taschenrechner, wenn man einen ganzen Klassenraum voller Genies hat? 🚀🧠",
  "Pi mal Daumen? Nicht bei uns! Hier wird millimetergenau im Kopf gerechnet. 🥧🎯",
  "Kopf frei, Tafel voll: Zeit für den großen Kassensturz! Schauen wir uns die Ergebnisse an! 🧐👏",
  "Hut ab! Euer biologischer Arbeitsspeicher ist heute absolut absturzsicher gelaufen. 💻🎉",
  "Gleichung gelöst, Puls normalisiert – das habt ihr meisterhaft durchgerechnet! 🏆😎",
  "Mathematiker schlafen nicht – sie zählen Schafe... in der Fibonacci-Folge! 🐑🔢",
  "Null Fehler, unendlicher Jubel? Sehen wir gleich in der Lösungsübersicht! ∞🎉"
];

// Mathematische Symbole mit passenden Smileys
const MATH_SYMBOLS = [
  { symbol: "∑", smileys: ["🎉", "🧠"] },
  { symbol: "π", smileys: ["🥧", "🤓"] },
  { symbol: "∞", smileys: ["🚀", "✨"] },
  { symbol: "√", smileys: ["💡", "😎"] },
  { symbol: "≠", smileys: ["🤔", "🔥"] },
  { symbol: "=", smileys: ["🎯", "👏"] },
  { symbol: "∫", smileys: ["🌊", "🏆"] },
  { symbol: "∆", smileys: ["⚡", "🤩"] }
];

// App-Zustand
const state = {
  currentView: "setup", // "setup" | "problem" | "finish" | "solutions"
  selectedLevel: 1,
  problems: [],
  currentIndex: 0,
  themeIndex: 0,
  themes: ["theme-dark", "theme-light", "theme-chalkboard"],
  themeIcons: ["🌙", "☀️", "🟩"]
};

// DOM Elemente
const dom = {
  // Views
  viewSetup: document.getElementById("view-setup"),
  viewProblem: document.getElementById("view-problem"),
  viewFinish: document.getElementById("view-finish"),
  viewSolutions: document.getElementById("view-solutions"),

  // Header
  badgeLevel: document.getElementById("badge-level"),
  headerProgress: document.getElementById("header-progress"),
  progressBar: document.getElementById("progress-bar"),
  headerCounter: document.getElementById("header-counter"),
  btnFullscreen: document.getElementById("btn-fullscreen"),
  btnTheme: document.getElementById("btn-theme"),
  themeIcon: document.getElementById("theme-icon"),
  iconFsEnter: document.getElementById("icon-fs-enter"),
  iconFsExit: document.getElementById("icon-fs-exit"),
  btnHelpToggle: document.getElementById("btn-help-toggle"),

  // Setup View
  levelsGrid: document.getElementById("levels-grid"),
  selectedLevelTitle: document.getElementById("selected-level-title"),
  selectedLevelDesc: document.getElementById("selected-level-desc"),
  btnStart: document.getElementById("btn-start"),

  // Problem View
  currentTaskNum: document.getElementById("current-task-num"),
  mathCard: document.getElementById("math-card"),
  mathExpression: document.getElementById("math-expression"),
  btnPrev: document.getElementById("btn-prev"),
  btnNext: document.getElementById("btn-next"),
  btnNextLabel: document.getElementById("btn-next-label"),
  btnAbort: document.getElementById("btn-abort"),

  // Finish View
  finishSymbol: document.getElementById("finish-symbol"),
  finishSmileyLeft: document.getElementById("finish-smiley-left"),
  finishSmileyRight: document.getElementById("finish-smiley-right"),
  finishQuoteText: document.getElementById("finish-quote-text"),
  finishLevelBadge: document.getElementById("finish-level-badge"),
  btnShowSolutions: document.getElementById("btn-show-solutions"),

  // Solutions View
  solutionsLevelBadge: document.getElementById("solutions-level-badge"),
  solutionsGrid: document.getElementById("solutions-grid"),
  btnNewRound: document.getElementById("btn-new-round"),
  btnChangeLevel: document.getElementById("btn-change-level"),
  btnPrint: document.getElementById("btn-print"),

  // Modal Help
  modalHelp: document.getElementById("modal-help"),
  btnHelpClose: document.getElementById("btn-help-close"),
  btnHelpOk: document.getElementById("btn-help-ok")
};

/**
 * Initialisierung beim Laden
 */
function init() {
  renderLevelGrid();
  selectLevel(1);
  setupEventListeners();
  setupKeyboardNavigation();
  updateThemeIcon();
}

/**
 * Erzeugt die 10 Stufen-Kacheln auf dem Startbildschirm
 */
function renderLevelGrid() {
  dom.levelsGrid.innerHTML = "";
  LEVEL_METADATA.forEach(meta => {
    const tile = document.createElement("div");
    tile.className = `level-tile ${meta.level === state.selectedLevel ? "selected" : ""}`;
    tile.dataset.level = meta.level;
    tile.innerHTML = `
      <div class="tile-number">${meta.level}</div>
      <div class="tile-label">${meta.title}</div>
      <div class="tile-tag">${meta.tag}</div>
    `;
    tile.addEventListener("click", () => {
      selectLevel(meta.level);
    });
    dom.levelsGrid.appendChild(tile);
  });
}

/**
 * Stufe auswählen und Details aktualisieren
 */
function selectLevel(level) {
  state.selectedLevel = level;
  const meta = LEVEL_METADATA.find(m => m.level === level) || LEVEL_METADATA[0];

  dom.selectedLevelTitle.textContent = `${meta.title}: ${meta.subtitle}`;
  dom.selectedLevelDesc.textContent = meta.desc;

  // Markierung im Grid aktualisieren
  document.querySelectorAll(".level-tile").forEach(tile => {
    const tileLvl = parseInt(tile.dataset.level, 10);
    tile.classList.toggle("selected", tileLvl === level);
  });
}

/**
 * Wechselt die aktive Ansicht
 */
function switchView(viewName) {
  state.currentView = viewName;

  const views = [
    { name: "setup", el: dom.viewSetup },
    { name: "problem", el: dom.viewProblem },
    { name: "finish", el: dom.viewFinish },
    { name: "solutions", el: dom.viewSolutions }
  ];

  views.forEach(v => {
    if (v.name === viewName) {
      v.el.classList.remove("hidden");
    } else {
      v.el.classList.add("hidden");
    }
  });

  // Header-Elemente anpassen
  if (viewName === "setup") {
    dom.badgeLevel.classList.add("hidden");
    dom.headerProgress.classList.add("hidden");
  } else if (viewName === "problem") {
    dom.badgeLevel.classList.remove("hidden");
    dom.badgeLevel.textContent = `Stufe ${state.selectedLevel}`;
    dom.headerProgress.classList.remove("hidden");
  } else if (viewName === "finish") {
    dom.badgeLevel.classList.remove("hidden");
    dom.badgeLevel.textContent = `Stufe ${state.selectedLevel}`;
    dom.headerProgress.classList.add("hidden");
  } else if (viewName === "solutions") {
    dom.badgeLevel.classList.remove("hidden");
    dom.badgeLevel.textContent = `Stufe ${state.selectedLevel}`;
    dom.headerProgress.classList.add("hidden");
  }
}

/**
 * Startet eine neue 10er-Runde
 */
function startRound() {
  state.problems = generateRound(state.selectedLevel, 10);
  state.currentIndex = 0;
  displayProblem(0);
  switchView("problem");
}

/**
 * Zeigt die Aufgabe an Index i an
 */
function displayProblem(index) {
  state.currentIndex = index;
  const problem = state.problems[index];
  const total = state.problems.length;
  const currentNum = index + 1;

  // Aufgabennummer oben links
  dom.currentTaskNum.textContent = `${currentNum} / ${total}`;
  dom.headerCounter.textContent = `${currentNum} / ${total}`;

  // Fortschrittsbalken
  const pct = (currentNum / total) * 100;
  dom.progressBar.style.width = `${pct}%`;

  // Rechnungstext
  dom.mathExpression.textContent = problem.text;

  // Zurück-Button aktivieren/deaktivieren
  dom.btnPrev.disabled = (index === 0);
  dom.btnPrev.style.opacity = index === 0 ? "0.4" : "1";

  // Weiter-Button Label anpassen
  if (currentNum === total) {
    dom.btnNextLabel.textContent = "Fertigstellen";
  } else {
    dom.btnNextLabel.textContent = "Weiter";
  }

  // Sanfte Animation für die neue Aufgabe
  dom.mathCard.style.transform = "scale(0.96)";
  dom.mathCard.style.opacity = "0.7";
  setTimeout(() => {
    dom.mathCard.style.transform = "scale(1)";
    dom.mathCard.style.opacity = "1";
  }, 40);
}

/**
 * Nächste Aufgabe anzeigen oder Runde beenden
 */
function nextProblem() {
  if (state.currentIndex < state.problems.length - 1) {
    displayProblem(state.currentIndex + 1);
  } else {
    showFinishScreen();
  }
}

/**
 * Vorherige Aufgabe anzeigen (wichtig für Lehrkräfte, falls Schüler nochmal schauen wollen)
 */
function prevProblem() {
  if (state.currentIndex > 0) {
    displayProblem(state.currentIndex - 1);
  }
}

/**
 * Ansicht 3: Abschlussbildschirm mit lustigem Spruch und Mathe-Symbol
 */
function showFinishScreen() {
  // Zufälliges Mathe-Symbol & Smileys
  const mathItem = MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)];
  dom.finishSymbol.textContent = mathItem.symbol;
  dom.finishSmileyLeft.textContent = mathItem.smileys[0];
  dom.finishSmileyRight.textContent = mathItem.smileys[1];

  // Zufälliger lustiger Spruch
  const quote = FINISH_QUOTES[Math.floor(Math.random() * FINISH_QUOTES.length)];
  dom.finishQuoteText.textContent = quote;

  dom.finishLevelBadge.textContent = `Stufe ${state.selectedLevel}`;

  switchView("finish");
}

/**
 * Ansicht 4: Alle 10 Lösungen auf einer einzigen Folie / Ansicht
 */
function showSolutionsScreen() {
  dom.solutionsLevelBadge.textContent = `Stufe ${state.selectedLevel} (${LEVEL_METADATA[state.selectedLevel - 1].subtitle})`;
  dom.solutionsGrid.innerHTML = "";

  state.problems.forEach((prob, i) => {
    const row = document.createElement("div");
    row.className = "solution-row";
    row.innerHTML = `
      <div class="solution-left">
        <span class="solution-num">${i + 1}.</span>
        <span class="solution-expr">${prob.text} =</span>
      </div>
      <div class="solution-badge">${prob.formattedResult}</div>
    `;
    dom.solutionsGrid.appendChild(row);
  });

  switchView("solutions");
}

/**
 * Vollbildmodus umschalten
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    dom.iconFsEnter.classList.add("hidden");
    dom.iconFsExit.classList.remove("hidden");
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    dom.iconFsEnter.classList.remove("hidden");
    dom.iconFsExit.classList.add("hidden");
  }
}

/**
 * Theme / Kontrast wechseln
 */
function cycleTheme() {
  document.body.classList.remove(...state.themes);
  state.themeIndex = (state.themeIndex + 1) % state.themes.length;
  document.body.classList.add(state.themes[state.themeIndex]);
  updateThemeIcon();
}

function updateThemeIcon() {
  dom.themeIcon.textContent = state.themeIcons[state.themeIndex];
}

/**
 * Event-Listener für Mausklicks und Buttons
 */
function setupEventListeners() {
  // Setup
  dom.btnStart.addEventListener("click", startRound);

  // Problem
  dom.btnNext.addEventListener("click", nextProblem);
  dom.btnPrev.addEventListener("click", prevProblem);
  dom.btnAbort.addEventListener("click", () => switchView("setup"));

  // Finish
  dom.btnShowSolutions.addEventListener("click", showSolutionsScreen);

  // Solutions
  dom.btnNewRound.addEventListener("click", startRound);
  dom.btnChangeLevel.addEventListener("click", () => switchView("setup"));
  dom.btnPrint.addEventListener("click", () => window.print());

  // Header
  dom.btnFullscreen.addEventListener("click", toggleFullscreen);
  dom.btnTheme.addEventListener("click", cycleTheme);

  // Help Modal
  dom.btnHelpToggle.addEventListener("click", () => {
    dom.modalHelp.classList.remove("hidden");
  });
  dom.btnHelpClose.addEventListener("click", () => {
    dom.modalHelp.classList.add("hidden");
  });
  dom.btnHelpOk.addEventListener("click", () => {
    dom.modalHelp.classList.add("hidden");
  });
  dom.modalHelp.addEventListener("click", (e) => {
    if (e.target === dom.modalHelp) dom.modalHelp.classList.add("hidden");
  });

  // Vollbild-Status Listener
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      dom.iconFsEnter.classList.add("hidden");
      dom.iconFsExit.classList.remove("hidden");
    } else {
      dom.iconFsEnter.classList.remove("hidden");
      dom.iconFsExit.classList.add("hidden");
    }
  });
}

/**
 * Globale Beamer-Tastatursteuerung
 */
function setupKeyboardNavigation() {
  window.addEventListener("keydown", (e) => {
    // Falls Hilfe-Modal offen ist: Esc schließt es
    if (!dom.modalHelp.classList.contains("hidden")) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dom.modalHelp.classList.add("hidden");
      }
      return;
    }

    // Globale Tasten
    // F: Vollbild
    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
      return;
    }

    // T: Farbschema / Theme
    if (e.key === "t" || e.key === "T") {
      e.preventDefault();
      cycleTheme();
      return;
    }

    // ?: Hilfe
    if (e.key === "?") {
      e.preventDefault();
      dom.modalHelp.classList.toggle("hidden");
      return;
    }

    // Tasten je nach aktueller Ansicht
    if (state.currentView === "setup") {
      // 1-9: Stufe 1 bis 9
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        selectLevel(parseInt(e.key, 10));
        return;
      }
      // 0: Stufe 10
      if (e.key === "0") {
        e.preventDefault();
        selectLevel(10);
        return;
      }
      // Pfeiltasten zur Stufenauswahl
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = state.selectedLevel < 10 ? state.selectedLevel + 1 : 1;
        selectLevel(next);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = state.selectedLevel > 1 ? state.selectedLevel - 1 : 10;
        selectLevel(prev);
        return;
      }
      // Leertaste oder Enter: Runde starten
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        startRound();
        return;
      }
    } else if (state.currentView === "problem") {
      // Leertaste / Enter / Pfeil rechts: Nächste Aufgabe
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        nextProblem();
        return;
      }
      // Pfeil links: Vorherige Aufgabe
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevProblem();
        return;
      }
      // Esc: Abbrechen -> Zurück zum Menü
      if (e.key === "Escape") {
        e.preventDefault();
        switchView("setup");
        return;
      }
    } else if (state.currentView === "finish") {
      // Leertaste / Enter / Pfeil rechts: Lösungen anzeigen
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        showSolutionsScreen();
        return;
      }
      // Esc: Zurück zum Menü
      if (e.key === "Escape") {
        e.preventDefault();
        switchView("setup");
        return;
      }
    } else if (state.currentView === "solutions") {
      // Leertaste / Enter: Neue Runde mit gleicher Stufe
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        startRound();
        return;
      }
      // Esc oder M: Stufe wechseln / Menü
      if (e.key === "Escape" || e.key === "m" || e.key === "M") {
        e.preventDefault();
        switchView("setup");
        return;
      }
    }
  });
}

// Start beim Laden des DOMs
document.addEventListener("DOMContentLoaded", init);
