import React, { FC, Ref, useLayoutEffect, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import {
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { Badge } from '../../Badge';
import { Skeleton } from '../../Skeleton';
import { Stack } from '../../Stack';
import { FadeIn } from '../../FadeIn';

// eslint-disable-next-line import/no-extraneous-dependencies
import AutoSizer from 'react-virtualized-auto-sizer';

import {
  KanbanDropzone,
  KanbanItemWrapperProps,
  KanbanLaneItemData,
  KanbanLaneProps,
  LaneValidation,
  UpdateDimensionProps,
} from '../Kanban.types';
import { KanbanLaneItem } from './KanbanLaneItem';
import { KanbanItemLoaders, KanbanItemWrapper } from '../KanbanItemWrapper';
import { useKanban } from '../KanbanContext/Kanban.context';
import { useMergedRefs } from '../../../hooks/useMergedRefs';
import { debounce, mergeClasses } from '../../../shared/utilities';

import styles from './kanbanLane.module.scss';

const InternalKanbanLane: FC<KanbanLaneProps> = React.forwardRef(
  (props: KanbanLaneProps, ref: Ref<List<KanbanLaneItemData>>) => {
    const {
      classNames,
      dropzoneClassNames,
      dropzones,
      isSubLane,
      laneId,
      laneWidth,
      layout = 'vertical',
      loadingProps,
      title,
      'data-testid': dataTestId,
      ...rest
    } = props;
    const { dragging, getItems } = useKanban();
    const rowHeights: React.MutableRefObject<
      Record<
        string | number,
        {
          height: number;
          width: number;
        }
      >
    > = useRef<Record<number | string, { height: number; width: number }>>({});
    const internalRef: React.MutableRefObject<List<KanbanLaneItemData>> =
      useRef<List<KanbanLaneItemData>>(null);
    const mergedRef: (node: List<KanbanLaneItemData>) => void = useMergedRefs(
      internalRef,
      ref
    );

    useLayoutEffect((): void => {
      internalRef.current?.scrollTo?.(0);
    }, [laneId]);

    const dropzoneContainerClassNames: string = mergeClasses([
      styles.dropzoneContainer,
      {
        [styles.active]: dragging,
      },
      dropzoneClassNames,
    ]);

    /** true  => drop allowed, false => drop NOT allowed */
    const isDroppable = (destinationDz: KanbanDropzone): boolean => {
      if (dragging?.source?.dropzoneId === undefined) return true;
      // Drag into same dropzone (i.e. source dropzone) is blocked
      // as it will end up triggering events that are not needed
      if (dragging?.source?.dropzoneId === destinationDz.id) return false;
      // TODO: decide whether to do `OR` or `AND` operation between all validation rules
      // TODO: decide the default value if validation rule is not defined (currently it is `true`)
      return (
        destinationDz?.validation?.every((value: LaneValidation) =>
          value.rule(dragging?.draggableId)
        ) ?? true
      );
    };

    const getItemSize = (index: number) =>
      rowHeights.current[index]?.height || 200;

    const setItemSize = ({
      index,
      width,
      height,
      async = true,
      delay = 0,
    }: UpdateDimensionProps) => {
      const runner = () => {
        internalRef?.current?.resetAfterIndex(0, true);
        rowHeights.current = {
          ...rowHeights.current,
          [index]: {
            height,
            width,
          },
        };
      };
      if (!async) {
        runner();
      }
      debounce(() => {
        runner();
      }, delay);
    };

    const [activeDropzoneName, setActiveDropzoneName] = useState<string | null>(
      null
    );

    const handleDropZoneEnter = (name: string, dropEnable: boolean): void => {
      if (dropEnable) {
        setActiveDropzoneName(name);
      }
    };

    const handleDropZoneLeave = (): void => {
      setActiveDropzoneName(null);
    };

    return (
      <FadeIn
        classNames={mergeClasses([
          styles.laneContainer,
          { [styles.laneContainerHorizontal]: layout === 'horizontal' },
          classNames,
        ])}
        data-testid={dataTestId}
      >
        <Droppable
          droppableId={laneId}
          isDropDisabled={!!dragging}
          mode="virtual"
          renderClone={(
            provided: DraggableProvided,
            snapshot: DraggableStateSnapshot,
            rubric: DraggableRubric
          ) => {
            const { index } = rubric.source;
            const item: KanbanItemWrapperProps = getItems?.(
              (dropzones || [])?.map((dz: KanbanDropzone) => dz.id)
            )?.[index];
            if (!item) return <></>;
            return (
              <KanbanItemWrapper
                {...item}
                provided={provided}
                snapshot={snapshot}
                updateDimension={(p: UpdateDimensionProps) =>
                  setItemSize({ ...p, index })
                }
              >
                {item.render()}
              </KanbanItemWrapper>
            );
          }}
        >
          {(provided: DroppableProvided) => {
            const items: KanbanItemWrapperProps[] = getItems?.(
              (dropzones || [])?.map((dz: KanbanDropzone) => dz.id)
            );
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={mergeClasses([
                  styles.lane,
                  {
                    [styles.subLane]: isSubLane,
                  },
                  {
                    [styles.subLaneWithItems]:
                      layout === 'horizontal' && isSubLane && items?.length > 0,
                  },
                ])}
              >
                {isSubLane && (
                  <Stack align="center" flexGap="xs" classNames={styles.header}>
                    <span>{title}</span>
                    {loadingProps?.loading ? (
                      <Skeleton animating width={16} height={16} />
                    ) : (
                      <Badge>{items?.length}</Badge>
                    )}
                  </Stack>
                )}
                {loadingProps?.loading ? (
                  <KanbanItemLoaders width={laneWidth} bordered={isSubLane}>
                    {loadingProps.loadingItem}
                  </KanbanItemLoaders>
                ) : (
                  <AutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                      <List
                        {...rest}
                        height={height}
                        itemCount={items?.length ?? 0}
                        itemSize={getItemSize}
                        width={
                          (layout === 'horizontal' ? width : laneWidth) ?? 0
                        }
                        outerRef={provided.innerRef}
                        itemData={{ items, setItemSize }}
                        ref={mergedRef}
                        className={styles.list}
                      >
                        {KanbanLaneItem}
                      </List>
                    )}
                  </AutoSizer>
                )}
              </div>
            );
          }}
        </Droppable>

        <div className={dropzoneContainerClassNames}>
          {(dropzones || []).map((dz: KanbanDropzone) => {
            const droppable: boolean = isDroppable(dz);
            return (
              <Droppable
                key={dz.id}
                droppableId={dz.id}
                isDropDisabled={!droppable}
              >
                {(
                  provided: DroppableProvided,
                  snapshot: DroppableStateSnapshot
                ) => {
                  const hovering: boolean =
                    snapshot.isDraggingOver ||
                    activeDropzoneName === dz.displayName;
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={mergeClasses([
                        styles.dropzone,
                        {
                          [styles.hovering]: hovering,
                          [styles.disabled]: !droppable,
                        },
                      ])}
                      onMouseEnter={() =>
                        handleDropZoneEnter(dz.displayName, !droppable)
                      }
                      onMouseLeave={handleDropZoneLeave}
                    >
                      <div className={styles.dropzoneName}>
                        {dz.displayName}
                        {provided.placeholder}
                      </div>
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </div>
      </FadeIn>
    );
  }
);

export const KanbanLane: React.ForwardRefExoticComponent<
  KanbanLaneProps & React.RefAttributes<List<KanbanLaneItemData>>
> = React.memo(InternalKanbanLane);
