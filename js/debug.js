let debugEl = null;

export function createDebugPanel() {
  const badge = document.createElement("div");
  badge.id = "debug-panel";
  badge.style.position = "fixed";
  badge.style.top = "8px";
  badge.style.right = "8px";
  badge.style.zIndex = "9999";
  badge.style.padding = "6px 12px";
  badge.style.borderRadius = "6px";
  badge.style.fontSize = "12px";
  badge.style.fontFamily = "system-ui, sans-serif";
  badge.style.fontWeight = "700";
  badge.style.pointerEvents = "none";

  document.body.appendChild(badge);
  debugEl = badge;
}

export function updateDebugPanel(state) {
  if (!debugEl) return;

  const testMode = state.ui.testMode;
  debugEl.textContent = testMode ? "Test mode" : "Practice mode";
  debugEl.style.background = testMode ? "#c45000" : "#1a7a3c";
  debugEl.style.color = "white";
}
