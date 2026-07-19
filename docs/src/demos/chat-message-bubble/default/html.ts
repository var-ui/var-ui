import { chatMessage, chatMessageBubble } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const m = chatMessage({ sender: 'assistant' });
  const first = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'first' });
  const last = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'last' });
  const name = serializeHtmlTag(
    'div',
    recipeProps(m.header),
    serializeHtmlTag('span', recipeProps(m.name), 'Navi'),
  );
  const bubbles = `${serializeHtmlTag('div', recipeProps(first.root), 'First part of a multi-part reply.')}${serializeHtmlTag('div', recipeProps(last.root), 'Second part.')}`;
  const content = serializeHtmlTag('div', recipeProps(m.content), `${name}${bubbles}`);
  return serializeHtmlTag('div', recipeProps(m.root), content);
}
