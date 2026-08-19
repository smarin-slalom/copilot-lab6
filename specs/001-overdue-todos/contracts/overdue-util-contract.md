# Contracts: Support for Overdue Todo Items

This feature does not add or change any backend API endpoint (see
[research.md](/workspaces/copilot-lab6/specs/001-overdue-todos/research.md) item 3), so there is
no HTTP contract to document. The only new interface introduced is an internal frontend utility
function that other components (now `TodoCard`, potentially others later) depend on. Its
contract is documented here for clarity and to anchor unit tests.

## `isOverdue(todo, now?)` — `packages/frontend/src/utils/overdue.js`

### Signature

```js
/**
 * @param {{ dueDate: string | null, completed: number | boolean }} todo
 * @param {Date} [now] - defaults to `new Date()`; injectable for deterministic tests
 * @returns {boolean}
 */
function isOverdue(todo, now = new Date()): boolean
```

### Preconditions

- `todo` is an object with at least `dueDate` (a `YYYY-MM-DD` string or `null`/`undefined`) and
  `completed` (truthy/falsy).
- `now`, if provided, is a valid `Date` instance.

### Postconditions / Behavior contract

| `completed` | `dueDate` | `now` vs `dueDate` (calendar day) | Return value |
|---|---|---|---|
| truthy | any | any | `false` |
| falsy | `null`/`undefined` | n/a | `false` |
| falsy | past date | `dueDate` day < `now` day | `true` |
| falsy | today | `dueDate` day == `now` day | `false` |
| falsy | future date | `dueDate` day > `now` day | `false` |

- Pure function: no I/O, no mutation of `todo`, no thrown exceptions for any valid input shape.
- Comparison MUST be done on calendar days (year/month/day), ignoring time-of-day components on
  both `dueDate` and `now`, per the spec's Assumptions (device/browser local date).

### Consumers

- [TodoCard.js](/workspaces/copilot-lab6/packages/frontend/src/components/TodoCard.js): calls
  `isOverdue(todo)` on each render to decide whether to apply the `overdue` CSS class and render
  the accessible warning icon.

### Test contract

Colocated tests in `packages/frontend/src/utils/__tests__/overdue.test.js` MUST cover, at
minimum, every row of the behavior table above (completed+past, incomplete+past, incomplete+today,
incomplete+future, incomplete+no-date), matching the spec's Acceptance Scenarios (User Stories
1–3) and Edge Cases.
