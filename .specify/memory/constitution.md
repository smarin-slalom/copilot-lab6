<!--
Sync Impact Report
==================
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: N/A (first concrete version; all placeholders replaced)
Added sections:
  - Core Principles: I. Code Quality & Consistency, II. Test-First Reliability,
    III. Simplicity & Scope Discipline, IV. User Experience Consistency,
    V. Maintainable Architecture & Error Handling
  - Technology Stack & Project Structure
  - Development Workflow & Review Process
  - Governance
Removed sections: None (template placeholders only)
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending manual review (verify Constitution Check
    gates reference the five principles below)
  - .specify/templates/spec-template.md ✅ no changes required (principle-agnostic)
  - .specify/templates/tasks-template.md ✅ no changes required (principle-agnostic)
Follow-up TODOs: None
-->

# Copilot Lab 6 (Todo App) Constitution

## Core Principles

### I. Code Quality & Consistency
All code MUST follow the conventions in [coding-guidelines.md](/workspaces/copilot-lab6/docs/coding-guidelines.md):
2-space indentation, LF line endings, no trailing whitespace, and lines kept under ~100
characters. Naming MUST be consistent: `camelCase` for variables/functions, `UPPER_SNAKE_CASE`
for constants, `PascalCase` for React components and classes (with matching file names).
Imports MUST be grouped in order (external libraries, internal modules, styles) and separated
by blank lines. Code MUST apply DRY (extract repeated logic into shared utilities/components),
KISS (prefer the simplest correct solution), and SOLID principles (single responsibility,
open/closed, Liskov substitution, interface segregation, dependency inversion). ESLint MUST
pass with no unresolved errors before a pull request is opened; auto-fixable issues MUST be
resolved with `npm run lint:fix` first.
Rationale: A shared, enforced style and set of design principles keeps a multi-contributor
bootcamp codebase readable, reduces review friction, and prevents accidental regressions from
inconsistent patterns.

### II. Test-First Reliability
Tests MUST be written alongside or before the code they validate (TDD workflow: write a failing
test, implement the minimal code to pass, refactor while green). Every package MUST maintain
80%+ code coverage, with critical user workflows (create, view, complete, edit, delete a todo)
covered at 100%. Tests MUST be isolated (no shared state, no dependency on execution order),
MUST mock external dependencies (API calls, timers), and MUST assert observable behavior rather
than implementation details. Test files MUST live in `__tests__/` directories colocated with
the source they test and follow the `{filename}.test.js` naming convention. All tests MUST pass
locally before a pull request is opened.
Rationale: Test-first development and enforced coverage thresholds, as defined in
[testing-guidelines.md](/workspaces/copilot-lab6/docs/testing-guidelines.md), catch regressions early and keep the app
verifiably correct as it evolves.

### III. Simplicity & Scope Discipline
Features MUST stay within the bounds defined in
[functional-requirements.md](/workspaces/copilot-lab6/docs/functional-requirements.md): a single-user todo app
supporting create, view, complete/incomplete toggle, edit, and delete (with delete
confirmation). Explicitly out-of-scope capabilities (authentication, multi-user support,
priorities/categories, recurring todos, reminders, undo/redo, bulk operations, advanced
filtering/search, mobile-specific optimization) MUST NOT be added without an explicit,
documented amendment to the functional requirements first. When a design choice arises, the
simplest solution that satisfies the current requirement MUST be preferred over speculative,
future-proofed abstractions (YAGNI).
Rationale: A tightly scoped, single-purpose app is easier to teach, review, and extend
correctly during a bootcamp; unchecked scope creep undermines both learning goals and
maintainability.

### IV. User Experience Consistency
All UI work MUST conform to [ui-guidelines.md](/workspaces/copilot-lab6/docs/ui-guidelines.md): the defined color
palette and typography scale for light/dark mode, the 8px spacing grid, the single-column
layout (max-width 600px on larger screens), and the specified component patterns (todo card,
input fields, buttons, confirmation dialog). Interactive elements MUST be keyboard accessible,
color contrast MUST meet WCAG AA, and form inputs MUST have properly associated labels and
descriptive `aria-label`s on icon-only buttons. Destructive actions (e.g., delete) MUST require
confirmation before taking effect.
Rationale: A consistent, accessible design system ensures the app looks and behaves
predictably across features and remains usable to all users, including those relying on
assistive technology.

### V. Maintainable Architecture & Error Handling
Code MUST be organized per the monorepo structure (`packages/frontend/`, `packages/backend/`)
and the file layout conventions in coding-guidelines.md (components, services, utils, routes,
controllers, middleware). Operations that can fail (API calls, I/O) MUST be wrapped in
try-catch (or equivalent) error handling, MUST surface meaningful, actionable error messages,
and MUST provide user-facing feedback on failure rather than failing silently. Comments MUST
explain "why", not "what"; obvious code MUST NOT be commented, and public functions/components
SHOULD use JSDoc. `console.log` statements MUST NOT remain in production code.
Rationale: Predictable structure and disciplined error handling keep the codebase navigable and
prevent silent failures from degrading the user experience.

## Technology Stack & Project Structure

- Frontend: React + React DOM, styled with CSS, tested with Jest and
  `@testing-library/react`.
- Backend: Node.js + Express.js, tested with Jest.
- Repository layout: npm workspaces monorepo with `packages/frontend/` and `packages/backend/`.
- Persistence: All todo data is persisted through the backend's Express.js API; there is no
  user-specific data isolation (single-user, global todo list).
- No new database, framework, or major dependency may be introduced without updating this
  constitution's Technology Stack section or documenting the exception in the relevant
  feature's plan.md Complexity Tracking section.

## Development Workflow & Review Process

- Git: Use feature branches (e.g., `feature/todo-editing`) and atomic commits with clear,
  "why"-focused messages. All changes MUST land via pull request review, not direct commits to
  the default branch.
- Before opening a pull request, contributors MUST: run `npm run lint` and resolve all errors,
  run `npm test` and confirm all tests pass, and self-review against the Code Review Checklist
  in coding-guidelines.md (naming, imports, DRY, single responsibility, error handling,
  comments, tests, atomic commits, no leftover `console.log`).
- Code review MUST verify compliance with all five Core Principles above before approval;
  reviewers MUST request changes for any unjustified deviation.
- Documentation in `docs/` MUST be updated in the same pull request whenever a change alters
  functional requirements, UI guidelines, coding conventions, or testing practices it describes.

## Governance

This constitution supersedes any conflicting ad hoc practice. Amendments require: (1) a
documented rationale for the change, (2) an update to this file including the version bump and
Sync Impact Report, and (3) review of dependent templates (plan, spec, tasks) for needed
alignment. Versioning follows semantic versioning: MAJOR for backward-incompatible principle
removals or redefinitions, MINOR for new principles or materially expanded guidance, PATCH for
clarifications and non-semantic wording fixes. All pull requests and code reviews MUST verify
compliance with this constitution; any added complexity (new dependency, architectural pattern,
or scope expansion) MUST be justified in the feature's plan.md Complexity Tracking section when
the relevant Spec Kit workflow is used. Use the docs referenced above
([project-overview.md](/workspaces/copilot-lab6/docs/project-overview.md),
[coding-guidelines.md](/workspaces/copilot-lab6/docs/coding-guidelines.md),
[functional-requirements.md](/workspaces/copilot-lab6/docs/functional-requirements.md),
[ui-guidelines.md](/workspaces/copilot-lab6/docs/ui-guidelines.md),
[testing-guidelines.md](/workspaces/copilot-lab6/docs/testing-guidelines.md)) for detailed,
day-to-day runtime guidance; this constitution defines the non-negotiable rules those docs must
uphold.

**Version**: 1.0.0 | **Ratified**: 2026-08-26 | **Last Amended**: 2026-08-26

