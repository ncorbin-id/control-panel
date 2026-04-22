export const cases = [
  { key: "case1", machineState: "normal",    reflectionCase: false },
  { key: "case2", machineState: "normal",    reflectionCase: false },
  { key: "case3", machineState: "maFailure", reflectionCase: true  }
];

export function getCurrentCase(state) {
  return cases[state.app.caseIndex];
}

export function applyCurrentCase(state) {
  const currentCase = getCurrentCase(state);
  if (!currentCase) return;

  state.caseData.machineState = currentCase.machineState;
}

export function setCase(state, index) {
  if (index < 0 || index >= cases.length) return;

  state.app.caseIndex = index;
  applyCurrentCase(state);
}

export function nextCase(state) {
  if (state.app.caseIndex >= cases.length - 1) return false;

  state.app.caseIndex += 1;
  applyCurrentCase(state);
  return true;
}
