import React, { FC, ReactNode, Ref, useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { a, useSpring } from '@react-spring/web';
import {
  SkillProps,
  SkillSize,
  SkillStatus,
  SkillVariant,
} from './Skill.types';
import { Button, ButtonShape, ButtonSize, ButtonVariant } from '../Button';
import { Dropdown, DropdownProps } from '../Dropdown';
import { Icon, IconName, IconSize } from '../Icon';
import { Menu, MenuItemTypes, MenuSize } from '../Menu';
import { Popup, PopupProps } from '../Popup';
import { Tooltip, TooltipProps } from '../Tooltip';
import { useMergedRefs } from '../../hooks/useMergedRefs';
import { usePreviousState } from '../../hooks/usePreviousState';
import { eventKeys, generateId, mergeClasses } from '../../shared/utilities';

import styles from './skill.module.scss';

export const Skill: FC<SkillProps> = React.forwardRef(
  (props: SkillProps, ref: Ref<HTMLDivElement>) => {
    const {
      allowDisabledFocus = false,
      animate = true,
      background,
      classNames,
      clickable = false,
      closable = false,
      closeButtonAriaLabel,
      closeButtonProps,
      color,
      content,
      contentClassNames,
      customButtonProps,
      disabled = false,
      dropdownProps,
      dropshadow = false,
      endorseButtonProps,
      expandable = false,
      expanded = false,
      expandedContent,
      expandedContentClassNames,
      height,
      highlightButtonProps,
      hoverable = false,
      iconProps,
      id,
      itemMenuAriaLabel,
      itemMenuButtonProps,
      key,
      label,
      lineClamp,
      menuItems,
      name,
      onBlur,
      onClick,
      onClose,
      onKeyDown,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      popupProps,
      readonly = false,
      role = 'button',
      size = SkillSize.Medium,
      status = SkillStatus.Default,
      style,
      tabIndex = 0,
      theme = 'white',
      title,
      tooltipProps,
      updateDimension,
      variant = SkillVariant.Tag,
      width,
      ...rest
    } = props;
    const [skillExpanded, setSkillExpanded] = useState<boolean>(false);
    const skillId: React.MutableRefObject<string> = useRef<string>(
      id || generateId()
    );

    const expandedSkillRef: React.MutableRefObject<HTMLDivElement> =
      useRef(null);
    const [containerRef, containerBounds] = useMeasure();
    const expandingSpringProps = useSpring({
      height: skillExpanded ? containerBounds.height : 0,
      immediate: !animate,
      opacity: skillExpanded ? 1 : 0,
    });

    const skillSizeToButtonSizeMap: Map<SkillSize, ButtonSize> = new Map<
      SkillSize,
      ButtonSize
    >([
      [SkillSize.Large, ButtonSize.Medium],
      [SkillSize.Medium, ButtonSize.Small],
      [SkillSize.Small, ButtonSize.Small],
      [SkillSize.XSmall, ButtonSize.Small],
    ]);

    const skillSizeToIconSizeMap: Map<SkillSize, IconSize> = new Map<
      SkillSize,
      IconSize
    >([
      [SkillSize.Large, IconSize.Medium],
      [SkillSize.Medium, IconSize.Small],
      [SkillSize.Small, IconSize.XSmall],
      [SkillSize.XSmall, IconSize.XSmall],
    ]);

    const skillStatusToIconNameMap: Map<SkillStatus, IconName> = new Map<
      SkillStatus,
      IconName
    >([
      [SkillStatus.Default, null],
      [SkillStatus.Highlight, IconName.mdiStar],
      [SkillStatus.Match, IconName.mdiCheck],
    ]);

    const blockLabelClassNames: string = mergeClasses([
      styles.label,
      styles.medium,
      { [styles.lineClamp]: lineClamp },
    ]);

    const tagLabelClassNames: string = mergeClasses([
      styles.label,
      { [styles.large]: size === SkillSize.Large },
      { [styles.medium]: size === SkillSize.Medium },
      { [styles.small]: size === SkillSize.Small },
      { [styles.xsmall]: size === SkillSize.XSmall },
      { [styles.lineClamp]: lineClamp },
    ]);

    const skillClassNames: string = mergeClasses([
      styles.skill,
      { [styles.animate]: !!animate },
      { [styles.block]: variant === SkillVariant.Block },
      { [styles.tag]: variant === SkillVariant.Tag },
      { [styles.clickable]: !!clickable },
      { [styles.hoverable]: !!hoverable },
      classNames,
      {
        [(styles as any)[theme]]:
          status !== SkillStatus.Highlight && status !== SkillStatus.Match,
      },
      { [styles.match]: status === SkillStatus.Match },
      { [styles.highlight]: status === SkillStatus.Highlight },
      { [styles.large]: size === SkillSize.Large },
      { [styles.medium]: size === SkillSize.Medium },
      { [styles.small]: size === SkillSize.Small },
      { [styles.xsmall]: size === SkillSize.XSmall },
      { [styles.disabled]: !!disabled },
      { [styles.readonly]: !!readonly },
    ]);

    const [skillWrapperRef, skillWrapperBounds] = useMeasure();
    const mergedRef: (node: HTMLDivElement) => void = useMergedRefs(
      skillWrapperRef,
      ref
    );
    const previousSkillWrapperBounds: DOMRectReadOnly =
      usePreviousState(skillWrapperBounds);

    useEffect((): void => {
      updateDimension?.(
        previousSkillWrapperBounds &&
          skillWrapperBounds.height === previousSkillWrapperBounds?.height
      );
    }, [skillWrapperBounds?.height, previousSkillWrapperBounds?.height]);

    useEffect((): void => {
      if (expandable && variant === SkillVariant.Block) {
        setSkillExpanded(expanded);
      } else {
        setSkillExpanded(false);
      }
    }, [expandable, expanded, variant]);

    useEffect((): void => {
      const skillElement: HTMLElement = document.getElementById(
        `${skillId?.current}`
      );
      if (expandable && variant === SkillVariant.Block) {
        skillElement.setAttribute('aria-expanded', `${skillExpanded}`);
      } else {
        if (
          !dropdownProps &&
          !popupProps &&
          skillElement.hasAttribute('aria-expanded')
        ) {
          skillElement.removeAttribute('aria-expanded');
        }
      }
    }, [expandable, skillExpanded, variant]);

    const getSkill = (children: ReactNode): ReactNode => (
      <div
        {...rest}
        className={skillClassNames}
        id={skillId.current}
        onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
          if (
            disabled ||
            readonly ||
            (variant !== SkillVariant.Block && size === SkillSize.XSmall)
          ) {
            return;
          }
          onBlur?.(e);
          if (
            hoverable &&
            variant === SkillVariant.Block &&
            !e.currentTarget.contains(e.relatedTarget)
          ) {
            setSkillExpanded(false);
          }
        }}
        onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
          if (
            disabled ||
            readonly ||
            (variant !== SkillVariant.Block && size === SkillSize.XSmall)
          ) {
            return;
          }
          onFocus?.(e);
          if (hoverable && variant === SkillVariant.Block) {
            setSkillExpanded(true);
          }
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (
            disabled ||
            readonly ||
            (variant !== SkillVariant.Block && size === SkillSize.XSmall)
          ) {
            return;
          }
          onKeyDown?.(e);
          if (
            clickable &&
            expandable &&
            (e.key === eventKeys.ENTER || e.key === eventKeys.SPACE)
          ) {
            if (e.key === eventKeys.SPACE) {
              e.preventDefault(); // Prevents page scroll
            }
            setSkillExpanded((value) => !value);
          }
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          if (
            disabled ||
            readonly ||
            (variant !== SkillVariant.Block && size === SkillSize.XSmall)
          ) {
            return;
          }
          onMouseEnter?.(e);
          if (hoverable && variant === SkillVariant.Block) {
            setSkillExpanded(true);
          }
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          if (
            disabled ||
            readonly ||
            (variant !== SkillVariant.Block && size === SkillSize.XSmall)
          ) {
            return;
          }
          onMouseLeave?.(e);
          if (hoverable && variant === SkillVariant.Block) {
            setSkillExpanded(false);
          }
        }}
        style={{ ...style, color, height, width }}
        tabIndex={tabIndex}
        title={title}
        ref={mergedRef}
      >
        <div
          className={styles.background}
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (
              readonly ||
              disabled ||
              !clickable ||
              (variant !== SkillVariant.Block && size === SkillSize.XSmall) ||
              e.target !== e.currentTarget
            ) {
              return;
            }
            onClick?.(e);
            if (expandable && variant === SkillVariant.Block) {
              setSkillExpanded((value) => !value);
            }
          }}
          style={{ background }}
        ></div>
        <div className={styles.content}>{children}</div>
        {variant === SkillVariant.Block && (
          <>
            {skillExpanded && <div className={styles.dividerExpandedSkill} />}
            {/* Expanding Skill */}
            {(hoverable || expandable) && (
              <a.div style={expandingSpringProps}>
                <div
                  ref={containerRef}
                  className={mergeClasses([
                    styles.expandedContent,
                    expandedContentClassNames,
                    {
                      [styles.expanded]: skillExpanded,
                    },
                  ])}
                >
                  <div ref={expandedSkillRef}>
                    {!!expandedContent && expandedContent}
                  </div>
                </div>
              </a.div>
            )}
          </>
        )}
      </div>
    );

    const getTag = (): ReactNode => (
      <>
        <div className={styles.blockStart}>
          {!!iconProps && status === SkillStatus.Default && (
            <Icon
              style={{ color }}
              {...iconProps}
              size={skillSizeToIconSizeMap.get(size)}
              classNames={styles.icon}
            />
          )}
          {status !== SkillStatus.Default && (
            <Icon
              classNames={styles.icon}
              path={skillStatusToIconNameMap.get(status)}
              size={skillSizeToIconSizeMap.get(size)}
              style={{ color }}
            />
          )}
          <span
            className={tagLabelClassNames}
            style={
              lineClamp ? { WebkitLineClamp: lineClamp, color } : { color }
            }
          >
            {label}
          </span>
        </div>
        {size !== SkillSize.Small &&
          size !== SkillSize.XSmall &&
          (!!endorseButtonProps || !!closable) && (
            <div className={styles.blockEnd}>
              <ul className={styles.buttonList}>
                {!!endorseButtonProps && (
                  <li key="endorsement-button">
                    <Button
                      iconProps={{
                        path: IconName.mdiThumbUpOutline,
                      }}
                      toggle
                      variant={ButtonVariant.Neutral}
                      {...endorseButtonProps}
                      onClick={
                        !disabled
                          ? (
                              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                            ) => {
                              e.stopPropagation();
                              endorseButtonProps?.onClick(e);
                            }
                          : null
                      }
                      shape={
                        parseInt(endorseButtonProps?.counter, 10) > 0
                          ? ButtonShape.Pill
                          : ButtonShape.Round
                      }
                      size={skillSizeToButtonSizeMap.get(size)}
                      classNames={styles.button}
                    />
                  </li>
                )}
                {!!closable && (
                  <li key="close-button">
                    <Button
                      ariaLabel={closeButtonAriaLabel}
                      iconProps={{ path: IconName.mdiClose }}
                      shape={ButtonShape.Round}
                      variant={ButtonVariant.Neutral}
                      {...closeButtonProps}
                      classNames={styles.button}
                      onClick={
                        !disabled
                          ? (
                              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                            ) => {
                              e.stopPropagation();
                              onClose?.(e);
                            }
                          : null
                      }
                      size={skillSizeToButtonSizeMap.get(size)}
                    />
                  </li>
                )}
              </ul>
            </div>
          )}
      </>
    );

    const getItemMenu = (items: MenuItemTypes[]): JSX.Element => {
      const getItems = (): MenuItemTypes[] => {
        return items?.map((item?: MenuItemTypes, idx?: number) => ({
          key: 'menuItem-' + idx,
          ...item,
        }));
      };

      return (
        <li key="button-menu">
          <Dropdown
            disabled={disabled}
            overlay={<Menu items={getItems()} size={MenuSize.small} />}
            portal
          >
            <Button
              ariaLabel={itemMenuAriaLabel}
              iconProps={{ path: IconName.mdiDotsVertical }}
              {...itemMenuButtonProps}
              classNames={styles.button}
              shape={ButtonShape.Round}
              size={ButtonSize.Small}
              variant={ButtonVariant.Neutral}
            />
          </Dropdown>
        </li>
      );
    };

    const getBlock = (): ReactNode => (
      <>
        <div className={styles.blockStart}>
          {!!iconProps && status === SkillStatus.Default && (
            <Icon
              style={{ color }}
              {...iconProps}
              classNames={styles.icon}
              size={IconSize.Small}
            />
          )}
          {status !== SkillStatus.Default && (
            <Icon
              classNames={styles.icon}
              path={skillStatusToIconNameMap.get(status)}
              size={IconSize.Small}
              style={{ color }}
            />
          )}
          <span
            className={blockLabelClassNames}
            style={
              lineClamp ? { WebkitLineClamp: lineClamp, color } : { color }
            }
          >
            {label}
          </span>
        </div>
        <div className={contentClassNames}>{content}</div>
        <div className={styles.blockEnd}>
          <ul className={styles.buttonList}>
            {!!endorseButtonProps && (
              <li key="endorsement-button">
                <Button
                  iconProps={{
                    path: IconName.mdiThumbUpOutline,
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                  }}
                  toggle
                  {...endorseButtonProps}
                  classNames={styles.button}
                  onClick={
                    !disabled
                      ? (
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          e.stopPropagation();
                          endorseButtonProps?.onClick(e);
                        }
                      : null
                  }
                  shape={
                    parseInt(endorseButtonProps?.counter, 10) > 0
                      ? ButtonShape.Pill
                      : ButtonShape.Round
                  }
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Neutral}
                />
              </li>
            )}
            {!!highlightButtonProps && (
              <li key="highlight-button">
                <Button
                  iconProps={{
                    path:
                      status === SkillStatus.Highlight
                        ? IconName.mdiStar
                        : IconName.mdiStarOutline,
                  }}
                  shape={ButtonShape.Round}
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                  }}
                  toggle
                  {...highlightButtonProps}
                  classNames={styles.button}
                  onClick={
                    !disabled
                      ? (
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          e.stopPropagation();
                          highlightButtonProps?.onClick(e);
                        }
                      : null
                  }
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Neutral}
                />
              </li>
            )}
            {!!customButtonProps && (
              <li key="custom-button">
                <Button
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                  }}
                  shape={ButtonShape.Round}
                  {...customButtonProps}
                  classNames={styles.button}
                  onClick={
                    !disabled
                      ? (
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          e.stopPropagation();
                          customButtonProps?.onClick(e);
                        }
                      : null
                  }
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Neutral}
                />
              </li>
            )}
            {!!menuItems && getItemMenu(menuItems)}
          </ul>
        </div>
      </>
    );

    const getDropdown = (props: DropdownProps): JSX.Element => (
      <Dropdown
        referenceWrapperClassNames={styles.dropdown}
        disabled={disabled || readonly || size === SkillSize.XSmall}
        key={`${key}-dropdown`}
        portal
        {...props}
      >
        {getSkill(getTag())}
      </Dropdown>
    );

    const getPopup = (props: PopupProps): JSX.Element => (
      <Popup
        disabled={disabled || readonly || size === SkillSize.XSmall}
        key={`${key}-popup`}
        portal
        {...props}
      >
        {getSkill(getTag())}
      </Popup>
    );

    const getTooltip = (props: TooltipProps): JSX.Element => (
      <Tooltip
        disabled={disabled || readonly || size === SkillSize.XSmall}
        key={`${key}-tooltip`}
        portal
        {...props}
      >
        {getSkill(getTag())}
      </Tooltip>
    );

    if (variant === SkillVariant.Tag) {
      return (
        <>
          {!dropdownProps && !popupProps && !tooltipProps && getSkill(getTag())}
          {!!dropdownProps && getDropdown(dropdownProps)}
          {!!popupProps && getPopup(popupProps)}
          {!!tooltipProps && getTooltip(tooltipProps)}
        </>
      );
    }

    return <>{getSkill(getBlock())}</>;
  }
);