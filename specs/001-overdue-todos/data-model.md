# Phase 1 Data Model: Support for Overdue Todo Items

This feature adds **no new stored entity and no new persisted fields**. It defines a single
derived (computed, non-persisted) property on the existing Todo entity.

## Existing Entity: Todo

Sourced from current usage in
[todoService.js](/workspaces/copilot-lab6/packages/frontend/src/services/todoService.js) and
[TodoCard.js](/workspaces/copilot-lab6/packages/frontend/src/components/TodoCard.js) (unchanged
by this feature):

| Field | Type | Notes |
|---|---|---|
| `id` | number | Unique identifier |
| `title` | string | 1–255 chars |
| `dueDate` | string (`YYYY-MM-DD`) or `null` | Optional; absence means "no due date" |
| `completed` | 0 \| 1 (boolean-like) | Completion status |
| `createdAt` | string (timestamp) | Determines list ordering (unchanged by this feature) |

## Derived Property: `overdue` (not persisted)

| Property | Type | Computed as |
|---|---|---|
| `overdue` | boolean | `!completed && dueDate != null && dueDate's calendar day < today's calendar day` (device/browser local time) |

**Computation rules** (from spec Functional Requirements & Assumptions):

1. If `completed` is truthy → `overdue` is always `false` (FR-002).
2. If `dueDate` is `null`/absent → `overdue` is always `false` (FR-003).
3. If `dueDate`'s calendar day is today or in the future → `overdue` is `false` (FR-004).
4. If `dueDate`'s calendar day is strictly before today's calendar day, and the todo is
   incomplete → `overdue` is `true`.
5. `overdue` is recomputed every time the todo list is rendered (FR-005) — it is never written
   back to the todo object or the backend, and never sent over the network.

**State transitions** (all immediate, driven by existing mutations — no new transitions
introduced):

- Incomplete + past due date → mark complete: `overdue` becomes `false` (existing `onToggle`
  flow already updates `completed`; re-render alone removes the indicator) (FR-006).
- Incomplete + past due date → edit `dueDate` to present/future: `overdue` becomes `false`
  (existing `onEdit` flow already updates `dueDate`) (FR-006).
- Not-yet-due todo → its due date passes while the app is idle → next render, `overdue` becomes
  `true` automatically, since it is recomputed against the current date each render (User Story
  3 / FR-005). No stored field changes, so no migration or backend work is needed.

## Validation Rules

No new validation rules are introduced. `isOverdue` is a total function over the existing
`{ dueDate, completed }` shape and must not throw for any valid Todo (including `dueDate: null`).

## Relationships

None — this is a component-local derived value, not a stored relationship.
