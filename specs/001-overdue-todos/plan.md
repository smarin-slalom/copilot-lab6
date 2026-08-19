# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-08-19 | **Spec**: [spec.md](/workspaces/copilot-lab6/specs/001-overdue-todos/spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Visually distinguish incomplete todos whose due date has passed ("overdue") in the todo list
using a color change plus an accessible warning icon, without adding any new stored data. The
overdue state is a purely derived, client-side computation from each todo's existing `dueDate`
and `completed` fields, re-evaluated on every render of [TodoList](/workspaces/copilot-lab6/packages/frontend/src/components/TodoList.js)
/ [TodoCard](/workspaces/copilot-lab6/packages/frontend/src/components/TodoCard.js) against the
browser's current date. No backend, API, or persistence changes are required.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2

**Primary Dependencies**: React 18.2, react-dom 18.2 (frontend only — no new dependencies)

**Storage**: N/A (overdue status is derived at render time, not persisted; existing `dueDate`
and `completed` fields on the Todo are unchanged)

**Testing**: Jest + `@testing-library/react` (`react-scripts test`), colocated in
`__tests__/` directories per [testing-guidelines.md](/workspaces/copilot-lab6/docs/testing-guidelines.md)

**Target Platform**: Browser (single-page React app), evaluated against the viewing
device/browser's local date per the spec's Assumptions

**Project Type**: Web application (frontend + backend monorepo) — this feature only touches
`packages/frontend/`

**Performance Goals**: Negligible overhead; overdue check is an O(1) date comparison per todo
per render, no additional network requests

**Constraints**: Must not alter existing creation-date ordering of the todo list (FR-007); must
not introduce new persisted fields or API changes; icon must carry an accessible `aria-label`
(FR-009) rather than relying on color alone

**Scale/Scope**: Single UI-layer change touching 1 new utility module and 2 existing components
(`TodoCard`, and indirectly `TodoList`) plus their styles and tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Code Quality & Consistency**: PASS. New logic will live in a small, single-purpose
  utility (`isOverdue`), following existing naming/style conventions; no new lint config needed.
- **II. Test-First Reliability**: PASS. A colocated unit test for the new utility plus updated
  `TodoCard` tests will be written alongside the implementation, covering the acceptance
  scenarios in the spec (past/future/no-date/completed cases).
- **III. Simplicity & Scope Discipline**: PASS. Feature stays within the existing todo app scope
  (view/toggle/edit of existing fields); no new entity, no new persisted data, no
  out-of-scope capability added.
- **IV. User Experience Consistency**: PASS. Reuses existing design tokens
  (`--danger-color` for the color change) and existing icon/aria-label conventions already used
  in `TodoCard` (e.g., edit/delete buttons); satisfies the color-blind/screen-reader
  clarification (color + icon + `aria-label`, not color alone).
- **V. Maintainable Architecture & Error Handling**: PASS. Pure function with no I/O, so no
  try/catch needed; no `console.log` introduced.

No violations — Complexity Tracking section is not needed.

**Post-Phase 1 re-check**: Design artifacts ([research.md](/workspaces/copilot-lab6/specs/001-overdue-todos/research.md),
[data-model.md](/workspaces/copilot-lab6/specs/001-overdue-todos/data-model.md),
[contracts/overdue-util-contract.md](/workspaces/copilot-lab6/specs/001-overdue-todos/contracts/overdue-util-contract.md),
[quickstart.md](/workspaces/copilot-lab6/specs/001-overdue-todos/quickstart.md)) introduce no
new dependencies, entities, or persisted fields beyond what was assessed above. All five gates
remain PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── overdue-util-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js          # MODIFIED: apply overdue class + icon
│   │   ├── TodoList.js          # unchanged (passes todos through as-is)
│   │   └── __tests__/
│   │       └── TodoCard.test.js # MODIFIED: add overdue rendering cases
│   ├── utils/                   # NEW directory
│   │   ├── overdue.js           # NEW: isOverdue(todo) pure helper
│   │   └── __tests__/
│   │       └── overdue.test.js  # NEW: unit tests for isOverdue
│   ├── App.css                  # MODIFIED: .todo-card.overdue styles, .overdue-icon
│   └── styles/theme.css         # unchanged (reuses --danger-color token)
└── (no other files touched)

packages/backend/                # untouched — feature is presentation-only
```

**Structure Decision**: Web application monorepo (existing `packages/frontend/` +
`packages/backend/` split per the constitution's Technology Stack). This feature is
implemented entirely within `packages/frontend/src/`: a new `utils/overdue.js` pure function
computes overdue status from a todo's existing `dueDate`/`completed` fields, and
`TodoCard.js` consumes it to add a conditional class and an accessible icon. No backend
directories are touched since no new data, endpoint, or persistence is required.

## Complexity Tracking

> No violations — this section is intentionally empty. All Constitution Check gates passed
> both before Phase 0 research and after Phase 1 design (see Constitution Check section above).
