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

    resetPanel: document.getElementById("reset-panel"),
    testMe: document.getElementById("test-me"),
    panelMessage: document.getElementById("panel-message"),

    successNotification: document.getElementById("success-notification"),
    successMessage: document.getElementById("success-message"),
    successDismiss: document.getElementById("success-dismiss"),

    manualSection: document.querySelector(".instruction-section.manual"),
    taskInstructions: document.querySelector(".instruction-section.task .instructions"),

    helpButton: document.getElementById("help-button"),

    reflectionOverlay: document.getElementById("reflection-overlay"),
    reflectionGeneralHelp: document.getElementById("reflection-general-help"),
    reflectionSolved: document.getElementById("reflection-solved"),
    reflectionHelp: document.getElementById("reflection-help"),
    reflectionContinue: document.getElementById("reflection-continue"),
    tryAgain: document.getElementById("try-again")
  };
}
