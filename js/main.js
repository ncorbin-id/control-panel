import { state } from "./state.js";
import { getDomElements } from "./dom.js";
import { applyCurrentCase } from "./cases.js";
import { togglePower, cycleSelector, evaluateFire, resetMachine } from "./machine.js";
import { render } from "./render.js";
import { createDebugPanel, updateDebugPanel } from "./debug.js";

const el = getDomElements();

function rerender() {
  render(state, el, updateDebugPanel);
}

function resetToCurrentCase() {
  resetMachine(state);
  applyCurrentCase(state);
  rerender();
}

el.spSwitch.addEventListener("click", () => {
  togglePower(state, rerender);
  rerender();
});

el.esSelector.addEventListener("click", () => {
  cycleSelector(state);
  rerender();
});

el.fmButton.addEventListener("click", () => {
  evaluateFire(state, "FM");
  rerender();
});

el.fsButton.addEventListener("click", () => {
  evaluateFire(state, "FS");
  rerender();
});

applyCurrentCase(state);
createDebugPanel(state, { rerender, resetToCurrentCase });
rerender();