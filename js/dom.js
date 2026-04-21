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

    markSuccess: document.getElementById("mark-success"),
    resetPanel: document.getElementById("reset-panel"),
    testMe: document.getElementById("test-me"),
    panelMessage: document.getElementById("panel-message")
  };
}