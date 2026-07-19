import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { dialog } from '@var-ui/core';
import { Button, HStack, Icon, Text, recipeProps, useLayer } from '@var-ui/react';

function ControlledDialog() {
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
    </HStack>
  );
}`,
  astro: `---
// No @var-ui/astro Dialog — static core-recipe chrome (open state, non-interactive).
// Full open/close interaction is React-only via react-aria-components.
import { button, dialog } from '@var-ui/core';

const d = dialog();
const trigger = button({ intent: 'secondary' });
const closeAction = button({});
---

<div style="display: grid; gap: 1rem">
  <button type="button" class:list={[trigger]} disabled>Open dialog</button>
  <div class:list={[d.overlay]} style="position: relative; inset: auto; min-height: 220px">
    <div class:list={[d.modal]} role="dialog" aria-labelledby="dialog-demo-title" aria-modal="true">
      <div class:list={[d.content]}>
        <div class:list={[d.header]}>
          <h2 id="dialog-demo-title" class:list={[d.heading]}>Icon close button</h2>
          <button type="button" class:list={[d.closeButton]} aria-label="Close" disabled>×</button>
        </div>
        <p class:list={[d.description]}>The dismiss control now uses the registry close glyph.</p>
        <button type="button" class:list={[closeAction]} disabled>Close</button>
      </div>
    </div>
  </div>
</div>`,
  html: `<div style="display: grid; gap: 1rem"><button type="button" data-intent="secondary" data-size="md" data-layout="default" class="var-ui-button" disabled>Open dialog</button><div data-role="dialog" class="var-ui-dialog__overlay" style="position: relative; inset: auto; min-height: 220px"><div data-role="dialog" class="var-ui-dialog__modal" role="dialog" aria-labelledby="dialog-demo-title" aria-modal="true"><div data-role="dialog" class="var-ui-dialog__content"><div data-role="dialog" class="var-ui-dialog__header"><h2 id="dialog-demo-title" data-role="dialog" class="var-ui-dialog__heading">Icon close button</h2><button type="button" data-role="dialog" class="var-ui-dialog__closeButton" aria-label="Close" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><p data-role="dialog" class="var-ui-dialog__description">The dismiss control now uses the registry close glyph.</p><button type="button" data-intent="secondary" data-size="md" data-layout="default" class="var-ui-button" disabled>Close</button></div></div></div></div>`,
} satisfies DemoSnippets;
