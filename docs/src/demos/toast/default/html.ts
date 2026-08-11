import { toast } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const t = toast({ tone: 'success', appearance: 'subtle' });
  const icon = serializeHtmlTag('span', recipeProps(t.icon), '');
  const title = serializeHtmlTag('div', recipeProps(t.title), 'Saved');
  const description = serializeHtmlTag('div', recipeProps(t.description), 'Your draft was stored.');
  const body = serializeHtmlTag('div', recipeProps(t.body), `${title}${description}`);
  return serializeHtmlTag('div', { ...recipeProps(t.item), role: 'status' }, `${icon}${body}`);
}
