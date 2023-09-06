import React from 'react';
import { render } from '@testing-library/react';
import { KanbanItemWrapper } from './KanbanItemWrapper';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { KanbanItemWrapperProps } from '../Kanban.types';

jest.mock('react-beautiful-dnd', () => ({
  Draggable: jest.fn(({ children }) => children({})),
}));

const mockDraggableProps: DraggableProvided = {
  innerRef: jest.fn(),
  draggableProps: {
    style: { transform: 'translate(0, 0)', transition: 'none' },
    'data-rbd-draggable-context-id': '',
    'data-rbd-draggable-id': '',
  },
  dragHandleProps: {
    onDragStart: jest.fn(),
    'data-rbd-drag-handle-draggable-id': '',
    'data-rbd-drag-handle-context-id': '',
    'aria-describedby': '',
    role: '',
    tabIndex: 0,
    draggable: false,
  },
};

describe('KanbanItemWrapper', () => {
  test('Renders children and applies draggable props when provided', () => {
    const { getByTestId } = render(
      <KanbanItemWrapper provided={mockDraggableProps}>
        <div data-testid="content">Item Content</div>
      </KanbanItemWrapper>
    );

    const contentElement = getByTestId('content');
    expect(contentElement).toBeTruthy();
    expect(mockDraggableProps.innerRef).toHaveBeenCalled();
    expect(contentElement.parentElement?.parentElement?.classList).toContain(
      'draggable-item-wrapper'
    );
    expect(
      contentElement.parentElement?.parentElement?.style.transform
    ).toEqual('translate(0, 0)');
    expect(contentElement.parentElement?.classList).toContain('draggable-item');
  });

  test('Renders children and applies draggable props when not provided', () => {
    const mockUpdateDimension = jest.fn();
    const mockProps: KanbanItemWrapperProps = {
      id: 'item1',
      index: 0,
      updateDimension: mockUpdateDimension,
    };
    const { getByTestId } = render(
      <KanbanItemWrapper {...mockProps}>
        <div data-testid="content">Item Content</div>
      </KanbanItemWrapper>
    );

    const contentElement = getByTestId('content');
    expect(contentElement).toBeTruthy();
    expect(contentElement.parentElement?.parentElement?.classList).toContain(
      'draggable-item-wrapper'
    );
    expect(contentElement.parentElement?.classList).toContain('draggable-item');
  });
});
