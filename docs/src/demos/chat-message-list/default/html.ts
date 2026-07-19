import { chatMessage, chatMessageBubble, chatMessageList } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function message(sender: 'assistant' | 'user', text: string): string {
  const m = chatMessage({ sender });
  const bubble = chatMessageBubble({ sender, variant: 'filled', group: 'none' });
  const content = serializeHtmlTag(
    'div',
    recipeProps(m.content),
    serializeHtmlTag('div', recipeProps(bubble.root), text),
  );
  return serializeHtmlTag('div', recipeProps(m.root), content);
}

export function render(): string {
  const l = chatMessageList({ density: 'balanced' });
  const inner = serializeHtmlTag(
    'div',
    recipeProps(l.inner),
    `${message('assistant', 'Hello! How can I help?')}${message('user', 'What components ship in var-ui?')}`,
  );
  return serializeHtmlTag(
    'div',
    { ...recipeProps(l.root), role: 'log', 'aria-live': 'polite' },
    inner,
  );
}
