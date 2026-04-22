# Project Context on Mac

## Project
This is a control panel desktop application.

## AI Workflow
- Design decisions and architecture discussions happen in claude.ai chat
- Claude Code (this) handles all code edits and file-aware work
- This CLAUDE.md file is the bridge between the two — update it when significant decisions are made

## Design Decisions Log

- **Guidance derived from testMode, not cases** — `guidance` is no longer a case property. It is derived from `state.ui.testMode`: practice mode = guidance enabled, Test Me mode = guidance locked.
- **Cases simplified to three entries** — `normal`, `normal`, `maFailure` with no `guidance` field.
- **Success button removed; auto-detect via pfLit** — When `state.machine.pfLit` becomes true, a success notification appears automatically. Dismissing it resets the machine. The explicit Success button is gone.
- **Case 3 (maFailure) unique success message** — Dismissing the success notification on case 3 shows a placeholder message prompting metacognitive reflection (to be refined later).
- **Case 3 introduces an "I need help" button** — Appears after the learner's first Reset attempt within Case 3 (maFailure). Tracked via `state.ui.resetCountInCase`.
- **Case 3 has two exit paths** — Solving it (PF illuminates → dismiss success notification) or clicking "I need help." Both lead to the metacognitive reflection prompt.
- **Reflection prompt framing differs by path** — Solved path: "you figured it out — here's why that worked." Help path: "this is the point — here's why you got stuck." Implemented as two content slots in a single overlay, one hidden at a time.
- **Reflection "Continue" launches the mental model phase** — `handleContinueToMentalModel` resets to practice mode on case 1, sets `state.ui.mentalModelPhase = true`. The manual section then shows a placeholder div for the system/mental model diagram (content TBD).
- **All learners go through the mental model phase** — No skipping. Both Case 3 exit paths funnel into the reflection, which is the only entry point to the mental model phase.

## Tech Stack
- **Vanilla HTML/CSS/JS** — no framework, no build tools, no package manager
- **ES Modules** — all JS files use `import`/`export`; loaded via `<script type="module">`
- **LocalStorage** — used for persisting session data (success count, last success timestamp)
- **Two HTML entry points** — `index.html` (landing/intro) and `panel.html` (the main app)

## Architecture & Patterns

**Unidirectional data flow** — state is mutated directly, then `rerender()` is called to sync the DOM. There is no reactive/binding system; renders are always triggered explicitly by handlers.

**Module separation by concern:**
- `state.js` — single shared state object (the source of truth)
- `machine.js` — all machine/simulation logic as pure functions that receive `state` as a parameter
- `cases.js` — scenario definitions and the logic to apply them to state
- `dom.js` — DOM element registry, queried once at init and passed around as `el`
- `render.js` — reads state and writes to the DOM; calls out to `instructions.js`
- `instructions.js` — renders the instructions panel (its own sub-renderer)
- `main.js` — event wiring, button handlers, and app init
- `debug.js` — dev-only debug overlay, injected at runtime

**State shape is segmented by layer:**
- `state.app` — app-level config (mode, caseIndex)
- `state.caseData` — active scenario settings (machineState)
- `state.machine` — runtime simulation state (power, selector, indicators, timers)
- `state.storage` — mirrors what's persisted in localStorage
- `state.ui` — transient UI state (panelMessage, testMode)
- `state.debug` — debug override flags

**DOM queried once at init** — `getDomElements()` in `dom.js` runs once on load and returns a cached element map. All handlers and renderers reference `el.*` rather than querying the DOM repeatedly.

**Machine logic is pure** — functions in `machine.js` take `state` as an argument and mutate it in place. The one exception is timers (`startWarmup`/`clearWarmupTimer`), which store their handle in `state.machine.warmupTimer` so they can be cancelled on reset.

**`data-*` attributes on `<body>` drive CSS** — `updateInstructionsUI` sets `body.dataset.mode`, `.guidance`, `.machineState`, and `.case` so CSS can conditionally show/hide or style elements without JS knowing about every visual rule. `guidance` is derived from `state.ui.testMode`, not stored in `caseData`.

## Conventions

- **Section banners** — `/* === SECTION NAME === */` comment blocks used in `main.js` to separate logical groups (RESET, PANEL MESSAGE HELPERS, BUTTON HANDLERS, etc.)
- **`rerender()` wrapper** — all renders go through a local `rerender()` in `main.js` that passes `state`, `el`, and `updateDebugPanel` into `render()`. Never call `render()` directly from handlers.
- **Handler naming** — button handlers are named `handle<Action>` (e.g., `handleSuccessDismiss`, `handleReset`, `handleTestMe`)
- **Handler pattern** — handlers call `clearPanelMessage()`, mutate state, then call `rerender()` (or a reset helper that calls it internally)
- **`classList.toggle("class", condition)`** — preferred pattern for boolean DOM state in `render.js`; avoids separate add/remove calls
- **`hidden` attribute** for show/hide — uses the native HTML `hidden` attribute (e.g., `el.testMe.hidden = true`) rather than CSS classes or display style
- **LocalStorage** — single key `"phaserTraining"` stores a flat JSON object; always read with `getStoredData()` and write with `setStoredData()` in `main.js`

## Out of Scope / Decided Against
<!-- Track things we've ruled out and why -->
