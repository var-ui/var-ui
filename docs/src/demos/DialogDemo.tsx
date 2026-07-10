'use client';

import { dialog } from '@var-ui/core';
import { Button, HStack, Icon, Text, useLayer } from '@var-ui/react';
import { useState } from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';

export function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const d = dialog();
  const { style: layerStyle } = useLayer();

  return (
    <HStack gap="md" wrap align="center">
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button intent="secondary">Open dialog</Button>
        <ModalOverlay className={d.overlay} style={layerStyle}>
          <Modal className={d.modal}>
            <AriaDialog>
              {({ close }) => (
                <div className={d.content}>
                  <div className={d.header}>
                    <Heading slot="title" className={d.heading}>
                      Icon close button
                    </Heading>
                    <AriaButton className={d.closeButton} aria-label="Close" onPress={close}>
                      <Icon name="close" size="sm" />
                    </AriaButton>
                  </div>
                  <p className={d.description}>
                    The dismiss control now uses the registry close glyph.
                  </p>
                  <Button onPress={close}>Close</Button>
                </div>
              )}
            </AriaDialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
      <Text as="span" size="sm" tone="secondary">
        Dialog is {isOpen ? 'open' : 'closed'}
      </Text>
      {isOpen ? (
        <Button intent="ghost" onPress={() => setIsOpen(false)}>
          Close from outside
        </Button>
      ) : null}
    </HStack>
  );
}
