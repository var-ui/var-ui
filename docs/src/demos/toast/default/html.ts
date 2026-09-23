import { toast } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const t = toast({ tone: 'success', appearance: 'subtle' });
  const icon = serializeHtmlTag('span', mergeProps(t.icon), '');
  const title = serializeHtmlTag('div', mergeProps(t.title), 'Saved');
  const description = serializeHtmlTag('div', mergeProps(t.description), 'Your draft was stored.');
  const body = serializeHtmlTag('div', mergeProps(t.body), `${title}${description}`);
  return serializeHtmlTag('div', { ...mergeProps(t.item), role: 'status' }, `${icon}${body}`);
}
