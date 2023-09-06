import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { KanbanProvider, useKanban } from './Kanban.context';

describe('useKanban Hook', () => {
  test('Should return the context value from KanbanProvider', () => {
    const wrapper: React.FC = ({ children }) => (
      <KanbanProvider
        items={[]}
        lanes={[]}
        loadingProps={{ lanesCount: 0, loadingItem: <>...loading</> }}
      >
        {children}
      </KanbanProvider>
    );

    const { result } = renderHook(() => useKanban(), { wrapper });

    expect(result.current).toMatchObject({
      dragging: undefined,
      setDragging: expect.any(Function),
      items: [],
      getItems: expect.any(Function),
      lanes: [],
      loadingProps: expect.any(Object),
    });
  });
});
