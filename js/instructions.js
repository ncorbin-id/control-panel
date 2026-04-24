let _practiceInstructions = null;
let _testInstructions = null;

export function initInstructions(el) {
  if (el.taskInstructions) {
    _practiceInstructions = el.taskInstructions.innerHTML;
  }

  const testTemplate = document.getElementById("task-instructions-test");
  if (testTemplate) {
    _testInstructions = testTemplate.innerHTML;
  }
}

export function updateInstructionsUI(state, el) {
  document.body.dataset.mode = state.app.mode;
  document.body.dataset.guidance = state.ui.testMode ? "locked" : "enabled";
  document.body.dataset.machineState = state.caseData.machineState;
  document.body.dataset.case = String(state.app.caseIndex + 1);

  if (state.ui.testMode) {
    if (el.manualSection) {
      el.manualSection.removeAttribute("open");
      el.manualSection.classList.add("test-mode-locked");
      const summary = el.manualSection.querySelector("summary");
      if (summary) summary.setAttribute("tabindex", "-1");
    }

    if (el.taskInstructions && _testInstructions !== null) {
      el.taskInstructions.innerHTML = _testInstructions;
    }

    if (el.testMe) {
      el.testMe.hidden = true;
    }
  } else {
    if (el.manualSection) {
      el.manualSection.classList.remove("test-mode-locked");
      const summary = el.manualSection.querySelector("summary");
      if (summary) summary.removeAttribute("tabindex");
    }

    if (el.taskInstructions && _practiceInstructions !== null) {
      el.taskInstructions.innerHTML = _practiceInstructions;
    }

    if (el.testMe) {
      el.testMe.hidden = false;
    }
  }
}
