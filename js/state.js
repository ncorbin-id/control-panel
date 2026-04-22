const mode = new URLSearchParams(window.location.search).get("mode") || "understand";

export const state = {
  app: {
    mode,
    caseIndex: 0
  },

  caseData: {
    machineState: "normal"
  },

  machine: {
    power: false,
    selector: "N",
    ebWarming: false,
    ebReady: false,
    chargedSource: null,
    pfLit: false,
    warmupTimer: null
  },

  ui: {
    panelMessage: "",
    testMode: false
  }
};
