# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - As a todo application user, I want to easily identify and distinguish overdue tasks in my todo list, so that I can prioritize my work and quickly see which tasks are past their due date. Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date."

## Clarifications

### Session 2026-08-19

- Q: Should the overdue indicator rely on color alone, or must it also include a non-color cue like a text label or icon, so it remains perceivable to color-blind users and screen readers? → A: Color change + icon (e.g., warning icon) without text; the icon must carry a descriptive accessible label (e.g., `aria-label`) for screen readers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spot overdue todos at a glance (Priority: P1)

As a user viewing my todo list, I want incomplete todos whose due date has passed to be
visually distinguished from other todos, so I can immediately see what needs my attention
without comparing every due date to today's date myself.

**Why this priority**: This is the core value of the feature — without a visual distinction,
users must manually check each due date, which is exactly the problem this feature solves. It
is the minimum viable slice that delivers value on its own.

**Independent Test**: Can be fully tested by creating todos with due dates in the past, present,
and future, viewing the todo list, and confirming that only the incomplete todos with past due
dates show the overdue indicator.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and marked incomplete, **When** the user
   views the todo list, **Then** that todo is visually marked as overdue.
2. **Given** a todo with a due date later than today, **When** the user views the todo list,
   **Then** that todo is displayed normally, with no overdue indicator.
3. **Given** a todo with no due date set, **When** the user views the todo list, **Then** that
   todo is displayed normally, with no overdue indicator.

---

### User Story 2 - Completed todos are never shown as overdue (Priority: P2)

As a user, I want todos I have already completed to never display an overdue indicator, even if
they were finished after their due date, so completed work doesn't look like it still needs
attention.

**Why this priority**: This prevents a confusing and misleading experience where finished work
appears to require action, but it depends on the overdue indicator existing first (User Story
1), so it is ranked second.

**Independent Test**: Can be fully tested by creating a todo with a past due date, marking it
complete, and confirming the overdue indicator does not appear (whether it was completed before
or after its due date).

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and marked complete, **When** the user
   views the todo list, **Then** that todo is displayed as completed with no overdue indicator.
2. **Given** an overdue, incomplete todo, **When** the user marks it complete, **Then** the
   overdue indicator is removed immediately.

---

### User Story 3 - Overdue status stays current over time (Priority: P3)

As a user, I want a todo's overdue indicator to reflect the current date every time I view my
list, so a todo that becomes overdue while I'm not using the app is correctly marked the next
time I open it, without me having to do anything.

**Why this priority**: This ensures correctness over time but builds on the indicator already
existing (User Stories 1 and 2); it refines when the status is (re)evaluated rather than adding
a new visible capability.

**Independent Test**: Can be fully tested by creating a todo due "today," waiting until the due
date has passed (or simulating a later date), reloading the todo list, and confirming the todo
now shows the overdue indicator without any edit having been made to it.

**Acceptance Scenarios**:

1. **Given** a todo due today that is not yet overdue, **When** the due date passes and the user
   later views or refreshes the todo list, **Then** the todo is now shown as overdue.

---

### Edge Cases

- What happens when a todo's due date is today (neither past nor future)? The todo is not yet
  overdue; it only becomes overdue once its due date is fully in the past (see Assumptions).
- What happens when a todo has no due date? It is never shown as overdue, since there is no date
  to compare against.
- What happens when a completed todo had a due date in the past? It is never shown as overdue,
  regardless of whether it was completed before or after that date.
- What happens when the user edits a todo's due date to a past date? The todo becomes overdue
  (if incomplete) the next time the list is displayed.
- What happens when the user edits an overdue todo's due date to a future date? The overdue
  indicator is removed, since the todo is no longer past its due date.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish, within the todo list, any todo that is
  incomplete and whose due date has passed ("overdue") from all other todos, using both a
  color change and an accompanying icon (not color alone).
- **FR-002**: System MUST NOT display the overdue indicator on any todo that is marked complete,
  regardless of its due date.
- **FR-003**: System MUST NOT display the overdue indicator on any todo that has no due date
  set.
- **FR-004**: System MUST consider a todo overdue only once its due date is fully in the past
  (a todo due "today" is not yet overdue).
- **FR-005**: System MUST re-evaluate each todo's overdue status against the current date every
  time the todo list is displayed, without requiring any manual user action.
- **FR-006**: System MUST remove the overdue indicator immediately when an overdue todo is
  marked complete, or when its due date is edited to a present/future date.
- **FR-007**: System MUST display the overdue indicator alongside each affected todo's existing
  details (title, due date, completion status) in the todo list, without changing the
  established creation-date ordering of the list.
- **FR-008**: Users MUST be able to identify all overdue todos in their list by their visual
  appearance alone, without needing to open, edit, or manually compare dates on individual
  todos.
- **FR-009**: The overdue icon MUST carry a descriptive accessible label (e.g., `aria-label`)
  so the overdue status is conveyed to assistive technology (e.g., screen readers), not just
  to sighted users.

### Key Entities

- **Todo**: Existing entity representing a single task (title, optional due date, completion
  status, creation date). This feature adds a derived, computed "overdue" state to each todo,
  based on its existing due date and completion status — it does not add new stored data or a
  new entity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify every overdue todo in their list within 2 seconds of viewing
  it, without inspecting individual due dates.
- **SC-002**: 100% of incomplete todos with a due date in the past display the overdue
  indicator when the list is viewed.
- **SC-003**: 0% of completed todos and 0% of todos without a due date are ever displayed with
  the overdue indicator.
- **SC-004**: 100% of todos that become overdue while the app is closed or idle show the correct
  overdue status the next time the list is viewed, with no user action beyond opening/viewing
  the list.

## Assumptions

- A todo is considered overdue starting the day after its due date; a todo due "today" is not
  yet overdue. This follows common todo-app convention and avoids flagging tasks a user still
  has time to complete today.
- "Today" is evaluated using the date on the device/browser the user is viewing the list with,
  consistent with this being a single-user, desktop-focused application (per
  functional-requirements.md).
- The overdue indicator is a visual treatment only (color change plus an accessible icon, per
  Clarifications) on the existing todo list; it does not change list ordering, add filtering, or
  add sorting, since those are
  explicitly out of scope for this application (per functional-requirements.md).
- No new data is persisted for this feature; overdue status is computed from the existing due
  date and completion status each time the list is rendered.
