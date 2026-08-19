# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: [plan.md](/workspaces/copilot-lab6/specs/001-overdue-todos/plan.md) (required), [spec.md](/workspaces/copilot-lab6/specs/001-overdue-todos/spec.md) (required for user stories), [research.md](/workspaces/copilot-lab6/specs/001-overdue-todos/research.md), [data-model.md](/workspaces/copilot-lab6/specs/001-overdue-todos/data-model.md), [contracts/](/workspaces/copilot-lab6/specs/001-overdue-todos/contracts/)

**Tests**: Tests ARE included below; they follow a TDD approach (write failing test first, implement to pass).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete upstream tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Paths follow the existing web app structure: `packages/frontend/src/` for React component/utility code, `packages/frontend/src/__tests__/` for colocated tests, and CSS in `packages/frontend/src/App.css` or `packages/frontend/src/styles/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Minimal setup — no new dependencies or configuration needed since this feature uses only existing React, CSS tokens, and date APIs.

- [X] T001 Verify frontend build and test infrastructure is ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the core `isOverdue` utility that all user stories depend on. Implement and test this pure function before any UI changes.

**⚠️ CRITICAL**: User Story phases cannot begin until this phase is complete and tested.

- [X] T002 [P] Create new `packages/frontend/src/utils/` directory with `overdue.js`
- [X] T003 [P] Implement `isOverdue(todo, now = new Date())` pure function in `packages/frontend/src/utils/overdue.js` per [overdue-util-contract.md](/workspaces/copilot-lab6/specs/001-overdue-todos/contracts/overdue-util-contract.md)
- [X] T004 Write unit tests for `isOverdue` in `packages/frontend/src/utils/__tests__/overdue.test.js` covering all behavior contract rows: completed/past, incomplete/past, incomplete/today, incomplete/future, incomplete/no-date
- [X] T005 Run `npm test --workspace=frontend` and confirm all `overdue.test.js` tests pass

**Checkpoint**: `isOverdue` utility is fully implemented, tested (100% coverage), and ready for UI consumption.

---

## Phase 3: User Story 1 - Spot overdue todos at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with past due dates show a visual overdue indicator (color change + icon with accessible label) in the todo list.

**Independent Test**: Create todos with past/present/future due dates and no-date, view the list, and confirm ONLY incomplete past-due todos show the indicator.

**Acceptance Scenarios**:
1. Incomplete todo with past due date → shows overdue indicator
2. Incomplete todo with future due date → no indicator
3. Incomplete todo with no due date → no indicator

### Implementation for User Story 1

- [X] T006 [P] [US1] Update `packages/frontend/src/components/TodoCard.js` to import `isOverdue` utility
- [X] T007 [P] [US1] Add state/logic in `TodoCard.js` to compute `isOverdue(todo)` on render and conditionally apply `overdue` CSS class to the card container
- [X] T008 [P] [US1] Add warning icon (⚠) to the todo card in `TodoCard.js`, positioned next to the title, with `role="img"` and `aria-label="Overdue"` for screen reader accessibility
- [X] T009 [US1] Add CSS styles in `packages/frontend/src/App.css` for `.todo-card.overdue` (use `--danger-color` for background/border tint) and `.overdue-icon` (sizing, spacing per design system)
- [X] T010 [US1] Update existing `TodoCard.test.js` to add test cases for overdue rendering:
  - Test incomplete + past date renders overdue class and icon
  - Test incomplete + future date does NOT render overdue class/icon
  - Test incomplete + no date does NOT render overdue class/icon
- [X] T011 [US1] Run `npm test --workspace=frontend -- TodoCard.test.js` and confirm all overdue test cases pass

**Checkpoint**: User Story 1 complete — users can visually spot overdue todos at a glance with color + accessible icon.

---

## Phase 4: User Story 2 - Completed todos are never shown as overdue (Priority: P2)

**Goal**: Ensure completed todos never display the overdue indicator, regardless of their due date.

**Independent Test**: Create a completed todo with a past due date, view it, and confirm NO overdue indicator appears. Then test toggling an overdue todo to complete and confirm the indicator disappears immediately.

**Acceptance Scenarios**:
1. Completed todo with past due date → no indicator
2. Overdue incomplete todo → mark complete → indicator disappears immediately

### Implementation for User Story 2

- [X] T012 [P] [US2] Verify `isOverdue` utility already handles `completed` status correctly (i.e., returns `false` if `completed` is truthy) — if not, fix in `packages/frontend/src/utils/overdue.js`
- [X] T013 [P] [US2] Update `TodoCard.test.js` with test cases:
  - Test completed + past date does NOT render overdue class/icon
  - Test completing an overdue todo removes the indicator on next render
- [X] T014 [US2] Run `npm test --workspace=frontend -- TodoCard.test.js` and confirm all US2-related tests pass
- [X] T015 [US2] Manually verify: create an overdue (incomplete, past-due) todo, mark it complete, and confirm indicator disappears immediately in the running app

**Checkpoint**: User Story 2 complete — completed todos never show overdue status, even if late.

---

## Phase 5: User Story 3 - Overdue status stays current over time (Priority: P3)

**Goal**: Ensure the overdue indicator is re-evaluated on every render, so todos that become overdue while idle display correctly on next view without manual refresh.

**Independent Test**: Create a todo due "today," simulate the date advancing by one day (or edit the due date to yesterday), reload/re-render the list, and confirm it now shows as overdue.

**Acceptance Scenarios**:
1. Todo due today → not yet overdue
2. Due date passes → next render shows overdue (no save/edit needed by user)

### Implementation for User Story 3

- [X] T016 [P] [US3] Verify `TodoCard.js` re-computes `isOverdue(todo)` on every render (i.e., no memoization or cached value that could go stale) — confirm by reading the component logic
- [X] T017 [P] [US3] Add test case in `TodoCard.test.js`:
  - Test that calling `isOverdue` with the same `todo` but different `now` dates produces correct results (e.g., `now = today` returns `false`, `now = tomorrow` returns `true`)
- [X] T018 [US3] Write integration test (optional but recommended) in `packages/frontend/src/__tests__/TodoList.integration.test.js`:
  - Render `TodoList` with a todo due "today"
  - Call the component's render method with a mocked `now` set to the next day
  - Confirm the overdue indicator now appears (verifies re-evaluation on each render)
- [X] T019 [US3] Run `npm test --workspace=frontend` and confirm all US3 tests pass
- [X] T020 [US3] Manually verify: create a todo with today's date, change system clock or edit the todo's due date to yesterday, reload the page, and confirm the overdue indicator appears

**Checkpoint**: User Story 3 complete — overdue status stays accurate over time and across app sessions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility audit, and cleanup.

- [X] T021 Run linter: `npm run lint --workspace=frontend` and fix any style violations (aim for zero unresolved errors before PR)
- [X] T022 Run full frontend test suite: `npm test --workspace=frontend` and confirm all tests pass with >80% coverage
- [X] T023 Accessibility audit: use browser devtools or a screen reader to verify all overdue icons have proper `aria-label` and are announced correctly by assistive tech
- [X] T024 Manual cross-browser testing: test the overdue indicator in at least two browsers (e.g., Chrome, Firefox) on mobile and desktop to confirm visual consistency
- [X] T025 Clean up any console.log or debug statements; verify no production code has leftover logging
- [X] T026 Update relevant docs if needed (e.g., update README.md or docs/functional-requirements.md if overdue feature is now core to the app's capabilities)

**Checkpoint**: Feature is polished, fully tested, accessible, and ready for code review and merge.

---

## Task Dependency Graph

```
T001 (Setup)
  ↓
T002–T005 (Foundational: isOverdue utility) [blocking all user stories]
  ↓
┌─────────────────────────────────────────────────────┐
│ T006–T011 (US1: Visual indicator)                 │
│ T012–T015 (US2: No indicator on complete)        │  (can run in parallel after T005)
│ T016–T020 (US3: Re-evaluate on each render)      │
└─────────────────────────────────────────────────────┘
  ↓
T021–T026 (Polish & final validation)
```

---

## Parallel Execution Examples

**After Foundational (T005) is complete:**

- **Thread 1**: T006–T011 (US1: implement visual indicator + tests)
- **Thread 2**: T012–T015 (US2: verify completed handling + tests)
- **Thread 3**: T016–T020 (US3: verify re-evaluation on render + tests)

All three can run in parallel since they touch different code areas and depend only on T005.

**Within Phase 3 (US1):**

- T006–T008 can run in parallel (all modifying TodoCard.js in different sections)
- T009 can start as soon as T007 is drafted (CSS can be written against the new class name)
- T010 can start once T007–T008 logic is in place
- T011 only after T010 is written

---

## Implementation Strategy: MVP First

**MVP (Minimum Viable Product)**: User Story 1 (T006–T011)
- Visual indicator for incomplete, overdue todos
- No backend changes, no new API
- Independent test: create past/future/no-date todos and verify indicator appears only for past-due incomplete ones
- Estimated effort: 2–3 hours
- Value delivered: Core feature that solves the user's problem

**Incremental additions**:
- Phase 4 (US2): ~30 min — mostly testing, logic already in place
- Phase 5 (US3): ~1 hour — verification and integration test

---

## Success Criteria for Each User Story

### US1: Spot overdue todos at a glance ✅
- [ ] All incomplete, past-due todos show overdue indicator (color + icon)
- [ ] No future-due or no-date todos show indicator
- [ ] All four Acceptance Scenarios pass automated tests
- [ ] Icon has `aria-label` for screen reader accessibility

### US2: Completed todos never show overdue ✅
- [ ] Completed todos, regardless of due date, never display overdue indicator
- [ ] Toggling a todo to complete removes indicator immediately
- [ ] Both Acceptance Scenarios pass automated tests

### US3: Overdue status stays current ✅
- [ ] Todos that cross into overdue (due date was today, now in past) display correctly on next render
- [ ] No manual refresh/save required by user
- [ ] Single Acceptance Scenario passes automated test

---

## Notes

- **No backend changes**: Feature is purely frontend-derived state; no API, database, or server code needs modification.
- **Existing design tokens**: Reuses `--danger-color` from existing theme.css for both light/dark modes; no new colors introduced.
- **Pure function approach**: `isOverdue` has no I/O, no side effects, and is easily testable and mockable.
- **Accessibility first**: Icon-based indicator with `aria-label` ensures color-blind users and screen reader users can perceive overdue status.
