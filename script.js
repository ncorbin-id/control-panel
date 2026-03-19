const mode = new URLSearchParams(window.location.search).get("mode") || "understand";

const sequence = [
  { key: "scenario1", machineState: "normal", guidance: "enabled" },
  { key: "scenario2", machineState: "normal", guidance: "locked" },
  { key: "scenario3", machineState: "maFailure", guidance: "locked" }
];

const state = {
  mode, // "understand" | "memorize"

  // sequence control
  sequenceIndex: 0,

  // machine control
  power: false,
  selector: "N", // "MA" | "SA" | "N"
  machineState: sequence[0].machineState, // "normal" | "maFailure"
  guidance: sequence[0].guidance, // "enabled" | "locked"

  // charging / indicators
  ebWarming: false,
  ebReady: false,
  chargedSource: null, // null | "MA" | "SA"
  pfLit: false,

  // timers
  warmupTimer: null,

  // debug
  debugManualOverride: false
};

const el = {
  spIndicator: document.getElementById("light-sp"),
  ebIndicator: document.getElementById("light-eb"),
  maIndicator: document.getElementById("light-ma"),
  pfIndicator: document.getElementById("light-pf"),

  spSwitch: document.getElementById("toggle-sp"),
  fmButton: document.getElementById("fire-main"),
  fsButton: document.getElementById("fire-secondary"),
  esSelector: document.getElementById("es-selector"),

  // Optional guidance hooks. These are safe if they do not exist yet.
  instructionsPanel: document.getElementById("instructions-panel"),
  instructionsToggle: document.getElementById("instructions-toggle"),
  instructionsLockMessage: document.getElementById("instructions-lock-message")
};

const selectorPositions = ["MA", "SA", "N"];

/* =========================
   Sequence helpers
========================= */

function getCurrentSequenceStep() {
  return sequence[state.sequenceIndex];
}

function applySequenceStep() {
  const step = getCurrentSequenceStep();

  if (!step) return;

  state.machineState = step.machineState;
  state.guidance = step.guidance;

  updateGuidanceUI();
}

function setSequenceStep(index) {
  if (index < 0 || index >= sequence.length) return;

  state.sequenceIndex = index;
  state.debugManualOverride = false;
  applySequenceStep();
  render();
}

function nextSequenceStep() {
  if (state.sequenceIndex < sequence.length - 1) {
    state.sequenceIndex += 1;
    state.debugManualOverride = false;
    applySequenceStep();
    resetMachine();
  }
}

/* =========================
   Machine helpers
========================= */

function getChargedSource() {
  return state.machineState === "maFailure" ? "SA" : "MA";
}

function isSelectorEnabled() {
  return state.power && state.ebReady;
}

function areFireButtonsEnabled() {
  return state.power && state.ebReady && state.chargedSource !== null;
}

function clearWarmupTimer() {
  if (state.warmupTimer) {
    clearTimeout(state.warmupTimer);
    state.warmupTimer = null;
  }
}

function startWarmup() {
  clearWarmupTimer();

  state.ebWarming = true;
  state.ebReady = false;
  state.chargedSource = null;
  state.pfLit = false;
  state.selector = "N";

  render();

  state.warmupTimer = setTimeout(() => {
    state.ebWarming = false;
    state.ebReady = true;
    state.chargedSource = getChargedSource();
    state.warmupTimer = null;
    render();
  }, 3000);
}

function resetMachine() {
  clearWarmupTimer();

  state.power = false;
  state.selector = "N";
  state.ebWarming = false;
  state.ebReady = false;
  state.chargedSource = null;
  state.pfLit = false;

  render();
}

function fullResetToCurrentScenario() {
  clearWarmupTimer();

  state.power = false;
  state.selector = "N";
  state.ebWarming = false;
  state.ebReady = false;
  state.chargedSource = null;
  state.pfLit = false;

  applySequenceStep();
  render();
}

/* =========================
   Guidance UI
========================= */

function updateGuidanceUI() {
  document.body.dataset.mode = state.mode;
  document.body.dataset.guidance = state.guidance;
  document.body.dataset.machineState = state.machineState;
  document.body.dataset.sequence = String(state.sequenceIndex + 1);

  if (el.instructionsPanel) {
    el.instructionsPanel.classList.toggle("guidance-locked", state.guidance === "locked");
    el.instructionsPanel.setAttribute(
      "aria-hidden",
      state.guidance === "locked" ? "true" : "false"
    );
  }

  if (el.instructionsToggle) {
    const locked = state.guidance === "locked";
    el.instructionsToggle.disabled = locked;
    el.instructionsToggle.setAttribute("aria-disabled", locked ? "true" : "false");
  }

  if (el.instructionsLockMessage) {
    el.instructionsLockMessage.hidden = state.guidance !== "locked";
  }
}

/* =========================
   Rendering
========================= */

function render() {
  // Indicators
  el.spIndicator.classList.toggle(
    "warming",
    state.power && state.ebWarming && !state.ebReady
  );

  el.spIndicator.classList.toggle(
    "on",
    state.power && state.ebReady
  );

  el.ebIndicator.classList.toggle("on", state.ebReady);
  el.maIndicator.classList.toggle("on", state.chargedSource === "MA");
  el.pfIndicator.classList.toggle("on", state.pfLit);

  // SP switch
  el.spSwitch.classList.toggle("on", state.power);

  // Selector position
  el.esSelector.classList.remove("pos-ma", "pos-sa", "pos-n");

  if (state.selector === "MA") {
    el.esSelector.classList.add("pos-ma");
    el.esSelector.setAttribute("aria-valuenow", "0");
    el.esSelector.setAttribute("aria-valuetext", "Main Accumulator");
  } else if (state.selector === "SA") {
    el.esSelector.classList.add("pos-sa");
    el.esSelector.setAttribute("aria-valuenow", "1");
    el.esSelector.setAttribute("aria-valuetext", "Secondary Accumulator");
  } else {
    el.esSelector.classList.add("pos-n");
    el.esSelector.setAttribute("aria-valuenow", "2");
    el.esSelector.setAttribute("aria-valuetext", "Neutral");
  }

  // Enable / disable controls
  const selectorEnabled = isSelectorEnabled();
  const fireEnabled = areFireButtonsEnabled();

  el.esSelector.disabled = !selectorEnabled;
  el.esSelector.setAttribute("aria-disabled", selectorEnabled ? "false" : "true");

  el.fmButton.disabled = !fireEnabled;
  el.fsButton.disabled = !fireEnabled;
  el.fmButton.setAttribute("aria-disabled", fireEnabled ? "false" : "true");
  el.fsButton.setAttribute("aria-disabled", fireEnabled ? "false" : "true");

  // Guidance + debug
  updateGuidanceUI();
  updateDebugPanel();
}

/* =========================
   Interaction handlers
========================= */

function togglePower() {
  if (!state.power) {
    state.power = true;
    state.pfLit = false;
    startWarmup();
  } else {
    fullResetToCurrentScenario();
  }

  render();
}

function cycleSelector() {
  if (!isSelectorEnabled()) return;

  const currentIndex = selectorPositions.indexOf(state.selector);
  const nextIndex = (currentIndex + 1) % selectorPositions.length;
  state.selector = selectorPositions[nextIndex];
  state.pfLit = false;
  render();
}

function evaluateFire(buttonType) {
  if (!areFireButtonsEnabled()) return;

  const correct =
    (state.chargedSource === "MA" && state.selector === "MA" && buttonType === "FM") ||
    (state.chargedSource === "SA" && state.selector === "SA" && buttonType === "FS");

  state.pfLit = correct;
  render();
}

function pressFireMain() {
  evaluateFire("FM");
}

function pressFireSecondary() {
  evaluateFire("FS");
}

/* =========================
   Debug panel
========================= */

let debugEls = null;

function createDebugPanel() {
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

function updateDebugPanel() {
  if (!debugEls) return;

  debugEls.sequence.value = String(state.sequenceIndex);
  debugEls.machine.value = state.machineState;
  debugEls.guidance.value = state.guidance;
  debugEls.status.textContent =
    `mode: ${state.mode} | source: ${state.chargedSource || "none"} | power: ${state.power ? "on" : "off"}`;
}

/* =========================
   Events
========================= */

el.spSwitch.addEventListener("click", togglePower);
el.esSelector.addEventListener("click", cycleSelector);
el.fmButton.addEventListener("click", pressFireMain);
el.fsButton.addEventListener("click", pressFireSecondary);

/* =========================
   Init
========================= */

applySequenceStep();
createDebugPanel();
render();