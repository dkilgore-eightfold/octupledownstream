import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { DialogProps, DialogSize } from './Dialog.types';
import { Dialog } from './Dialog';
import { canUseDocElement, generateId } from '../../shared/utilities';

const uniqueId: string = generateId();

function createWrapperAndAppendToBody(wrapperId: string): HTMLDivElement {
  if (canUseDocElement()) {
    const existingElement = document.getElementById(
      wrapperId
    ) as HTMLDivElement;
    if (document.getElementById(wrapperId)) {
      return existingElement;
    }
    const wrapperElement = document.createElement('div');
    wrapperElement.setAttribute('id', wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
  }
  return null;
}

const $dialog = (props: DialogProps, containerId: string = uniqueId) => {
  const element: HTMLDivElement = createWrapperAndAppendToBody(
    containerId ?? uniqueId
  );
  render(
    <Dialog
      {...props}
      visible
      parent={element}
      onClose={(e) => {
        props?.onClose?.(e);
        unmountComponentAtNode(element);
      }}
    />,
    element
  );
};

export const DialogHelper = {
  show: $dialog,
  showSmall: (props: DialogProps, containerId: string = uniqueId) =>
    $dialog(
      {
        ...props,
        size: DialogSize.small,
      },
      containerId
    ),
  showMedium: (props: DialogProps, containerId: string = uniqueId) =>
    $dialog(
      {
        ...props,
        size: DialogSize.medium,
      },
      containerId
    ),
  close: (containerId: string = uniqueId) =>
    canUseDocElement()
      ? unmountComponentAtNode(document.getElementById(containerId))
      : null,
};
