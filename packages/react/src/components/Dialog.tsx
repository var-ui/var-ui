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
  const { style: layerStyle } = useLayer();
  return (
    <DialogTrigger>
      <Button intent="secondary">{triggerLabel}</Button>
      <ModalOverlay className={d.overlay} style={layerStyle}>
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
