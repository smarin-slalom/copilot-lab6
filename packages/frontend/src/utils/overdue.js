/**
 * Determines if a todo is overdue based on its due date and completion status.
 *
 * A todo is considered overdue when:
 * - It is NOT completed (completed is falsy)
 * - It HAS a due date (dueDate is not null/undefined)
 * - Its due date's calendar day is strictly before today's calendar day
 *
 * Comparison is done on calendar days only (year/month/day), ignoring time-of-day
 * components, using the device/browser's local time zone.
 *
 * @param {{ dueDate: string | null, completed: number | boolean }} todo
 *   An object with at least `dueDate` (ISO date string YYYY-MM-DD or null/undefined)
 *   and `completed` (truthy/falsy).
 * @param {Date} [now]
 *   The reference date to compare against; defaults to `new Date()`.
 *   Provided as a parameter for deterministic testing without mocking global Date.
 *
 * @returns {boolean}
 *   `true` if the todo is incomplete and its due date is in the past (strictly before today),
 *   `false` otherwise.
 */
function isOverdue(todo, now = new Date()) {
  // If the todo is completed, it is never overdue
  if (todo.completed) {
    return false;
  }

  // If there is no due date, it is never overdue
  if (!todo.dueDate) {
    return false;
  }

  // Normalize both dates to midnight (start of day) in local time for calendar comparison
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateObj = new Date(todo.dueDate + 'T00:00:00');
  const dueDateStart = new Date(dueDateObj.getFullYear(), dueDateObj.getMonth(), dueDateObj.getDate());

  // The todo is overdue if its due date is strictly before today
  return dueDateStart < todayStart;
}

export default isOverdue;
