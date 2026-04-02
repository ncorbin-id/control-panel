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
}