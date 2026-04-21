import { cases, setCase, nextCase, applyCurrentCase } from "./cases.js";
import { resetMachine } from "./machine.js";

let debugEls = null;

export function createDebugPanel() {
  console.log("Creating debug panel...");
  const panel = document.createElement("details");
  panel.id = "debug-panel";
  panel.style.position = "fixed";
  panel.style.top = "8px";
  panel.style.right = "8px";
  panel.style.zIndex = "9999";
  panel.style.background = "rgba(255,255,255,0.92)";
  panel.style.border = "1px solid #0b5cab";
  panel.style.borderRadius = "8px";
  panel.style.fontSize = "12px";
  panel.style.lineHeight = "1.3";
  panel.style.fontFamily = "system-ui, sans-serif";
  panel.style.minWidth = "190px";
  panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
  panel.style.overflow = "hidden";

  panel.innerHTML = `
    <summary style="cursor:pointer; padding:10px; font-weight:700; user-select:none;">Debug</summary>
    <div style="padding:0 10px 10px;">
      <label style="display:block; margin-bottom:4px;">
        Sequence step
        <select id="debug-sequence" style="display:block; width:100%; margin-top:2px;">
          <option value="0">1 - normal + guidance enabled</option>
          <option value="1">2 - normal + guidance locked</option>
          <option value="2">3 - MA failure + guidance locked</option>
        </select>
      </label>

      <label style="display:block; margin-bottom:4px;">
        Machine state
        <select id="debug-machine" style="display:block; width:100%; margin-top:2px;">
          <option value="normal">normal</option>
          <option value="maFailure">maFailure</option>
        </select>
      </label>

      <label style="display:block; margin-bottom:8px;">
        Guidance
        <select id="debug-guidance" style="display:block; width:100%; margin-top:2px;">
          <option value="enabled">enabled</option>
          <option value="locked">locked</option>
        </select>
      </label>

      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button id="debug-reset" type="button">Reset</button>
        <button id="debug-next" type="button">Next scenario</button>
      </div>

      <div id="debug-status" style="margin-top:8px; opacity:0.8;"></div>
    </div>
  `;

  document.body.appendChild(panel);

  debugEls = {
    panel,
    sequence: panel.querySelector("#debug-sequence"),
    machine: panel.querySelector("#debug-machine"),
    guidance: panel.querySelector("#debug-guidance"),
    reset: panel.querySelector("#debug-reset"),
    next: panel.querySelector("#debug-next"),
    status: panel.querySelector("#debug-status")
  };

  debugEls.sequence.addEventListener("change", (e) => {
    const index = Number(e.target.value);
    state.sequenceIndex = index;
    state.debugManualOverride = false;
    applySequenceStep();
    fullResetToCurrentScenario();
  });

  debugEls.machine.addEventListener("change", (e) => {
    state.machineState = e.target.value;
    state.debugManualOverride = true;
    render();
  });

  debugEls.guidance.addEventListener("change", (e) => {
    state.guidance = e.target.value;
    state.debugManualOverride = true;
    updateGuidanceUI();
    render();
  });

  debugEls.reset.addEventListener("click", () => {
    fullResetToCurrentScenario();
  });

  debugEls.next.addEventListener("click", () => {
    nextSequenceStep();
  });
}

export function updateDebugPanel(state) {
  if (!debugEls) return;

  debugEls.caseSelect.value = String(state.app.caseIndex);
  debugEls.machine.value = state.caseData.machineState;
  debugEls.guidance.value = state.caseData.guidance;

  debugEls.status.textContent =
    `mode: ${state.app.mode} | source: ${state.machine.chargedSource || "none"} | power: ${state.machine.power ? "on" : "off"}`;
}