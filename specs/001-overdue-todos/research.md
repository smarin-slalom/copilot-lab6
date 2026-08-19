# Phase 0 Research: Support for Overdue Todo Items

All items from the Technical Context were resolvable directly from the existing codebase and
the spec's Clarifications/Assumptions sections — there are no outstanding
`NEEDS CLARIFICATION` markers.

## 1. Accessible visual indicator (color + icon)

- **Decision**: Add a warning icon (⚠) next to the todo title for overdue todos, combined with
  a color change on the card (reusing the existing `--danger-color` design token), and give the
  icon `role="img"` with a descriptive `aria-label` (e.g., `"Overdue"`).
- **Rationale**: The spec's clarification session already resolved this ("Color change + icon
  … without text; the icon must carry a descriptive accessible label"). Reusing
  `--danger-color` (already defined in [theme.css](/workspaces/copilot-lab6/packages/frontend/src/styles/theme.css)
  for both light/dark mode) avoids introducing a new design token and keeps WCAG AA contrast
  guarantees the palette already provides. `TodoCard` already uses `aria-label` on icon-only
  buttons (edit/delete), so this follows an established pattern in the codebase.
- **Alternatives considered**:
  - *Color alone*: Rejected — explicitly excluded by the spec's clarification (fails
    color-blind/screen-reader accessibility).
  - *Text label ("Overdue" badge)*: Rejected — the clarification specifies an icon without a
    visible text label, using `aria-label` for assistive tech instead.
  - *New dedicated "warning" color token*: Rejected — YAGNI; the existing danger/red token
    already conveys the right semantic urgency and is defined for both themes.

## 2. Determining "overdue" (date comparison strategy)

- **Decision**: Compare only calendar dates (not date-times): a todo is overdue when it is
  `!completed`, has a non-null `dueDate`, and the due date's calendar day is strictly before
  today's calendar day, using the browser's local time zone. Implemented as a small pure
  function `isOverdue(todo, now = new Date())` in a new `utils/overdue.js` module.
- **Rationale**: The spec's Assumptions state a todo becomes overdue "starting the day after its
  due date" and "today" is evaluated using the viewing device/browser's date. Normalizing both
  dates to midnight before comparing avoids off-by-one errors from time-of-day components in
  stored `dueDate` strings (existing todos store `dueDate` as a `YYYY-MM-DD`-style date, as seen
  in [TodoCard.js](/workspaces/copilot-lab6/packages/frontend/src/components/TodoCard.js)'s
  `formatDate`/date input usage).
  Accepting `now` as an injectable parameter (defaulting to `new Date()`) keeps the function
  pure and easily testable without mocking global timers, aligning with
  [testing-guidelines.md](/workspaces/copilot-lab6/docs/testing-guidelines.md)'s "mock external
  dependencies (API calls, timers)" guidance.
- **Alternatives considered**:
  - *Raw millisecond/timestamp comparison (`Date.now() > dueDate`)*: Rejected — a due date
    stored as midnight would incorrectly appear overdue on its own due date once any time has
    passed that day, violating FR-004 ("due today is not yet overdue").
  - *Server-computed overdue flag persisted on the Todo*: Rejected — the spec explicitly frames
    overdue as a derived, non-persisted state (Key Entities), and re-computing per view (FR-005)
    is simpler and avoids stale data if the client's clock differs from when the flag was last
    computed server-side.

## 3. Where to compute/apply the derived state

- **Decision**: Compute `isOverdue` inside [TodoCard](/workspaces/copilot-lab6/packages/frontend/src/components/TodoCard.js)
  (the component that already renders each todo's card and due date), rather than in
  [TodoList](/workspaces/copilot-lab6/packages/frontend/src/components/TodoList.js) or a global
  state/store.
- **Rationale**: `TodoCard` already owns per-todo rendering decisions (e.g., the `completed`
  class, checkbox state) and re-renders on every list refresh, satisfying FR-005 for free with
  no extra caching/invalidation logic. `TodoList` remains a simple pass-through, preserving
  FR-007 (creation-date ordering untouched, since no sort/filter is added).
- **Alternatives considered**:
  - *Computing in `TodoList` and passing an `overdue` boolean prop down*: Rejected — adds an
    extra prop/indirection for no benefit since `TodoCard` already has direct access to the
    `todo` object it needs.
  - *Backend-computed `overdue` field returned by the API*: Rejected per Key Entities in the
    spec (no new stored/transmitted data) and Constitution Principle III (YAGNI / scope
    discipline) — introduces server/client clock-skew risk for a value trivially computed
    client-side.

## Summary of resolved unknowns

| Technical Context item | Resolution |
|---|---|
| Language/Version | JavaScript (ES2020+), React 18.2 (existing) |
| Primary Dependencies | None new; reuse React + existing CSS tokens |
| Storage | N/A — derived, not persisted |
| Testing | Jest + `@testing-library/react`, colocated `__tests__/` |
| Target Platform | Browser, local device date |
| Project Type | Web app (frontend-only change) |
| Performance Goals | O(1) per-todo date comparison; no measurable impact |
| Constraints | No new persisted fields/API; icon needs `aria-label`; ordering unchanged |
| Scale/Scope | 1 new utility + colocated tests, 1 modified component, CSS additions |
