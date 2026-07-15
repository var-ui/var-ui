import type { JSX, ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { dialog } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';
import { Button } from './Button';

export type AlertDialogProps = {
  /** Dialog heading shown in the modal header. */
  title: string;
  /** Supporting copy below the heading. */
  description: ReactNode;
  /** Label for the dismiss action. @default Cancel */
  cancelLabel?: string;
  /** Label for the confirm action. @default Confirm */
  confirmLabel?: string;
  /** Renders the confirm action with `danger` intent and autofocuses Cancel. @default false */
  isDestructive?: boolean;
  /** Called when the confirm action is pressed. Never called on cancel or Escape dismissal. */
  onConfirm: () => void;
  /** Label on the button that opens the modal. If omitted, use `isOpen`/`onOpenChange` to control it. */
  triggerLabel?: string;
  /** Controls the open state. Required when `triggerLabel` is omitted. */
  isOpen?: boolean;
  /** Called when the open state changes (including Escape/cancel dismissal). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Element the modal portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

export function AlertDialog({
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  isDestructive = false,
  onConfirm,
  triggerLabel,
  isOpen,
  onOpenChange,
  portalContainer,
}: AlertDialogProps): JSX.Element {
  const d = dialog({ role: 'alertdialog' });
  const { style: layerStyle } = useLayer();

  const modal = (
    <Modal className={d.modal}>
      <AriaDialog role="alertdialog">
        {({ close }) => (
          <div className={d.content}>
            <div className={d.header}>
              <Heading slot="title" className={d.heading}>
                {title}
              </Heading>
            </div>
            <p className={d.description}>{description}</p>
            <div className={d.actions}>
              <Button intent="secondary" autoFocus={isDestructive} onPress={close}>
                {cancelLabel}
              </Button>
              <Button
                intent={isDestructive ? 'danger' : 'primary'}
                onPress={() => {
                  onConfirm();
                  close();
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        )}
      </AriaDialog>
    </Modal>
  );

  if (triggerLabel) {
    return (
      <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
        <Button intent="secondary">{triggerLabel}</Button>
        <ModalOverlay
          className={d.overlay}
          style={layerStyle}
          UNSTABLE_portalContainer={portalContainer}
        >
          {modal}
        </ModalOverlay>
      </DialogTrigger>
    );
  }

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={d.overlay}
      style={layerStyle}
      UNSTABLE_portalContainer={portalContainer}
    >
      {modal}
    </ModalOverlay>
  );
}
