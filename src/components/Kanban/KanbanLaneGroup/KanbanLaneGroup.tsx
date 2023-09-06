import React, { FC, Ref, useEffect, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import { a, SpringValue, useSpring } from '@react-spring/web';
import {
  KanbanDropzone,
  KanbanItemWrapperProps,
  KanbanLaneGroupProps,
  KanbanLaneItemData,
  KanbanLocale,
} from '../Kanban.types';
import { KanbanLane } from '../KanbanLane';
import { Badge } from '../../Badge';
import { Button, ButtonShape, ButtonSize, ButtonVariant } from '../../Button';
import { IconName } from '../../Icon';
import { Skeleton } from '../../Skeleton';
import { Stack } from '../../Stack';
import LocaleReceiver, {
  useLocaleReceiver,
} from '../../LocaleProvider/LocaleReceiver';
import { getLaneStyles } from '../utils';
import { useKanban } from '../KanbanContext/Kanban.context';
import { useCanvasDirection } from '../../../hooks/useCanvasDirection';
import { mergeClasses } from '../../../shared/utilities';
import enUS from '../Locale/en_US';

import styles from './kanbanLaneGroup.module.scss';

const InternalLaneGroup: FC<KanbanLaneGroupProps> = React.forwardRef(
  (props: KanbanLaneGroupProps, ref: Ref<List<KanbanLaneItemData>>) => {
    const {
      classNames,
      collapseButtonAriaLabel,
      dropzones,
      expandable = false,
      expandButtonAriaLabel,
      expandIconButtonProps,
      isDragDisabled,
      isExpanded = false,
      laneId,
      laneStyles,
      layout = 'vertical',
      loadingProps,
      locale = enUS,
      selectedBadgeContent,
      title,
      'data-testid': dataTestId,
      ...rest
    } = props;
    const { getItems } = useKanban();
    const [expanded, setExpanded] = useState(isExpanded);
    const { width, background, padding, height } = getLaneStyles(
      laneStyles,
      layout
    );

    const htmlDir: string = useCanvasDirection();

    const springProps: {
      minWidth: SpringValue<number>;
    } = useSpring({
      minWidth:
        expanded && layout === 'vertical'
          ? dropzones.length * width + dropzones.length * padding + padding
          : width,
    });

    useEffect((): void => {
      setExpanded(isExpanded);
    }, [isExpanded]);

    const [kanbanLocale] = useLocaleReceiver('Kanban');
    let mergedLocale: KanbanLocale;

    if (props.locale) {
      mergedLocale = props.locale;
    } else {
      mergedLocale = kanbanLocale || props.locale;
    }

    const laneGroupClassNames: string = mergeClasses([
      styles.laneGroup,
      { [styles.laneGroupHorizontal]: layout === 'horizontal' },
      { [styles.expanded]: expanded },
      classNames,
    ]);

    const count: number =
      getItems?.((dropzones || []).map((dz: KanbanDropzone) => dz.id))
        ?.length || 0;

    const selectedCount: number =
      getItems?.((dropzones || []).map((dz) => dz.id))
        .map((d: KanbanItemWrapperProps) => d.selected)
        .filter((i) => i)?.length || 0;

    return (
      <LocaleReceiver componentName={'Kanban'} defaultLocale={enUS}>
        {(_contextLocale: KanbanLocale) => {
          return (
            <a.div style={springProps} className={styles.animatedWrapper}>
              <div
                className={laneGroupClassNames}
                style={{
                  background,
                  height:
                    expandable && expanded && layout === 'horizontal'
                      ? 'auto'
                      : height,
                }}
              >
                <Stack
                  align="center"
                  classNames={styles.header}
                  fullWidth
                  justify="space-between"
                >
                  <Stack align="center" flexGap="xs">
                    <span>{title}</span>
                    {loadingProps?.loading ? (
                      <Skeleton animating width={16} height={16} />
                    ) : (
                      <Badge>{count}</Badge>
                    )}
                  </Stack>
                  <Stack align="center" flexGap="xs">
                    {!selectedBadgeContent && selectedCount > 0 && (
                      <div className={styles.selectedBadge}>
                        {htmlDir === 'rtl'
                          ? `${
                              mergedLocale.lang!.selectedBadgeText
                            } ${selectedCount}`
                          : `${selectedCount} ${
                              mergedLocale.lang!.selectedBadgeText
                            }`}
                      </div>
                    )}
                    {!!selectedBadgeContent && (
                      <div className={styles.selectedBadge}>
                        {selectedBadgeContent}
                      </div>
                    )}
                    {expandable && (
                      <Button
                        ariaLabel={
                          expanded
                            ? collapseButtonAriaLabel
                            : expandButtonAriaLabel
                        }
                        checked={expanded}
                        iconProps={{
                          path: IconName.mdiViewCarouselOutline,
                          rotate: layout === 'horizontal' ? 90 : 0,
                        }}
                        shape={ButtonShape.Round}
                        size={ButtonSize.Medium}
                        toggle
                        variant={ButtonVariant.SystemUI}
                        {...expandIconButtonProps}
                        onClick={() => setExpanded(!expanded)}
                      />
                    )}
                  </Stack>
                </Stack>
                {expanded ? (
                  <Stack
                    classNames={styles.subLaneContainer}
                    direction={
                      layout === 'horizontal' ? 'vertical' : 'horizontal'
                    }
                    flexGap="m"
                  >
                    {(dropzones || []).map((dz: KanbanDropzone) => (
                      <KanbanLane
                        {...rest}
                        key={dz.id}
                        title={dz.displayName}
                        laneId={dz.id}
                        dropzones={[dz]}
                        laneWidth={width}
                        layout={layout}
                        isSubLane
                        loadingProps={loadingProps}
                        ref={ref}
                        data-testid={dataTestId}
                      />
                    ))}
                  </Stack>
                ) : (
                  <KanbanLane
                    {...rest}
                    key={laneId}
                    title={title}
                    laneId={laneId}
                    dropzones={dropzones}
                    isDragDisabled={isDragDisabled}
                    laneWidth={width}
                    layout={layout}
                    loadingProps={loadingProps}
                    ref={ref}
                    data-testid={dataTestId}
                  />
                )}
              </div>
            </a.div>
          );
        }}
      </LocaleReceiver>
    );
  }
);

export const KanbanLaneGroup: React.ForwardRefExoticComponent<
  KanbanLaneGroupProps & React.RefAttributes<List<KanbanLaneItemData>>
> = React.memo(InternalLaneGroup);
