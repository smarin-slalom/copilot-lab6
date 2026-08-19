# Quickstart: Validating Overdue Todo Items

Validates the feature described in [spec.md](/workspaces/copilot-lab6/specs/001-overdue-todos/spec.md)
against its [data model](/workspaces/copilot-lab6/specs/001-overdue-todos/data-model.md) and
[utility contract](/workspaces/copilot-lab6/specs/001-overdue-todos/contracts/overdue-util-contract.md).

## Prerequisites

- Node.js + npm installed, dependencies installed (`npm run install:all` from repo root, or at
  minimum `packages/frontend`'s `node_modules` present).
- Working directory: repo root (`/workspaces/copilot-lab6`).

## 1. Automated validation (unit + component tests)

Run the frontend test suite, which must include the new `isOverdue` utility tests and the
updated `TodoCard` tests:

```bash
npm test --workspace=frontend
```

Expected outcome: all tests pass, including new cases for:
- incomplete + due date in the past → overdue indicator present
- incomplete + due date in the future → no indicator
- incomplete + no due date → no indicator
- completed + due date in the past → no indicator
- toggling an overdue todo to complete → indicator disappears
- editing an overdue todo's due date to the future → indicator disappears

## 2. Manual end-to-end validation

1. Start the app: `npm start` (runs frontend + backend concurrently).
2. Open the app in a browser (default: `http://localhost:3000`).
3. Create three todos:
   - "Past due task" with a due date a few days before today.
   - "Future task" with a due date a few days after today.
   - "No date task" with no due date set.
4. Confirm only "Past due task" shows the color change + warning icon (with a screen reader or
   the browser's accessibility inspector, confirm the icon has an `aria-label` such as
   `"Overdue"`).
5. Mark "Past due task" complete → confirm the overdue indicator disappears immediately
   (User Story 2 / FR-006).
6. Uncheck it again, then edit its due date to a future date → confirm the overdue indicator
   disappears immediately (FR-006, Edge Cases).
7. Create a todo due "today" → confirm it does NOT show as overdue (FR-004).
   Optionally, to validate User Story 3 without waiting a full day, temporarily set the
   system/browser clock forward by one day (or edit the todo's due date to yesterday) and
   reload the list → confirm it now shows as overdue with no other edits made.

## 3. Success criteria checklist

- [ ] SC-002: every incomplete todo with a past due date shows the indicator.
- [ ] SC-003: no completed todo and no no-due-date todo ever shows the indicator.
- [ ] SC-004: a todo that becomes overdue while idle shows correctly on next view/reload.
- [ ] FR-007: todo list order (by creation date) is unchanged by overdue status.
- [ ] FR-009: the overdue icon has a descriptive `aria-label` (verified via browser devtools
  accessibility tree or a screen reader).
