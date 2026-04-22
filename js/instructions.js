const TASK_INSTRUCTIONS_PRACTICE = `
  <p>Your task is to fire phasers aboard a starship. First, you'll practice the procedure using the excerpt from the <i>Control Panel Instruction Manual</i>. When you're ready, you'll test your ability to fire phasers without guidance from the manual.</p>
  <ol>
    <li>Read through the <i>Control Panel Instruction Manual</i> and familiarize yourself with the control panel.</li>
    <li>Practice firing phasers a few times on your own.
      <p>If you get stuck, select <b>Reset</b> to reset the control panel back to its original state.</p>
    </li>
    <li>When you're ready, select <b>Test me</b> to test your ability to fire phasers on your own without guidance.</li>
  </ol>
`;

const TASK_INSTRUCTIONS_TEST = `
  <p>Fire phasers using the skill you've just practiced. When the PF Indicator illuminates, a success notification will appear — dismiss it to reset the control panel for the next test. If you get stuck, select <b>Reset</b> to reset the control panel back to its original state.</p>
`;

export function updateInstructionsUI(state, el) {
  document.body.dataset.mode = state.app.mode;
  document.body.dataset.guidance = state.ui.testMode ? "locked" : "enabled";
  document.body.dataset.machineState = state.caseData.machineState;
  document.body.dataset.case = String(state.app.caseIndex + 1);

  if (el.instructionsPanel) {
    el.instructionsPanel.classList.toggle("guidance-locked", state.ui.testMode);
    el.instructionsPanel.setAttribute("aria-hidden", state.ui.testMode ? "true" : "false");
  }

  if (el.instructionsToggle) {
    el.instructionsToggle.disabled = state.ui.testMode;
    el.instructionsToggle.setAttribute("aria-disabled", state.ui.testMode ? "true" : "false");
  }

  if (el.instructionsLockMessage) {
    el.instructionsLockMessage.hidden = !state.ui.testMode;
  }

  if (state.ui.testMode) {
    if (el.manualSection) {
      el.manualSection.removeAttribute("open");
      el.manualSection.classList.add("test-mode-locked");
      const summary = el.manualSection.querySelector("summary");
      if (summary) summary.setAttribute("tabindex", "-1");
    }

    if (el.taskInstructions) {
      el.taskInstructions.innerHTML = TASK_INSTRUCTIONS_TEST;
    }

    if (el.testMe) {
      el.testMe.hidden = true;
    }
  } else {
    if (el.manualSection) {
      el.manualSection.setAttribute("open", "");
      el.manualSection.classList.remove("test-mode-locked");
      const summary = el.manualSection.querySelector("summary");
      if (summary) summary.removeAttribute("tabindex");
    }

    if (el.taskInstructions) {
      el.taskInstructions.innerHTML = TASK_INSTRUCTIONS_PRACTICE;
    }

    if (el.testMe) {
      el.testMe.hidden = false;
    }
  }
}
