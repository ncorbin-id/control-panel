export function updateInstructionsUI(state, el) {
  document.body.dataset.mode = state.app.mode;
  document.body.dataset.guidance = state.ui.testMode ? "locked" : "enabled";
  document.body.dataset.machineState = state.caseData.machineState;
  document.body.dataset.case = String(state.app.caseIndex + 1);

  if (el.manualSection) {
    el.manualSection.classList.toggle("test-mode-locked", state.ui.testMode);
  }
  if (el.testMe) {
    el.testMe.hidden = state.ui.testMode;
  }
  if (el.panelToggle) {
    el.panelToggle.disabled = state.ui.testMode;
  }
  if (el.tutorialRestartBtn) {
    el.tutorialRestartBtn.disabled = state.ui.testMode;
  }
}
