export function getDomElements() {
  return {
    spIndicator: document.getElementById("light-sp"),
    ebIndicator: document.getElementById("light-eb"),
    maIndicator: document.getElementById("light-ma"),
    pfIndicator: document.getElementById("light-pf"),

    spSwitch: document.getElementById("toggle-sp"),
    fmButton: document.getElementById("fire-main"),
    fsButton: document.getElementById("fire-secondary"),
    esSelector: document.getElementById("es-selector"),

    // Optional guidance hooks. Safe if they do not exist yet.
    instructionsPanel: document.getElementById("instructions-panel"),
    instructionsToggle: document.getElementById("instructions-toggle"),
    instructionsLockMessage: document.getElementById("instructions-lock-message")
  };
}