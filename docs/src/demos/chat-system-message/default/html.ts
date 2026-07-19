import { chatSystemMessage } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function systemMessage(tone: 'info' | 'success', text: string): string {
  const s = chatSystemMessage({ tone });
  return serializeHtmlTag(
    'div',
    { ...recipeProps(s.root), role: 'status' },
    serializeHtmlTag('span', recipeProps(s.text), text),
  );
}

export function render(): string {
  return `${systemMessage('info', 'Model switched to GPT-5')}${systemMessage('success', 'Alex joined the conversation')}`;
}
