const mode = new URLSearchParams(window.location.search).get("mode") || "understand";

export const state = {
  app: {
    mode, // "understand" | "memorize"
    caseIndex: 0
  },

  caseData: {
    machineState: "normal" // "normal" | "maFailure"
  },

  machine: {
    power: false,
    selector: "N", // "MA" | "SA" | "N"
    ebWarming: false,
    ebReady: false,
    chargedSource: null, // null | "MA" | "SA"
    pfLit: false,
    warmupTimer: null
  },

  storage: {
    successRecognized: false,
    successCount: 0,
    lastSuccessAt: null
  },

  ui: {
    panelMessage: "",
    testMode: false
  },

  debug: {
    manualOverride: false
  }
};