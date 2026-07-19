import { card } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const c = card();
  const title = serializeHtmlTag('h3', recipeProps(c.title), 'Static card');
  const body = serializeHtmlTag('div', recipeProps(c.body), 'Plain content surface.');
  return serializeHtmlTag('div', recipeProps(c.root), `${title}${body}`);
}
