import { renderHook, act } from '@testing-library/react';
import { useKanban } from '../hooks/useKanban';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useKanban hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default data', () => {
    const { result } = renderHook(() => useKanban());
    expect(result.current.data.columnOrder).toHaveLength(3);
    expect(result.current.theme).toBe('indigo');
  });

  it('should add a task to a column', () => {
    const { result } = renderHook(() => useKanban());
    const columnId = 'column-1';
    const initialTaskCount = result.current.data.columns[columnId].taskIds.length;

    act(() => {
      result.current.addTask(columnId, 'New Test Task', '2025-01-01');
    });

    expect(result.current.data.columns[columnId].taskIds).toHaveLength(initialTaskCount + 1);
    const newTaskId = result.current.data.columns[columnId].taskIds[initialTaskCount];
    expect(result.current.data.tasks[newTaskId].content).toBe('New Test Task');
  });

  it('should delete a task', () => {
    const { result } = renderHook(() => useKanban());
    const columnId = 'column-1';
    const taskIdToDelete = result.current.data.columns[columnId].taskIds[0];
    const initialTaskCount = result.current.data.columns[columnId].taskIds.length;

    act(() => {
      result.current.deleteTask(columnId, taskIdToDelete);
    });

    expect(result.current.data.columns[columnId].taskIds).toHaveLength(initialTaskCount - 1);
    expect(result.current.data.tasks[taskIdToDelete]).toBeUndefined();
  });

  it('should update task priority', () => {
    const { result } = renderHook(() => useKanban());
    const taskId = 'task-1';
    const initialPriority = result.current.data.tasks[taskId].priority;

    act(() => {
      result.current.togglePriority(taskId);
    });

    expect(result.current.data.tasks[taskId].priority).not.toBe(initialPriority);
  });
});
