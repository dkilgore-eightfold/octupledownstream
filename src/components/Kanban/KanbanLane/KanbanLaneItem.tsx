import React, { FC } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { areEqual } from 'react-window';
import {
  KanbanItemWrapperProps,
  KanbanLaneItemProps,
  UpdateDimensionProps,
} from '../Kanban.types';
import { KanbanItemWrapper } from '../KanbanItemWrapper';

const InternalLaneItem: FC<KanbanLaneItemProps> = ({ data, index, style }) => {
  const { items, setItemSize } = data;
  const item: KanbanItemWrapperProps = items[index];

  // We are rendering an extra item for the placeholder
  if (!item) {
    return null;
  }

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {(provided: DraggableProvided) => (
        <div ref={provided.innerRef} style={style}>
          <KanbanItemWrapper
            {...item}
            width="auto"
            updateDimension={(p: UpdateDimensionProps) => {
              setItemSize({
                ...p,
                index,
              });
            }}
          >
            {item.render()}
          </KanbanItemWrapper>
        </div>
      )}
    </Draggable>
  );
};

export const KanbanLaneItem: React.NamedExoticComponent<KanbanLaneItemProps> =
  React.memo(InternalLaneItem, areEqual);
