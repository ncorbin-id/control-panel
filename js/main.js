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

let _panelMessageTimer = null;
let _panelFadeTimer = null;

function setPanelMessage(message) {
  state.ui.panelMessage = message;
  if (_panelMessageTimer) clearTimeout(_panelMessageTimer);
  if (_panelFadeTimer) clearTimeout(_panelFadeTimer);
  if (el.panelMessage) el.panelMessage.style.opacity = "1";
  _panelFadeTimer = setTimeout(() => {
    if (el.panelMessage) el.panelMessage.style.opacity = "0";
  }, 3400);
  _panelMessageTimer = setTimeout(() => {
    state.ui.panelMessage = "";
    if (el.panelMessage) el.panelMessage.style.opacity = "1";
    rerender();
    _panelMessageTimer = null;
    _panelFadeTimer = null;
  }, 4000);
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

function handleSuccessDismiss() {
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
  state.ui.testMode = true;
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

el.successDismiss.addEventListener("click", handleSuccessDismiss);
el.resetPanel.addEventListener("click", handleReset);
el.testMe.addEventListener("click", handleTestMe);

/* =========================
   INIT
========================= */

applyCurrentCase(state);
createDebugPanel(state, { rerender, resetToCurrentCase });
rerender();
