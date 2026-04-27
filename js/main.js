import { state } from "./state.js";
import { getDomElements } from "./dom.js";
import { applyCurrentCase, setCase, nextCase, getCurrentCase } from "./cases.js";
import {
  togglePower,
  setSelector,
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

const REFLECTION_STEPS = {
  help: [
    { heading: "Something's up", body: "It seems like you've encountered a system malfunction. Something on the control panel isn't operating as expected. But do you know why?" },
    { heading: "Something's up", body: "When we learn new systems by memorizing procedures, we risk limiting our ability to think creatively and strategically about what to do when things go off track." },
    { heading: "Something's up", body: "Next, you'll try learning this system again using a different approach." },
  ],
  solved: [
    { heading: "You got it, but how?", body: "You experienced a system malfunction. The MA Indicator didn't illuminate, but you found a way to fire phasers. But do you understand why that worked, or was it a lucky guess?" },
    { heading: "You got it, but how?", body: "When we learn new systems by memorizing procedures, we risk limiting our ability to think creatively and strategically about what to do when things go off track." },
    { heading: "You got it, but how?", body: "Next, you'll try learning this system again using a different approach." },
  ],
};

let reflectionSteps = [];
let reflectionStep = 0;

function renderReflectionStep() {
  const stepData = reflectionSteps[reflectionStep];
  el.reflectionStepContent.innerHTML =
    `<h3 class="reflection-heading">${stepData.heading}</h3><p class="reflection-body">${stepData.body}</p>`;
  Array.from(el.reflectionDots.querySelectorAll(".reflection-dot")).forEach((dot, i) => {
    dot.classList.toggle("is-active", i === reflectionStep);
  });
  el.reflectionNext.textContent = reflectionStep === reflectionSteps.length - 1 ? "Try again" : "Next";
}

function showReflection(path) {
  const isStepPath = path === "help" || path === "solved";
  el.reflectionGeneralHelp.hidden = isStepPath;
  el.reflectionStepsPanel.hidden = !isStepPath;

  if (isStepPath) {
    reflectionSteps = REFLECTION_STEPS[path];
    reflectionStep = 0;
    el.reflectionDots.innerHTML = reflectionSteps.map(() =>
      `<div class="reflection-dot"></div>`
    ).join("");
    renderReflectionStep();
  }

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
  document.body.classList.add("panel-collapsed");
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
  document.body.classList.remove("panel-collapsed");
  setCase(state, 0);
  resetToCurrentCase();
}

/* =========================
   TUTORIAL
========================= */

function initTutorial() {
  const steps = Array.from(el.tutorialCard.querySelectorAll(".tutorial-step"));
  const total = steps.length;
  let current = 0;

  const dotsContainer = el.tutorialCard.querySelector(".tutorial-dots");
  steps.forEach(() => {
    const dot = document.createElement("div");
    dot.className = "tutorial-dot";
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.querySelectorAll(".tutorial-dot"));

  function positionSpotlight(target) {
    if (!target) {
      el.tutorialSpotlight.hidden = true;
      return;
    }
    const pad = 6;
    const rect = target.getBoundingClientRect();
    el.tutorialSpotlight.style.top    = `${rect.top    - pad}px`;
    el.tutorialSpotlight.style.left   = `${rect.left   - pad}px`;
    el.tutorialSpotlight.style.width  = `${rect.width  + pad * 2}px`;
    el.tutorialSpotlight.style.height = `${rect.height + pad * 2}px`;
    el.tutorialSpotlight.hidden = false;
  }

  function positionCard(target, placement) {
    const card = el.tutorialCard;
    const margin = 16;
    const pad = 8;

    if (!target) {
      card.style.top = "50%";
      card.style.left = "50%";
      card.style.transform = "translate(-50%, -50%)";
      return;
    }

    card.style.transform = "";
    const rect = target.getBoundingClientRect();
    const cardW = card.offsetWidth || 300;
    const cardH = card.offsetHeight || 140;

    let top, left;

    switch (placement) {
      case "right":
        left = rect.right + pad + margin;
        top  = rect.top;
        break;
      case "left":
        left = rect.left - cardW - pad - margin;
        top  = rect.top;
        break;
      case "above":
        top  = rect.top - cardH - pad - margin;
        left = rect.left;
        break;
      default: // below
        top  = rect.bottom + pad + margin;
        left = rect.left;
    }

    left = Math.max(margin, Math.min(left, window.innerWidth  - cardW - margin));
    top  = Math.max(margin, Math.min(top,  window.innerHeight - cardH - margin));

    card.style.top  = `${top}px`;
    card.style.left = `${left}px`;
  }

  const arrowClassMap = {
    right: "arrow-left",
    left:  "arrow-right",
    above: "arrow-down",
    below: "arrow-up"
  };

  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    dots.forEach((dot,  i) => dot.classList.toggle("is-active",  i === index));
    el.tutorialBtn.textContent = index === total - 1 ? "Continue" : "Next";

    const target    = el[steps[index].dataset.target]    ?? null;
    const placement = steps[index].dataset.placement ?? "below";

    el.tutorialCard.classList.remove("arrow-left", "arrow-right", "arrow-up", "arrow-down");
    if (target && arrowClassMap[placement]) {
      el.tutorialCard.classList.add(arrowClassMap[placement]);
    }

    el.tutorialOverlay.hidden = target !== null;
    positionSpotlight(target);
    positionCard(target, placement);
  }

  function closeTutorial() {
    el.tutorialCard.hidden = true;
    el.tutorialSpotlight.hidden = true;
    el.tutorialOverlay.hidden = true;
  }

  function restart() {
    document.body.classList.remove("panel-collapsed");
    // Wait for panel animation to complete before showing tutorial
    setTimeout(() => {
      current = 0;
      el.tutorialCard.hidden = false;
      showStep(0);
    }, 350);
  }

  el.tutorialBtn.addEventListener("click", () => {
    if (current < total - 1) {
      current += 1;
      showStep(current);
    } else {
      closeTutorial();
    }
  });

  el.tutorialClose.addEventListener("click", closeTutorial);

  el.tutorialRestartBtn.addEventListener("click", restart);

  el.tutorialCard.hidden = false;
  showStep(0);
}

/* =========================
   MACHINE INTERACTIONS
========================= */

el.panelToggle.addEventListener("click", () => {
  document.body.classList.toggle("panel-collapsed");
});

el.spSwitch.addEventListener("change", () => {
  clearPanelMessage();
  togglePower(state, rerender);
  rerender();
});

el.esSelector.addEventListener("input", () => {
  clearPanelMessage();
  setSelector(state, parseInt(el.esSelector.value, 10));
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
el.reflectionNext.addEventListener("click", () => {
  if (reflectionStep < reflectionSteps.length - 1) {
    reflectionStep += 1;
    renderReflectionStep();
  } else {
    handleTryAgain();
  }
});

/* =========================
   INIT
========================= */

applyCurrentCase(state);
createDebugPanel();
initTutorial();
rerender();
