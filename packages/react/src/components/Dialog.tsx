import type { JSX, ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { dialog } from '@var-ui/core';
import { Button } from './Button';

export type DialogProps = {
  triggerLabel: string;
  title: string;
  description: ReactNode;
  closeLabel?: string;
};

export function Dialog({
  triggerLabel,
  title,
  description,
  closeLabel = 'Close',
}: DialogProps): JSX.Element {
  const d = dialog();
  return (
    <DialogTrigger>
      <Button intent="secondary">{triggerLabel}</Button>
      <ModalOverlay className={d.overlay}>
        <Modal className={d.modal}>
          <AriaDialog>
            {({ close }) => (
              <div className={d.content}>
                <Heading slot="title" className={d.heading}>
                  {title}
                </Heading>
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
