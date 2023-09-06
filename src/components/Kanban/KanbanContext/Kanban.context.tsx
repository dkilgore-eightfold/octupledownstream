import React, { createContext, FC, useState } from 'react';
import {
  KanbanBoardLoadingProps,
  KanbanBoardProps,
  KanbanItemWrapperProps,
  KanbanDragStart,
  KanbanLaneProps,
} from '../Kanban.types';

export interface IKanbanContext {
  dragging?: KanbanDragStart;
  setDragging?: (dragging: KanbanDragStart | undefined) => void;
  items?: KanbanItemWrapperProps[];
  getItems?: (dropzoneIds: string[]) => KanbanItemWrapperProps[];
  lanes?: KanbanLaneProps[];
  loadingProps?: KanbanBoardLoadingProps;
}

const KanbanContext = createContext<Partial<IKanbanContext>>({});
export const KanbanProvider: FC<KanbanBoardProps> = ({
  children,
  items,
  lanes,
  loadingProps,
}) => {
  const [dragging, setDragging] = useState<KanbanDragStart>();

  const getItems = (dropzoneIds: string[]): KanbanItemWrapperProps[] =>
    items?.filter((item: KanbanItemWrapperProps) =>
      dropzoneIds.includes(item.dropzoneId)
    ) ?? [];

  return (
    <KanbanContext.Provider
      value={{
        dragging,
        setDragging,
        items,
        getItems,
        lanes,
        loadingProps,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = (): Partial<IKanbanContext> => {
  const context: Partial<IKanbanContext> = React.useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban used outside kanban provider');
  }
  return context;
};
