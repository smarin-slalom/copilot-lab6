import isOverdue from '../overdue';

describe('isOverdue', () => {
  // Reference dates for consistent testing
  const today = new Date(2026, 7, 19); // August 19, 2026 (month is 0-indexed)
  const yesterday = new Date(2026, 7, 18);
  const tomorrow = new Date(2026, 7, 20);

  describe('Completed todos', () => {
    test('returns false for completed todo with past due date', () => {
      const todo = { completed: 1, dueDate: '2026-08-18' };
      expect(isOverdue(todo, today)).toBe(false);
    });

    test('returns false for completed todo with today due date', () => {
      const todo = { completed: 1, dueDate: '2026-08-19' };
      expect(isOverdue(todo, today)).toBe(false);
    });

    test('returns false for completed todo with future due date', () => {
      const todo = { completed: 1, dueDate: '2026-08-20' };
      expect(isOverdue(todo, today)).toBe(false);
    });
  });

  describe('Incomplete todos with no due date', () => {
    test('returns false when dueDate is null', () => {
      const todo = { completed: 0, dueDate: null };
      expect(isOverdue(todo, today)).toBe(false);
    });

    test('returns false when dueDate is undefined', () => {
      const todo = { completed: 0 };
      expect(isOverdue(todo, today)).toBe(false);
    });

    test('returns false when dueDate is empty string', () => {
      const todo = { completed: 0, dueDate: '' };
      expect(isOverdue(todo, today)).toBe(false);
    });
  });

  describe('Incomplete todos with past due date', () => {
    test('returns true for incomplete todo with yesterday due date', () => {
      const todo = { completed: 0, dueDate: '2026-08-18' };
      expect(isOverdue(todo, today)).toBe(true);
    });

    test('returns true for incomplete todo with a week ago due date', () => {
      const todo = { completed: 0, dueDate: '2026-08-12' };
      expect(isOverdue(todo, today)).toBe(true);
    });

    test('returns true for incomplete todo with a year ago due date', () => {
      const todo = { completed: 0, dueDate: '2025-08-19' };
      expect(isOverdue(todo, today)).toBe(true);
    });
  });

  describe('Incomplete todos with today due date', () => {
    test('returns false for incomplete todo with today due date (not yet overdue)', () => {
      const todo = { completed: 0, dueDate: '2026-08-19' };
      expect(isOverdue(todo, today)).toBe(false);
    });
  });

  describe('Incomplete todos with future due date', () => {
    test('returns false for incomplete todo with tomorrow due date', () => {
      const todo = { completed: 0, dueDate: '2026-08-20' };
      expect(isOverdue(todo, today)).toBe(false);
    });

    test('returns false for incomplete todo with a week from now due date', () => {
      const todo = { completed: 0, dueDate: '2026-08-26' };
      expect(isOverdue(todo, today)).toBe(false);
    });

    test('returns false for incomplete todo with a year from now due date', () => {
      const todo = { completed: 0, dueDate: '2027-08-19' };
      expect(isOverdue(todo, today)).toBe(false);
    });
  });

  describe('Boolean-like completed values', () => {
    test('treats truthy completed as complete (returns false)', () => {
      const todo = { completed: true, dueDate: '2026-08-18' };
      expect(isOverdue(todo, today)).toBe(false);
    });

    test('treats falsy completed as incomplete (returns true for past date)', () => {
      const todo = { completed: false, dueDate: '2026-08-18' };
      expect(isOverdue(todo, today)).toBe(true);
    });

    test('treats undefined completed as incomplete (returns true for past date)', () => {
      const todo = { dueDate: '2026-08-18' };
      expect(isOverdue(todo, today)).toBe(true);
    });
  });

  describe('Time-of-day handling', () => {
    test('ignores time-of-day in dueDate (parses as midnight)', () => {
      // Even if we pass a dueDate with time info, it should be treated as that day's midnight
      const todo = { completed: 0, dueDate: '2026-08-18' };
      const nowAtEndOfDay = new Date(2026, 7, 19, 23, 59, 59);
      expect(isOverdue(todo, nowAtEndOfDay)).toBe(true);
    });

    test('treats today correctly regardless of current time', () => {
      const todo = { completed: 0, dueDate: '2026-08-19' };
      const earlyMorning = new Date(2026, 7, 19, 0, 0, 0);
      const lateEvening = new Date(2026, 7, 19, 23, 59, 59);
      expect(isOverdue(todo, earlyMorning)).toBe(false);
      expect(isOverdue(todo, lateEvening)).toBe(false);
    });
  });

  describe('Default now parameter', () => {
    test('uses current date when now is not provided', () => {
      const todo = { completed: 0, dueDate: '2020-01-01' };
      // Should return true because the due date is definitely in the past
      expect(isOverdue(todo)).toBe(true);
    });
  });
});
