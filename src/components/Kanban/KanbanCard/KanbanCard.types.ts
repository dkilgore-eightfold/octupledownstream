import { ReactNode } from 'react';
import { KanbanLocale } from '../Kanban.types';
import { ButtonProps } from '../../Button';
import { CardProps } from '../../Card';
import { CheckboxProps } from '../../CheckBox';

export interface KanbanCardProps extends CardProps {
  /**
   * The card body content renderer.
   */
  body?: ReactNode;
  /**
   * The card checkbox props.
   */
  checkboxProps?: CheckboxProps;
  /**
   * Whether or not the card is checked.
   * @default false
   */
  checked?: boolean;
  /**
   * The card custom classes.
   */
  classNames?: string;
  /**
   * The collapse button aria label.
   */
  collapseButtonAriaLabel?: string;
  /**
   * The deselect card checkbox aria label.
   */
  deselectCardAriaLabel?: string;
  /**
   * Whether or not the card is expandable.
   * @default true
   */
  expandable?: boolean;
  /**
   * The expand button aria label.
   */
  expandButtonAriaLabel?: string;
  /**
   * The expand button props.
   */
  expandButtonProps?: ButtonProps;
  /**
   * The card expanded content renderer.
   */
  expandedContent?: ReactNode;
  /**
   * The card header content renderer.
   */
  header?: ReactNode;
  /**
   * Custom header classes.
   */
  headerClassNames?: string;
  /**
   * Whether or not the card is hoverable.
   * @default true
   */
  hoverable?: boolean;
  /**
   * The card hover content renderer.
   */
  hoverContent?: ReactNode;
  /**
   * The card id.
   */
  id?: string;
  /**
   * Whether or not the card is loading.
   */
  loading?: boolean;
  /**
   * Custom loading content of the card.
   */
  loadingContent?: ReactNode;
  /**
   * The kanban card locale.
   * @default 'enUS'
   */
  locale?: KanbanLocale;
  /**
   * Callback when the kanban card checkbox has changed.
   */
  onCheckboxChange?: (encId: string, checked: boolean) => void;
  /**
   * Callback when the kanban card loading has changed.
   * @default false
   */
  onLoadingChange?: (loading: boolean) => void;
  /**
   * The card is selectable and the checkbox is displayed.
   * @default false
   */
  selectable?: boolean;
  /**
   * The select card checkbox aria label.
   */
  selectCardAriaLabel?: string;
  /**
   * Callback when the card dimensions have changed.
   */
  updateDimension?: (async?: boolean, delay?: number) => void;
}
