import React, { FC, Ref } from 'react';
import {
  BaseLinkButton,
  LinkButtonIconAlign,
  LinkButtonProps,
  LinkButtonShape,
  LinkButtonSize,
  LinkButtonTextAlign,
  LinkButtonType,
} from '..';
import { mergeClasses } from '../../../shared/utilities';

import styles from '../linkbutton.module.scss';

export const DefaultLinkButton: FC<LinkButtonProps> = React.forwardRef(
  (
    {
      alignIcon = LinkButtonIconAlign.Left,
      alignText = LinkButtonTextAlign.Center,
      allowDisabledFocus = false,
      ariaLabel,
      classNames,
      counter,
      disabled = false,
      disruptive = false,
      dropShadow = false,
      floatingLinkButtonProps,
      iconProps,
      linkButtonWidth,
      nudgeProps,
      onClick,
      role,
      shape = LinkButtonShape.Pill,
      size = LinkButtonSize.Medium,
      style,
      target,
      text,
      ...rest
    },
    ref: Ref<HTMLAnchorElement>
  ) => {
    const linkButtonClassNames: string = mergeClasses([
      classNames,
      styles.linkButton,
      styles.linkButtonDefault,
      { [styles.linkButtonDisruptive]: disruptive },
    ]);

    return (
      <BaseLinkButton
        {...rest}
        ref={ref}
        alignIcon={alignIcon}
        alignText={alignText}
        allowDisabledFocus={allowDisabledFocus}
        ariaLabel={ariaLabel}
        classNames={linkButtonClassNames}
        counter={counter}
        disabled={disabled}
        dropShadow={dropShadow}
        floatingLinkButtonProps={floatingLinkButtonProps}
        iconProps={iconProps}
        linkButtonWidth={linkButtonWidth}
        nudgeProps={nudgeProps}
        onClick={onClick}
        role={role}
        shape={shape}
        size={size}
        style={style}
        target={target}
        text={text}
        type={LinkButtonType.Default}
      />
    );
  }
);
