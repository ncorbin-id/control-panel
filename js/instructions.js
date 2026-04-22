export function updateInstructionsUI(state, el) {
  document.body.dataset.mode = state.app.mode;
  document.body.dataset.guidance = state.caseData.guidance;
  document.body.dataset.machineState = state.caseData.machineState;
  document.body.dataset.case = String(state.app.caseIndex + 1);

  if (el.instructionsPanel) {
    const locked = state.caseData.guidance === "locked";

    el.instructionsPanel.classList.toggle("guidance-locked", locked);
    el.instructionsPanel.setAttribute("aria-hidden", locked ? "true" : "false");
  }

  if (el.instructionsToggle) {
    const locked = state.caseData.guidance === "locked";

    el.instructionsToggle.disabled = locked;
    el.instructionsToggle.setAttribute("aria-disabled", locked ? "true" : "false");
  }

  if (el.instructionsLockMessage) {
    el.instructionsLockMessage.hidden = state.caseData.guidance !== "locked";
  }

  if (state.ui.testMode) {
    if (el.manualSection) {
      el.manualSection.removeAttribute("open");
      el.manualSection.classList.add("test-mode-locked");
      const summary = el.manualSection.querySelector("summary");
      if (summary) summary.setAttribute("tabindex", "-1");
    }

    if (el.taskInstructions) {
      el.taskInstructions.innerHTML =
        "<p>Fire phasers using the skill you've just practiced. Select <b>Success</b> to mark the procedure successful and reset the control panel for the next test. If you get stuck, select <b>Reset</b> to reset the control panel back to its original state.</p>";
    }

    if (el.testMe) {
      el.testMe.hidden = true;
    }
  }
}
