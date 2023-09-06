import React, { FC, Ref, useEffect, useState } from 'react';
import { Stack } from '../Stack';
import {
  DragDropContext,
  DragStart,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import {
  KanbanBoardProps,
  KanbanDragStart,
  KanbanLaneProps,
  KanbanLocale,
} from './Kanban.types';
import { KanbanProvider, useKanban } from './KanbanContext/Kanban.context';
import { KanbanLaneGroup, KanbanLaneLoader } from './KanbanLaneGroup';
import { getDraggedItem } from './utils';
import LocaleReceiver, {
  useLocaleReceiver,
} from '../LocaleProvider/LocaleReceiver';
import { mergeClasses } from '../../shared/utilities';
import enUS from './Locale/en_US';

import styles from './kanbanBoard.module.scss';

const InternalKanbanBoard: FC<KanbanBoardProps> = React.forwardRef(
  (props: KanbanBoardProps, ref: Ref<HTMLDivElement>) => {
    const {
      classNames,
      collapseButtonAriaLabel: defaultCollapseButtonAriaLabel,
      expandButtonAriaLabel: defaultExpandButtonAriaLabel,
      id,
      laneGroupClassNames,
      lanes = [],
      layout = 'vertical',
      loadingProps,
      locale = enUS,
      onDragEnd,
      onDragStart,
      style,
      'data-testid': dataTestId,
    } = props;
    const { items, dragging, setDragging } = useKanban();

    // ============================ Strings ===========================
    const [kanbanLocale] = useLocaleReceiver('Kanban');
    let mergedLocale: KanbanLocale;

    if (props.locale) {
      mergedLocale = props.locale;
    } else {
      mergedLocale = kanbanLocale || props.locale;
    }

    const [collapseButtonAriaLabel, setCollapseButtonAriaLabel] =
      useState<string>(defaultCollapseButtonAriaLabel);
    const [expandButtonAriaLabel, setExpandButtonAriaLabel] = useState<string>(
      defaultExpandButtonAriaLabel
    );

    // Locs: if the prop isn't provided use the loc defaults.
    // If the mergedLocale is changed, update.
    useEffect((): void => {
      setCollapseButtonAriaLabel(
        props.collapseButtonAriaLabel
          ? props.collapseButtonAriaLabel
          : mergedLocale.lang!.collapseButtonAriaLabelText
      );
      setExpandButtonAriaLabel(
        props.expandButtonAriaLabel
          ? props.expandButtonAriaLabel
          : mergedLocale.lang!.expandButtonAriaLabelText
      );
    }, [mergedLocale]);

    const onDragEnds = (
      result: DropResult,
      provided: ResponderProvided
    ): void => {
      onDragEnd?.(
        {
          ...result,
          source: dragging?.source,
        },
        provided
      );
      setDragging?.(undefined);
    };

    const onDragStarts = (
      start: DragStart,
      provided: ResponderProvided
    ): void => {
      const dragStart: KanbanDragStart = {
        ...start,
        source: {
          ...start.source,
          dropzoneId: getDraggedItem(items, start)?.dropzoneId,
        },
      };
      setDragging?.(dragStart);
      onDragStart?.(dragStart, provided);
    };

    return (
      <LocaleReceiver componentName={'Kanban'} defaultLocale={enUS}>
        {(_contextLocale: KanbanLocale) => {
          return (
            <DragDropContext onDragEnd={onDragEnds} onDragStart={onDragStarts}>
              <Stack
                classNames={mergeClasses([
                  styles.kanbanBoard,
                  { [styles.kanbanBoardHorizontal]: layout === 'horizontal' },
                  classNames,
                ])}
                direction={layout === 'horizontal' ? 'vertical' : 'horizontal'}
                flexGap="m"
                id={id}
                style={style}
                data-testid={dataTestId}
                ref={ref}
              >
                {loadingProps?.loading ? (
                  <KanbanLaneLoader {...loadingProps} />
                ) : (
                  (lanes || []).map((lane: KanbanLaneProps) => (
                    <KanbanLaneGroup
                      classNames={laneGroupClassNames}
                      collapseButtonAriaLabel={collapseButtonAriaLabel}
                      expandButtonAriaLabel={expandButtonAriaLabel}
                      key={lane.laneId}
                      layout={layout}
                      locale={locale}
                      {...lane}
                    />
                  ))
                )}
              </Stack>
            </DragDropContext>
          );
        }}
      </LocaleReceiver>
    );
  }
);

export const KanbanBoard: FC<KanbanBoardProps> = (props: KanbanBoardProps) => (
  <KanbanProvider {...props}>
    <InternalKanbanBoard {...props} />
  </KanbanProvider>
);
