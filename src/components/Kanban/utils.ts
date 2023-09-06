import { DragStart } from 'react-beautiful-dnd';
import { KanbanItemWrapperProps, KanbanLaneStyles } from './Kanban.types';

export const getDraggedItem = (
  items: KanbanItemWrapperProps[] | undefined,
  dragStart: DragStart
): KanbanItemWrapperProps | undefined =>
  items?.find((item) => item.id === dragStart?.draggableId);

export const getLaneStyles = (
  laneStyles: KanbanLaneStyles = {},
  layout: string = 'vertical'
): {
  width: number;
  height: string;
  background: string;
  padding: number;
} => {
  const LANE_WIDTH: number = layout === 'horizontal' ? 800 : 400;
  const LANE_HEIGHT: string = '100%';
  const LANE_PADDING: number = 16;
  const LANE_BG: string = 'var(--kanban-lane-group-background-color)';

  let styleObj = {
    width: LANE_WIDTH,
    height: LANE_HEIGHT,
    background: LANE_BG,
    padding: LANE_PADDING,
  };

  if (laneStyles) {
    Object.keys(laneStyles).forEach((key) => {
      const value = laneStyles[key as keyof KanbanLaneStyles];
      if (value) {
        styleObj = {
          ...styleObj,
          [key]: value,
        };
      }
    });
  }

  return styleObj;
};

export const getArray: (size: number) => number[] = (size: number): number[] =>
  Array.from(Array(size).keys());
