import { state } from "./state.js";
import { getDomElements } from "./dom.js";
import { applyCurrentCase, setCase, nextCase, getCurrentCase } from "./cases.js";
import {
  togglePower,
  cycleSelector,
  evaluateFire,
  resetMachine
} from "./machine.js";
import { render } from "./render.js";
import { createDebugPanel, updateDebugPanel } from "./debug.js";
import { initInstructions } from "./instructions.js";

const STORAGE_KEY = "phaserTraining";

const el = getDomElements();

/* =========================
   RENDER WRAPPER
========================= */

function rerender() {
  render(state, el, updateDebugPanel);
}

/* =========================
   RESET
========================= */

function resetToCurrentCase() {
  resetMachine(state);
  applyCurrentCase(state);
  state.ui.panelMessage = "";
  rerender();
}

/* =========================
   PANEL MESSAGE HELPERS
========================= */

function clearPanelMessage() {
  state.ui.panelMessage = "";
}

/* =========================
   LOCAL STORAGE HELPERS
========================= */

function getStoredData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function setStoredData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* =========================
   BUTTON HANDLERS
========================= */

function showReflection(path) {
  el.reflectionGeneralHelp.hidden = path !== "general-help";
  el.reflectionSolved.hidden = path !== "solved";
  el.reflectionHelp.hidden = path !== "help";
  el.reflectionContinue.hidden = path !== "general-help";
  el.tryAgain.hidden = path === "general-help";
  el.reflectionOverlay.hidden = false;
}

function handleSuccessDismiss() {
  const existing = getStoredData();

  setStoredData({
    ...existing,
    successRecognized: true,
    successCount: (existing.successCount || 0) + 1,
    lastSuccessAt: new Date().toISOString()
  });

  clearPanelMessage();

  if (getCurrentCase(state).reflectionCase) {
    showReflection("solved");
  } else if (state.ui.testMode) {
    nextCase(state);
    resetToCurrentCase();
  } else {
    resetToCurrentCase();
  }
}

function handleReset() {
  clearPanelMessage();
  resetToCurrentCase();
}

function handleTestMe() {
  clearPanelMessage();
  state.ui.testMode = true;
  resetToCurrentCase();
}

function handleReflectionContinue() {
  el.reflectionOverlay.hidden = true;
}

function handleHelpRequested() {
  clearPanelMessage();
  showReflection(getCurrentCase(state).reflectionCase ? "help" : "general-help");
}

function handleTryAgain() {
  el.reflectionOverlay.hidden = true;
  state.ui.testMode = false;
  setCase(state, 0);
  resetToCurrentCase();
}

/* =========================
   MACHINE INTERACTIONS
========================= */

el.spSwitch.addEventListener("click", () => {
  clearPanelMessage();
  togglePower(state, rerender);
  rerender();
});

el.esSelector.addEventListener("click", () => {
  clearPanelMessage();
  cycleSelector(state);
  rerender();
});

function handleFireResult() {
  rerender();
  if (state.machine.pfLit && getCurrentCase(state).reflectionCase) {
    showReflection("solved");
  }
}

el.fmButton.addEventListener("click", () => {
  clearPanelMessage();
  evaluateFire(state, "FM");
  handleFireResult();
});

el.fsButton.addEventListener("click", () => {
  clearPanelMessage();
  evaluateFire(state, "FS");
  handleFireResult();
});

/* =========================
   PANEL ACTION BUTTONS
========================= */

el.successDismiss.addEventListener("click", handleSuccessDismiss);
el.resetPanel.addEventListener("click", handleReset);
el.testMe.addEventListener("click", handleTestMe);
el.helpButton.addEventListener("click", handleHelpRequested);
el.reflectionContinue.addEventListener("click", handleReflectionContinue);
el.tryAgain.addEventListener("click", handleTryAgain);

/* =========================
   INIT
========================= */

applyCurrentCase(state);
createDebugPanel();
initInstructions(el);
rerender();
