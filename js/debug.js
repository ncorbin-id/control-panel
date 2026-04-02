import { cases, setCase, nextCase, applyCurrentCase } from "./cases.js";
import { resetMachine } from "./machine.js";

let debugEls = null;

export function createDebugPanel(state, { rerender }) {
  const panel = document.createElement("div");
  panel.id = "debug-panel";
  panel.style.position = "fixed";
  panel.style.top = "8px";
  panel.style.right = "8px";
  panel.style.zIndex = "9999";
  panel.style.padding = "10px";
  panel.style.background = "rgba(255,255,255,0.92)";
  panel.style.border = "1px solid #0b5cab";
  panel.style.borderRadius = "8px";
  panel.style.fontSize = "12px";
  panel.style.lineHeight = "1.3";
  panel.style.fontFamily = "system-ui, sans-serif";
  panel.style.minWidth = "190px";
  panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";

  panel.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 8px;">Debug</div>

    <label style="display:block; margin-bottom:4px;">
      Case
      <select id="debug-case" style="display:block; width:100%; margin-top:2px;">
        ${cases
          .map((item, index) => {
            return `<option value="${index}">${index + 1} - ${item.machineState} + guidance ${item.guidance}</option>`;
          })
          .join("")}
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
      <button id="debug-next" type="button">Next case</button>
    </div>

    <div id="debug-status" style="margin-top:8px; opacity:0.8;"></div>
  `;

  document.body.appendChild(panel);

  debugEls = {
    panel,
    caseSelect: panel.querySelector("#debug-case"),
    machine: panel.querySelector("#debug-machine"),
    guidance: panel.querySelector("#debug-guidance"),
    reset: panel.querySelector("#debug-reset"),
    next: panel.querySelector("#debug-next"),
    status: panel.querySelector("#debug-status")
  };

  debugEls.caseSelect.addEventListener("change", (e) => {
    const index = Number(e.target.value);
    setCase(state, index);
    resetMachine(state);
    applyCurrentCase(state);
    rerender();
  });

  debugEls.machine.addEventListener("change", (e) => {
    state.caseData.machineState = e.target.value;
    state.debug.manualOverride = true;
    rerender();
  });

  debugEls.guidance.addEventListener("change", (e) => {
    state.caseData.guidance = e.target.value;
    state.debug.manualOverride = true;
    rerender();
  });

  debugEls.reset.addEventListener("click", () => {
    resetMachine(state);
    applyCurrentCase(state);
    rerender();
  });

  debugEls.next.addEventListener("click", () => {
    const advanced = nextCase(state);
    if (!advanced) return;

    resetMachine(state);
    applyCurrentCase(state);
    rerender();
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