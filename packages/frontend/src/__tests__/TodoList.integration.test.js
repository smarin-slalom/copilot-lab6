import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../components/TodoList';

describe('TodoList Integration Tests - Overdue Status Re-evaluation (US3)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should re-evaluate overdue status when rendering the same todos on different dates (US3)', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDateString = (date) => {
      return date.toISOString().split('T')[0];
    };

    // Create a todo that is due tomorrow
    const todosDueTomorrow = [
      {
        id: 1,
        title: 'Task due tomorrow',
        dueDate: formatDateString(tomorrow),
        completed: 0,
        createdAt: '2026-01-01T00:00:00Z'
      }
    ];

    // Render with todo due tomorrow - should NOT be overdue
    const { container, rerender } = render(
      <TodoList todos={todosDueTomorrow} {...mockHandlers} isLoading={false} />
    );

    let card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
    let icon = screen.queryByLabelText('Overdue');
    expect(icon).not.toBeInTheDocument();

    // Now simulate the date has advanced (by changing the todo's due date to yesterday)
    // In a real scenario, the app would re-fetch or re-render with current date
    // This test verifies that if the same component renders with a "stale" reference
    // to a date that is now in the past, it would correctly show as overdue
    const todosDueYesterday = [
      {
        id: 1,
        title: 'Task due tomorrow',
        dueDate: formatDateString(today), // was tomorrow, now is today
        completed: 0,
        createdAt: '2026-01-01T00:00:00Z'
      }
    ];

    rerender(
      <TodoList todos={todosDueYesterday} {...mockHandlers} isLoading={false} />
    );

    // After re-render with updated date reference, should NOT show overdue (still today)
    card = container.querySelector('.todo-card');
    expect(card).not.toHaveClass('overdue');
    icon = screen.queryByLabelText('Overdue');
    expect(icon).not.toBeInTheDocument();

    // Now set to past date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todosDueYesterdayActual = [
      {
        id: 1,
        title: 'Task due tomorrow',
        dueDate: formatDateString(yesterday),
        completed: 0,
        createdAt: '2026-01-01T00:00:00Z'
      }
    ];

    rerender(
      <TodoList todos={todosDueYesterdayActual} {...mockHandlers} isLoading={false} />
    );

    // Now should show as overdue
    card = container.querySelector('.todo-card');
    expect(card).toHaveClass('overdue');
    icon = screen.getByLabelText('Overdue');
    expect(icon).toBeInTheDocument();
  });

  it('should maintain correct overdue state when rendering multiple todos with different due dates (US3)', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDateString = (date) => {
      return date.toISOString().split('T')[0];
    };

    const todos = [
      {
        id: 1,
        title: 'Overdue task',
        dueDate: formatDateString(yesterday),
        completed: 0,
        createdAt: '2026-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Task due today',
        dueDate: formatDateString(today),
        completed: 0,
        createdAt: '2026-01-02T00:00:00Z'
      },
      {
        id: 3,
        title: 'Task due tomorrow',
        dueDate: formatDateString(tomorrow),
        completed: 0,
        createdAt: '2026-01-03T00:00:00Z'
      }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    const cards = container.querySelectorAll('.todo-card');
    expect(cards.length).toBe(3);

    // First card (overdue) should have overdue class
    expect(cards[0]).toHaveClass('overdue');
    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();

    // Second card (today) should NOT have overdue class
    expect(cards[1]).not.toHaveClass('overdue');

    // Third card (tomorrow) should NOT have overdue class
    expect(cards[2]).not.toHaveClass('overdue');

    // Should only have one "Overdue" icon
    const icons = screen.getAllByLabelText('Overdue');
    expect(icons.length).toBe(1);
  });
});
