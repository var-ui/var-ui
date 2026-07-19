import { dialog } from '@var-ui/core';
import { Button, HStack, Icon, Text, recipeProps, useLayer } from '@var-ui/react';
import { useState } from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';

export default function Preview() {
  const [isOpen, setIsOpen] = useState(false);
  const d = dialog();
  const { style: layerStyle } = useLayer();

  return (
    <HStack gap="md" wrap align="center">
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button intent="secondary">Open dialog</Button>
        <ModalOverlay {...recipeProps(d.overlay)} style={layerStyle}>
          <Modal {...recipeProps(d.modal)}>
            <AriaDialog>
              {({ close }) => (
                <div {...recipeProps(d.content)}>
                  <div {...recipeProps(d.header)}>
                    <Heading slot="title" {...recipeProps(d.heading)}>
                      Icon close button
                    </Heading>
                    <AriaButton {...recipeProps(d.closeButton)} aria-label="Close" onPress={close}>
                      <Icon name="close" size="sm" />
                    </AriaButton>
                  </div>
                  <p {...recipeProps(d.description)}>
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
