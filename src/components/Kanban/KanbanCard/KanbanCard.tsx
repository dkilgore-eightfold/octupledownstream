import React, { FC, Ref, useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { a, useSpring } from '@react-spring/web';
import { KanbanCardProps } from './KanbanCard.types';
import { KanbanLocale } from '../Kanban.types';
import { Button, ButtonShape, ButtonSize, ButtonVariant } from '../../Button';
import { Card, CardSize } from '../../Card';
import { CheckBox } from '../../CheckBox';
import { IconName } from '../../Icon';
import { Skeleton, SkeletonVariant } from '../../Skeleton';
import { Stack } from '../../Stack';
import LocaleReceiver, {
  useLocaleReceiver,
} from '../../LocaleProvider/LocaleReceiver';
import { useCanvasDirection } from '../../../hooks/useCanvasDirection';
import { usePreviousState } from '../../../hooks/usePreviousState';
import { generateId, mergeClasses } from '../../../shared/utilities';
import enUS from '../Locale/en_US';

import styles from './kanbanCard.module.scss';

const InternalKanbanCard: FC<KanbanCardProps> = React.forwardRef(
  (props: KanbanCardProps, ref: Ref<HTMLDivElement>) => {
    const {
      body,
      checkboxProps,
      checked = false,
      classNames,
      collapseButtonAriaLabel: defaultCollapseButtonAriaLabel,
      deselectCardAriaLabel: defaultDeselectCardAriaLabel,
      expandButtonAriaLabel: defaultExpandButtonAriaLabel,
      expandable = true,
      expandButtonProps,
      expandedContent,
      header,
      headerClassNames,
      hoverable = true,
      hoverContent,
      id,
      loading = false,
      loadingContent,
      locale = enUS,
      onCheckboxChange,
      onLoadingChange,
      selectable = false,
      selectCardAriaLabel: defaultSelectCardAriaLabel,
      updateDimension,
      ...rest
    } = props;
    const htmlDir: string = useCanvasDirection();
    const [cardHovered, setCardHovered] = useState<boolean>(false);
    const [cardExpanded, setCardExpanded] = useState<boolean>(false);
    const [focused, setFocused] = useState<boolean>(false);
    const isFocusedOrHovered: boolean = hoverable && (focused || cardHovered);
    const isExpandedOrHovered: boolean =
      hoverable && (cardHovered || cardExpanded);
    const cardId = useRef<string>(id || generateId());

    const expandedCardRef: React.MutableRefObject<HTMLDivElement> =
      useRef(null);
    const [containerRef, containerBounds] = useMeasure();
    const expandingSpringProps = useSpring({
      height: cardExpanded ? containerBounds.height : 0,
      opacity: cardExpanded ? 1 : 0,
      marginTop: cardExpanded ? 8 : -8,
    });

    const [hoverActionsContainerRef, hoverActionsContainerBounds] =
      useMeasure();
    const hoverActionsSpringProps = useSpring({
      height: isExpandedOrHovered ? hoverActionsContainerBounds.height : 0,
      opacity: isExpandedOrHovered ? 1 : 0,
      marginTop: isExpandedOrHovered ? 12 : -8,
    });

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
    const [deselectCardAriaLabel, setDeselectCardAriaLabel] = useState<string>(
      defaultDeselectCardAriaLabel
    );
    const [expandButtonAriaLabel, setExpandButtonAriaLabel] = useState<string>(
      defaultExpandButtonAriaLabel
    );
    const [selectCardAriaLabel, setSelectCardAriaLabel] = useState<string>(
      defaultSelectCardAriaLabel
    );

    // Locs: if the prop isn't provided use the loc defaults.
    // If the mergedLocale is changed, update.
    useEffect((): void => {
      setCollapseButtonAriaLabel(
        props.collapseButtonAriaLabel
          ? props.collapseButtonAriaLabel
          : mergedLocale.lang!.collapseButtonAriaLabelText
      );
      setDeselectCardAriaLabel(
        props.deselectCardAriaLabel
          ? props.deselectCardAriaLabel
          : mergedLocale.lang!.deselectCardAriaLabelText
      );
      setExpandButtonAriaLabel(
        props.expandButtonAriaLabel
          ? props.expandButtonAriaLabel
          : mergedLocale.lang!.expandButtonAriaLabelText
      );
      setSelectCardAriaLabel(
        props.selectCardAriaLabel
          ? props.selectCardAriaLabel
          : mergedLocale.lang!.selectCardAriaLabelText
      );
    }, [mergedLocale]);

    const cardWrapperClassNames: string = mergeClasses([styles.cardWrapper]);

    const [cardWrapperRef, cardWrapperBounds] = useMeasure();
    const previousCardWrapperBounds: DOMRectReadOnly =
      usePreviousState(cardWrapperBounds);
    useEffect(() => {
      updateDimension?.(
        previousCardWrapperBounds &&
          cardWrapperBounds.height === previousCardWrapperBounds?.height
      );
    }, [cardWrapperBounds?.height, previousCardWrapperBounds?.height]);

    useEffect(() => {
      onLoadingChange?.(loading);
    }, [loading]);

    if (loading) {
      if (loadingContent) {
        return <>{loadingContent}</>;
      }

      return (
        <Stack dir={htmlDir} direction="vertical" flexGap="m" fullWidth>
          <Stack
            dir={htmlDir}
            flexGap="xs"
            direction="horizontal"
            align="flex-start"
          >
            <Skeleton
              width={40}
              height={40}
              animating
              variant={SkeletonVariant.Circular}
            />
            <Stack dir={htmlDir} direction="vertical" flexGap="xs">
              <Skeleton
                width={120}
                height={16}
                animating
                variant={SkeletonVariant.Pill}
              />
              <Skeleton
                width={200}
                height={14}
                animating
                variant={SkeletonVariant.Pill}
              />
            </Stack>
          </Stack>
          <Stack dir={htmlDir} flexGap="xs" direction="vertical" fullWidth>
            <Stack dir={htmlDir} flexGap="xs">
              <Skeleton
                width={100}
                height={14}
                animating
                variant={SkeletonVariant.Pill}
              />
              <Skeleton
                width={100}
                height={14}
                animating
                variant={SkeletonVariant.Pill}
              />
            </Stack>
            <Stack dir={htmlDir} flexGap="xs" justify="flex-end" fullWidth>
              <Skeleton
                width={40}
                height={24}
                animating
                variant={SkeletonVariant.Pill}
              />
              <Skeleton
                width={40}
                height={24}
                animating
                variant={SkeletonVariant.Pill}
              />
            </Stack>
          </Stack>
        </Stack>
      );
    }

    return (
      <LocaleReceiver componentName={'Kanban'} defaultLocale={enUS}>
        {(_contextLocale: KanbanLocale) => {
          return (
            <div className={cardWrapperClassNames} ref={cardWrapperRef}>
              <div className={styles.cardOuterWrapper}>
                <Card
                  {...rest}
                  bordered
                  classNames={mergeClasses([styles.card, classNames])}
                  focus-visible-id="focus-visible-target"
                  id={cardId.current}
                  onMouseEnter={hoverable ? () => setCardHovered(true) : null}
                  onMouseLeave={hoverable ? () => setCardHovered(false) : null}
                  onFocus={hoverable ? () => setFocused(true) : null}
                  onBlur={hoverable ? () => setFocused(false) : null}
                  ref={ref}
                  size={CardSize.Small}
                >
                  <Stack
                    dir={htmlDir}
                    direction="vertical"
                    flexGap="s"
                    fullWidth
                  >
                    <Stack
                      dir={htmlDir}
                      fullWidth
                      direction="horizontal"
                      flexGap="xs"
                      align="flex-start"
                      justify="space-between"
                    >
                      {!!selectable && (
                        <CheckBox
                          ariaLabel={
                            checked
                              ? deselectCardAriaLabel
                              : selectCardAriaLabel
                          }
                          checked={checked}
                          classNames={styles.checkbox}
                          onChange={(e) => {
                            onCheckboxChange(cardId.current, e.target.checked);
                          }}
                          {...checkboxProps}
                        />
                      )}
                      {!!header && (
                        <div
                          className={mergeClasses([
                            styles.header,
                            headerClassNames,
                          ])}
                        >
                          {header}
                        </div>
                      )}
                      {!!expandable && (
                        <Button
                          ariaLabel={
                            cardExpanded
                              ? collapseButtonAriaLabel
                              : expandButtonAriaLabel
                          }
                          checked={cardExpanded}
                          classNames={mergeClasses([
                            styles.expandButton,
                            {
                              [styles.visible]:
                                (isFocusedOrHovered || cardExpanded) &&
                                expandedCardRef.current?.textContent,
                            },
                          ])}
                          disabled={
                            (isFocusedOrHovered || cardExpanded) &&
                            !expandedCardRef.current?.textContent
                          }
                          iconProps={{
                            path: cardExpanded
                              ? IconName.mdiChevronUp
                              : IconName.mdiChevronDown,
                          }}
                          shape={ButtonShape.Round}
                          size={ButtonSize.Medium}
                          toggle
                          variant={ButtonVariant.SystemUI}
                          {...expandButtonProps}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardExpanded((value) => !value);
                          }}
                        />
                      )}
                    </Stack>

                    {!!body && body}

                    {/* Expanding Card */}
                    {!!expandable && (
                      <a.div style={expandingSpringProps}>
                        <div
                          ref={containerRef}
                          className={mergeClasses([
                            styles.expandedContent,
                            {
                              [styles.expanded]: cardExpanded,
                            },
                          ])}
                        >
                          <div className={styles.dividerExpandedCard} />
                          <div ref={expandedCardRef}>
                            {!!expandedContent && expandedContent}
                          </div>
                        </div>
                      </a.div>
                    )}

                    {/* Quick Actions */}
                    {!!hoverable && (
                      <a.div style={hoverActionsSpringProps}>
                        <Stack
                          dir={htmlDir}
                          ref={hoverActionsContainerRef}
                          direction="vertical"
                          flexGap="m"
                          fullWidth
                          justify="flex-end"
                        >
                          <div className={styles.dividerHoverActions} />
                          {!!hoverContent &&
                            isExpandedOrHovered &&
                            hoverContent}
                        </Stack>
                      </a.div>
                    )}
                  </Stack>
                </Card>
              </div>
            </div>
          );
        }}
      </LocaleReceiver>
    );
  }
);

export const KanbanCard: React.ForwardRefExoticComponent<
  KanbanCardProps & React.RefAttributes<HTMLDivElement>
> = React.memo(InternalKanbanCard);
