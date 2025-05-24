import React from 'react';
import { render, screen } from '@testing-library/react';
import { InboxView } from '../../app/views_container/InboxView';
import { useDataStore } from '../../store/data_store';

jest.mock('../../app/task_components/TaskList', () => ({
  TaskList: ({ taskIds, TaskComponent, isMove }) => (
    <div data-testid="mock-task-list">
      {taskIds.map(id => <div key={id} data-testid={`task-item-${id}`}>{`Task ${id}`}</div>)}
    </div>
  ),
}));

jest.mock('../../app/task_components/Task', () => ({
  Task: ({ taskId }) => <div data-testid={`mock-task-${taskId}`}>Mock Task {taskId}</div>,
}));

jest.mock('../../store/data_store', () => ({
  useDataStore: jest.fn(),
}));

describe('InboxView', () => {
  const mockInbox = { id: 'inbox-123' };
  const mockUnsectionsByProject = {
    'inbox-123': { id: 'unsectioned-123' },
  };
  const mockTasks = {
    'task-1': { id: 'task-1', parent_id: 'unsectioned-123', status: 'pending', order: 1 },
    'task-2': { id: 'task-2', parent_id: 'unsectioned-123', status: 'in_progress', order: 2 },
    'task-3': { id: 'task-3', parent_id: 'unsectioned-123', status: 'completed', order: 3 },
    'task-4': { id: 'task-4', parent_id: 'other-section', status: 'pending', order: 4 },
    'task-5': { id: 'task-5', parent_id: 'unsectioned-123', status: 'pending', order: 0 },
  };

  beforeEach(() => {

    useDataStore.mockClear();

    useDataStore.mockImplementation((selector) => {
      if (selector.toString().includes('state.inbox')) {
        return mockInbox;
      }
      if (selector.toString().includes('state.unsectionsByProject')) {
        return mockUnsectionsByProject;
      }
      if (selector.toString().includes('state.tasks')) {
        return mockTasks;
      }
      return undefined;
    });
  });

  test('renders the Inbox title', () => {
    render(<InboxView />);
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });

  test('renders the section titles', () => {
    render(<InboxView />);
    expect(screen.getByText('Tareas sin Aclarar')).toBeInTheDocument();
    expect(screen.getByText('Tareas Aclaradas')).toBeInTheDocument();
    expect(screen.getByText('Tareas Completadas')).toBeInTheDocument();
  });

  test('passes correct pending task IDs to TaskList', () => {
    render(<InboxView />);

    const pendingTaskList = screen.getAllByTestId('mock-task-list')[0];

    expect(pendingTaskList).toHaveTextContent('Task task-5');
    expect(pendingTaskList).toHaveTextContent('Task task-1');
    expect(pendingTaskList).not.toHaveTextContent('Task task-2');
    expect(pendingTaskList).not.toHaveTextContent('Task task-3');
    expect(pendingTaskList).not.toHaveTextContent('Task task-4');
  });

  test('passes correct in-progress task IDs to TaskList', () => {
    render(<InboxView />);
    const inProgressTaskList = screen.getAllByTestId('mock-task-list')[1];

    expect(inProgressTaskList).toHaveTextContent('Task task-2');
    expect(inProgressTaskList).not.toHaveTextContent('Task task-1');
  });

  test('passes correct completed task IDs to TaskList', () => {
    render(<InboxView />);
    const completedTaskList = screen.getAllByTestId('mock-task-list')[2];

    expect(completedTaskList).toHaveTextContent('Task task-3');
    expect(completedTaskList).not.toHaveTextContent('Task task-1');
  });

  test('does not render tasks from other parent_ids', () => {
    render(<InboxView />);
    expect(screen.queryByText('Task task-4')).not.toBeInTheDocument();
  });

});
