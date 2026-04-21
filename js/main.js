import { state } from "./state.js";
import { getDomElements } from "./dom.js";
import { applyCurrentCase } from "./cases.js";
import {
  togglePower,
  cycleSelector,
  evaluateFire,
  resetMachine
} from "./machine.js";
import { render } from "./render.js";
import { createDebugPanel, updateDebugPanel } from "./debug.js";

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

function setPanelMessage(message) {
  state.ui.panelMessage = message;
}

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

function handleSuccess() {
  if (!state.machine.pfLit) {
    setPanelMessage(
      "The PF Indicator is not illuminated. Success cannot be registered. Try again or select <b>Reset</b>."
    );
    rerender();
    return;
  }

  const existing = getStoredData();

  const updated = {
    ...existing,
    successRecognized: true,
    successCount: (existing.successCount || 0) + 1,
    lastSuccessAt: new Date().toISOString()
  };

  setStoredData(updated);

  clearPanelMessage();
  resetToCurrentCase();
}

function handleReset() {
  clearPanelMessage();
  resetToCurrentCase();
}

function handleTestMe() {
  clearPanelMessage();
  // Placeholder for future logic
  setPanelMessage("Test me is not active yet.");
  rerender();
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

el.fmButton.addEventListener("click", () => {
  clearPanelMessage();
  evaluateFire(state, "FM");
  rerender();
});

el.fsButton.addEventListener("click", () => {
  clearPanelMessage();
  evaluateFire(state, "FS");
  rerender();
});

/* =========================
   PANEL ACTION BUTTONS
========================= */

el.markSuccess.addEventListener("click", handleSuccess);
el.resetPanel.addEventListener("click", handleReset);
el.testMe.addEventListener("click", handleTestMe);

/* =========================
   INIT
========================= */

applyCurrentCase(state);
createDebugPanel();
rerender();