import type { JSX, ReactNode } from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { dialog } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { Button } from './Button';

export type DialogProps = {
  /** Label on the button that opens the modal. */
  triggerLabel: string;
  /** Dialog heading shown in the modal header. */
  title: string;
  /** Supporting copy below the heading. */
  description: ReactNode;
  /** Label for the close button and footer action. @default Close */
  closeLabel?: string;
  /**
   * Element the modal portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

export function Dialog({
  triggerLabel,
  title,
  description,
  closeLabel = 'Close',
  portalContainer,
}: DialogProps): JSX.Element {
  const d = dialog();
  const { style: layerStyle } = useLayer();
  return (
    <DialogTrigger>
      <Button intent="secondary">{triggerLabel}</Button>
      <ModalOverlay
        className={d.overlay}
        style={layerStyle}
        UNSTABLE_portalContainer={portalContainer}
      >
        <Modal className={d.modal}>
          <AriaDialog>
            {({ close }) => (
              <div className={d.content}>
                <div className={d.header}>
                  <Heading slot="title" className={d.heading}>
                    {title}
                  </Heading>
                  <AriaButton className={d.closeButton} aria-label={closeLabel} onPress={close}>
                    <Icon name="close" size="sm" />
                  </AriaButton>
                </div>
                <p className={d.description}>{description}</p>
                <Button onPress={close}>{closeLabel}</Button>
              </div>
            )}
          </AriaDialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
