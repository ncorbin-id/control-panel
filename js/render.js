import { isSelectorEnabled, areFireButtonsEnabled } from "./machine.js";
import { updateInstructionsUI } from "./instructions.js";

export function render(state, el, updateDebugPanel) {
  // Indicators
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

  // SP switch
  el.spSwitch.classList.toggle("on", state.machine.power);

  // Selector position
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

  // Enable / disable controls
  const selectorEnabled = isSelectorEnabled(state);
  const fireEnabled = areFireButtonsEnabled(state);

  el.esSelector.disabled = !selectorEnabled;
  el.esSelector.setAttribute("aria-disabled", selectorEnabled ? "false" : "true");

  el.fmButton.disabled = !fireEnabled;
  el.fsButton.disabled = !fireEnabled;
  el.fmButton.setAttribute("aria-disabled", fireEnabled ? "false" : "true");
  el.fsButton.setAttribute("aria-disabled", fireEnabled ? "false" : "true");

  // Guidance + debug
  updateInstructionsUI(state, el);

  if (typeof updateDebugPanel === "function") {
    updateDebugPanel(state);
  }
}