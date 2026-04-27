export const selectorPositions = ["N", "MA", "MS"];

export function getChargedSource(state) {
  return state.caseData.machineState === "maFailure" ? "MS" : "MA";
}

export function isSelectorEnabled(state) {
  return state.machine.power && state.machine.ebReady;
}

export function areFireButtonsEnabled(state) {
  return (
    state.machine.power &&
    state.machine.ebReady &&
    state.machine.chargedSource !== null
  );
}

export function clearWarmupTimer(state) {
  if (state.machine.warmupTimer) {
    clearTimeout(state.machine.warmupTimer);
    state.machine.warmupTimer = null;
  }
}

export function startWarmup(state, onReady) {
  clearWarmupTimer(state);

  state.machine.ebWarming = true;
  state.machine.ebReady = false;
  state.machine.chargedSource = null;
  state.machine.pfLit = false;
  state.machine.selector = "N";

  state.machine.warmupTimer = setTimeout(() => {
    state.machine.ebWarming = false;
    state.machine.ebReady = true;
    state.machine.chargedSource = getChargedSource(state);
    state.machine.warmupTimer = null;

    if (typeof onReady === "function") {
      onReady();
    }
  }, 3000);
}

export function resetMachine(state) {
  clearWarmupTimer(state);

  state.machine.power = false;
  state.machine.selector = "N";
  state.machine.ebWarming = false;
  state.machine.ebReady = false;
  state.machine.chargedSource = null;
  state.machine.pfLit = false;
}

export function togglePower(state, onReady) {
  if (!state.machine.power) {
    state.machine.power = true;
    state.machine.pfLit = false;
    startWarmup(state, onReady);
    return;
  }

  resetMachine(state);
}

export function setSelector(state, index) {
  if (!isSelectorEnabled(state)) return;
  state.machine.selector = selectorPositions[index] ?? "N";
  state.machine.pfLit = false;
}

export function evaluateFire(state, buttonType) {
  if (!areFireButtonsEnabled(state)) return false;

  const correct =
    (state.machine.chargedSource === "MA" &&
      state.machine.selector === "MA" &&
      buttonType === "FM") ||
    (state.machine.chargedSource === "MS" &&
      state.machine.selector === "MS" &&
      buttonType === "FS");

  state.machine.pfLit = correct;
  return correct;
}