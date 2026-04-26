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
    helpButton: document.getElementById("help-button"),

    successNotification: document.getElementById("success-notification"),
    successMessage: document.getElementById("success-message"),
    successDismiss: document.getElementById("success-dismiss"),

    panelToggle: document.getElementById("panel-toggle"),

    manualSection: document.querySelector(".instruction-section.manual"),
    controlPanel: document.querySelector(".control-panel"),

    tutorialSpotlight: document.getElementById("tutorial-spotlight"),
    tutorialCard: document.getElementById("tutorial-card"),
    tutorialBtn: document.getElementById("tutorial-btn"),
    tutorialClose: document.getElementById("tutorial-close"),
    tutorialRestartBtn: document.getElementById("tutorial-restart-btn"),

    testModeStatus: document.getElementById("test-mode-status"),
    caseDisplay: document.getElementById("case-display"),
    caseProgress: document.getElementById("case-progress"),

    reflectionOverlay: document.getElementById("reflection-overlay"),
    reflectionGeneralHelp: document.getElementById("reflection-general-help"),
    reflectionSolved: document.getElementById("reflection-solved"),
    reflectionHelp: document.getElementById("reflection-help"),
    reflectionContinue: document.getElementById("reflection-continue"),
    tryAgain: document.getElementById("try-again")
  };
}
