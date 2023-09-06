import React, {
  cloneElement,
  FC,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { KanbanItemWrapperProps } from '../Kanban.types';

import styles from './kanbanItemWrapper.module.scss';

const InternalItemWrapper: FC<KanbanItemWrapperProps> = ({
  id,
  index,
  provided,
  children,
  updateDimension,
  isDragDisabled,
  'data-testid': dataTestId,
}) => {
  const itemRef: React.MutableRefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const updateItemDimensions = (async?: boolean, delay?: number): void => {
    if (itemRef.current) {
      updateDimension?.({
        width: itemRef.current.clientWidth,
        height: itemRef.current.clientHeight,
        async,
        delay,
      });
    }
  };

  useEffect((): void => {
    updateItemDimensions();
  }, [itemRef]);

  const getContent = (p: DraggableProvided): JSX.Element => (
    <div
      ref={p.innerRef}
      {...p.draggableProps}
      {...p.dragHandleProps}
      className={styles.draggableItemWrapper}
    >
      <div
        ref={itemRef}
        className={styles.draggableItem}
        data-testid={dataTestId}
      >
        {cloneElement(children as ReactElement, {
          updateDimension: updateItemDimensions,
        })}
      </div>
    </div>
  );

  if (provided) {
    return getContent(provided);
  }

  return (
    <Draggable
      draggableId={id}
      index={index}
      key={id}
      isDragDisabled={isDragDisabled}
    >
      {(p: DraggableProvided) => getContent(p)}
    </Draggable>
  );
};

export const KanbanItemWrapper: React.NamedExoticComponent<KanbanItemWrapperProps> =
  React.memo(InternalItemWrapper);
