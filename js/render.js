import { isSelectorEnabled, areFireButtonsEnabled } from "./machine.js";
import { getCurrentCase, cases } from "./cases.js";
import { updateInstructionsUI } from "./instructions.js";

const SUCCESS_MESSAGE_DEFAULT = "Phasers fired successfully.";

export function render(state, el, updateDebugPanel) {
  /* =========================
     Indicators
  ========================= */

  el.spIndicator.classList.toggle(
    "warming",
    state.machine.power && state.machine.ebWarming && !state.machine.ebReady
  );

  el.spIndicator.classList.toggle(
    "on",
    state.machine.power && state.machine.ebReady
  );

  el.ebIndicator.classList.toggle("on", state.machine.ebReady);
  el.maIndicator.classList.toggle("on", state.machine.chargedSource === "MA");
  el.pfIndicator.classList.toggle("on", state.machine.pfLit);

  /* =========================
     SP switch
  ========================= */

  el.spSwitch.selected = state.machine.power;

  /* =========================
     Selector position
  ========================= */

  el.esSelector.classList.remove("pos-ma", "pos-sa", "pos-n");

  if (state.machine.selector === "MA") {
    el.esSelector.classList.add("pos-ma");
    el.esSelector.setAttribute("aria-valuenow", "0");
    el.esSelector.setAttribute("aria-valuetext", "Main Accumulator");
  } else if (state.machine.selector === "SA") {
    el.esSelector.classList.add("pos-sa");
    el.esSelector.setAttribute("aria-valuenow", "1");
    el.esSelector.setAttribute("aria-valuetext", "Secondary Accumulator");
  } else {
    el.esSelector.classList.add("pos-n");
    el.esSelector.setAttribute("aria-valuenow", "2");
    el.esSelector.setAttribute("aria-valuetext", "Neutral");
  }

  /* =========================
     Enable / disable controls
  ========================= */

  const locked = state.machine.pfLit;
  const selectorEnabled = !locked && isSelectorEnabled(state);
  const fireEnabled = !locked && areFireButtonsEnabled(state);

  el.spSwitch.disabled = locked;
  el.esSelector.disabled = !selectorEnabled;
  el.esSelector.setAttribute("aria-disabled", selectorEnabled ? "false" : "true");

  el.fmButton.disabled = !fireEnabled;
  el.fsButton.disabled = !fireEnabled;
  el.fmButton.setAttribute("aria-disabled", fireEnabled ? "false" : "true");
  el.fsButton.setAttribute("aria-disabled", fireEnabled ? "false" : "true");

  /* =========================
     Panel message
  ========================= */

  if (el.panelMessage) {
    el.panelMessage.innerHTML = state.ui.panelMessage || "";
  }

  /* =========================
     Success notification
  ========================= */

  const isReflectionCase = getCurrentCase(state)?.reflectionCase ?? false;

  if (el.successNotification) {
    el.successNotification.hidden = !state.machine.pfLit || isReflectionCase;

    if (state.machine.pfLit && !isReflectionCase && el.successMessage) {
      el.successMessage.textContent = SUCCESS_MESSAGE_DEFAULT;
    }
  }

  /* =========================
     Help button
  ========================= */

  if (el.helpButton) {
    el.helpButton.hidden = !state.ui.testMode;
  }

  /* =========================
     Test mode status
  ========================= */

  if (el.testModeStatus) {
    el.testModeStatus.hidden = !state.ui.testMode;
    if (state.ui.testMode) {
      const current = state.app.caseIndex + 1;
      const total = cases.length;
      el.caseDisplay.textContent = `Test ${current} of ${total}`;
      el.caseProgress.value = current / total;
    }
  }

  /* =========================
     Instructions UI
  ========================= */

  updateInstructionsUI(state, el);

  /* =========================
     Debug panel
  ========================= */

  if (typeof updateDebugPanel === "function") {
    updateDebugPanel(state);
  }
}
