export const cases = [
  { key: "case1", machineState: "normal", guidance: "enabled" },
  { key: "case2", machineState: "normal", guidance: "locked" },
  { key: "case3", machineState: "maFailure", guidance: "locked" }
];

export function getCurrentCase(state) {
  return cases[state.app.caseIndex];
}

export function applyCurrentCase(state) {
  const currentCase = getCurrentCase(state);
  if (!currentCase) return;

  state.caseData.machineState = currentCase.machineState;
  state.caseData.guidance = currentCase.guidance;
}

export function setCase(state, index) {
  if (index < 0 || index >= cases.length) return;

  state.app.caseIndex = index;
  state.debug.manualOverride = false;
  applyCurrentCase(state);
}

export function nextCase(state) {
  if (state.app.caseIndex >= cases.length - 1) return false;

  state.app.caseIndex += 1;
  state.debug.manualOverride = false;
  applyCurrentCase(state);
  return true;
}