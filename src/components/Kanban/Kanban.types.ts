import React, { ReactNode, Ref } from 'react';
import {
  DraggableLocation,
  DraggableProvided,
  DraggableStateSnapshot,
  DragStart,
  DropResult,
  ResponderProvided,
  Responders,
} from 'react-beautiful-dnd';
import { ButtonProps } from '../Button';
import { VariableSizeList as List } from 'react-window';

type Locale = {
  /**
   * The KanbanBoard locale.
   */
  locale: string;
  /**
   * The KanbanBoard `Collapse` Button aria label string.
   */
  collapseButtonAriaLabelText?: string;
  /**
   * The KanbanCard `Deselect card` Checkbox aria label string.
   */
  deselectCardAriaLabelText?: string;
  /**
   * The KanbanBoard `Expand` Button aria label string.
   */
  expandButtonAriaLabelText?: string;
  /**
   * The KanbanBoard `${selectedCount} selected` badge aria label string.
   */
  selectedBadgeText?: string;
  /**
   * The KanbanCard `Select card` Checkbox aria label string.
   */
  selectCardAriaLabelText?: string;
};

export type KanbanLocale = {
  lang: Locale;
};

export interface KanbanLoadingProps {
  /**
   * The custom loading item.
   */
  loadingItem: ReactNode;
  /**
   * determines loading state.
   */
  loading?: boolean;
}

export interface KanbanBoardLoadingProps extends KanbanLoadingProps {
  /**
   * The number of lanes loading.
   */
  lanesCount: number;
}

export interface KanbanItemLoadersProps {
  bordered?: boolean;
  width?: number | string;
}

export interface KanbanDragSource extends DraggableLocation {
  dropzoneId?: string;
}

export interface KanbanDragStart extends Omit<DragStart, 'source'> {
  source: KanbanDragSource;
}

export interface KanbanDragResult extends Omit<DropResult, 'source'> {
  source: KanbanDragSource;
}

export type OnDragStartResponder = (
  start: KanbanDragStart,
  provided: ResponderProvided
) => void;

export type OnDragEndResponder = (
  result: KanbanDragResult,
  provided: ResponderProvided
) => void;

export interface KanbanResponders
  extends Omit<Responders, 'onDragStart' | 'onDragEnd'> {
  onDragStart?: OnDragStartResponder;
  onDragEnd?: OnDragEndResponder;
}

export interface ItemAction {
  /**
   * The text for the action.
   */
  text?: string;
}

export interface KanbanLaneItemData {
  items: KanbanItemWrapperProps[];
  setItemSize: (props: UpdateDimensionProps) => void;
}

export interface KanbanLaneItemProps {
  data: KanbanLaneItemData;
  index: number;
  style: React.CSSProperties;
}

export interface UpdateDimensionProps {
  height: number;
  width: number;
  async?: boolean;
  delay?: number;
  index?: number;
}

export interface KanbanLaneStyles {
  /**
   * Set this if you want custom background
   * @default 'var(--grey-color-10)'
   */
  background?: string;
  /**
   * Set this if you want custom width
   * @default 400
   */
  width?: number | string;
  /**
   * Set this if you want custom padding
   * @default 16
   */
  padding?: string | number;
  /**
   * Set this if you want custom height
   * @default 100%
   */
  height?: string | number;
}

export interface KanbanBoardProps extends KanbanResponders {
  /**
   * The kanban board id.
   */
  id?: string;
  /**
   * The array of kanban board items.
   */
  items: KanbanItemWrapperProps[];
  /**
   * An array of lane groups, each containing a set of lanes.
   */
  lanes: KanbanLaneProps[];
  /**
   * The kanban board class names.
   */
  classNames?: string;
  /**
   * The kanban collapse button aria label.
   * @default 'Collapse'
   */
  collapseButtonAriaLabel?: string;
  /**
   * Optional state management forward debugging flag.
   */
  debug?: boolean;
  /**
   * The kanban expand button aria label.
   * @default 'Expand'
   */
  expandButtonAriaLabel?: string;
  /**
   * Type of layout for the kanban board
   * @default vertical
   */
  layout?: 'vertical' | 'horizontal';
  /**
   * The kanban board locale.
   * @default 'enUS'
   */
  locale?: KanbanLocale;
  /**
   * The kanban board lane group class names.
   */
  laneGroupClassNames?: string;
  /**
   * The kanban board loading props.
   */
  loadingProps?: KanbanBoardLoadingProps;
  /**
   * The kanban board onHover callback.
   */
  onHover?: () => void;
  /**
   * The kanban board onSelection callback.
   * Called when an item is selected.
   */
  onSelection?: (items: KanbanItemWrapperProps[]) => void;
  /**
   * The kanban board component ref
   */
  ref?: Ref<HTMLDivElement>;
  /**
   * The kanban board inline styles.
   */
  style?: React.CSSProperties;
  /**
   * Unique id used to target element for testing.
   */
  'data-testid'?: string;
}

export interface KanbanLaneGroupProps
  extends Omit<KanbanLaneProps, 'data-testid' | 'ref'> {
  /**
   * The kanban board lane group class names.
   */
  classNames?: string;
  /**
   * The kanban collapse button aria label.
   */
  collapseButtonAriaLabel?: string;
  /**
   * Is the lane expandable or not.
   * @default false
   */
  expandable?: boolean;
  /**
   * The kanban expand button aria label.
   */
  expandButtonAriaLabel?: string;
  /**
   * The lane group expand icon button props.
   */
  expandIconButtonProps?: ButtonProps;
  /**
   * If the lane is expanded.
   * @default false
   */
  isExpanded?: boolean;
  /**
   * The kanban board lane group inline styles.
   */
  laneStyles?: KanbanLaneStyles;
  /**
   * Type of layout for the kanban lane group
   * @default vertical
   */
  layout?: 'vertical' | 'horizontal';
  /**
   * The kanban board lane group locale.
   * (inherits from KanbanBoard)
   */
  locale?: KanbanLocale;
  /**
   * The kanban board lane group component ref.
   */
  ref?: Ref<List<KanbanLaneItemData>>;
  /**
   * Set this value to to show selected count in the lane header.
   * @default null
   */
  selectedBadgeContent?: string;
  /**
   * Unique id used to target element for testing.
   */
  'data-testid'?: string;
}

export interface KanbanDropzone {
  /**
   * Display name of the dropzone
   */
  displayName: string;
  /**
   * An identifier for the dropzone.
   */
  id: string;
  /**
   * A boolean value indicating whether the dropzone is active or not.
   */
  active?: boolean;
  /**
   * The kanban board dropzone class names.
   */
  classNames?: string;
  /**
   * Whether drop is disabled.
   */
  isDropDisabled?: boolean;
  /**
   * The component ref
   */
  ref?: Ref<HTMLDivElement>;
  /**
   * An array of validation rules for the dropzone.
   */
  validation?: LaneValidation[];
  /**
   * Unique id used to target element for testing.
   */
  'data-testid'?: string;
}

export interface KanbanLaneProps {
  /**
   * An array of dropzones for the kanban lane.
   */
  dropzones: KanbanDropzone[];
  /**
   * An identifier for the kanban lane.
   */
  laneId: string;
  /**
   * Type of layout for the kanban lane.
   * @default vertical
   */
  layout?: 'vertical' | 'horizontal';
  /**
   * The kanban lane title.
   */
  title: ReactNode;
  /**
   * The kanban board lane class names.
   */
  classNames?: string;
  /**
   * The kanban board drop zone class names.
   */
  dropzoneClassNames?: string;
  /**
   * If the dragging is disabled for the given lane
   * @default false
   */
  isDragDisabled?: boolean;
  /**
   * Whether the kanban lane is a sub lane.
   */
  isSubLane?: boolean;
  /**
   * The kanban lane width.
   */
  laneWidth?: number;
  /**
   * The kanban lane loading props.
   */
  loadingProps?: KanbanLoadingProps;
  /**
   * The kanban lane component ref.
   */
  ref?: Ref<List<KanbanLaneItemData>>;
  /**
   * Unique id used to target element for testing.
   */
  'data-testid'?: string;
}

export interface LaneValidation {
  /**
   * An identifier for the validation rule.
   */
  id: string;
  /**
   * A validation rule for the dropzone.
   *
   * `sourceDropzoneId` denotes the dropzone of the item which is being dragged.
   * IF the `rule` function return `true`, THEN the dragged item can be dropped
   * into the dropzone to whom this `rule` belongs to.
   */
  rule: (dropzoneId: string | undefined) => boolean;
}

export interface BaseItem {
  /**
   * An array of actions that can be performed on the item.
   */
  actions?: ItemAction[];
  /**
   * A callback function that is called when the item is expanded.
   */
  onExpand?: () => void;
  /**
   * A callback function that is called when the item is selected.
   */
  onSelect?: () => void;
}

export interface KanbanItemWrapperProps extends BaseItem {
  /**
   * The ItemWrapper children.
   */
  children?: React.ReactNode;
  /**
   * The kanban board item wrapper class names.
   */
  classNames?: string;
  /**
   * An identifier for the dropzone containing the item.
   */
  dropzoneId?: string;
  /**
   * An identifier for the item.
   */
  id?: string;
  /**
   * The ItemWrapper index.
   */
  index?: number;
  /**
   * Whether item drag is disabled.
   */
  isDragDisabled?: boolean;
  /**
   * An identifier for the lane containing the item.
   */
  laneId?: string;
  /**
   * The provided draggable content.
   */
  provided?: DraggableProvided;
  /**
   * The component ref.
   */
  ref?: Ref<HTMLDivElement>;
  /**
   * A function returning the JSX that renders the item.
   */
  render?: () => ReactNode;
  /**
   * Whether the item is selected.
   */
  selected?: boolean;
  /**
   * Returns the current state of the draggable item.
   */
  snapshot?: DraggableStateSnapshot;
  /**
   * Updates props of the ItemWrapper.
   */
  updateDimension?: (props: UpdateDimensionProps) => void;
  /**
   * The ItemWrapper width.
   */
  width?: number | string;
  /**
   * Unique id used to target element for testing.
   */
  'data-testid'?: string;
}
