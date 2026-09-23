import { card } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const c = card();
  const title = serializeHtmlTag('h3', mergeProps(c.title), 'Static card');
  const body = serializeHtmlTag('div', mergeProps(c.body), 'Plain content surface.');
  return serializeHtmlTag('div', mergeProps(c.root), `${title}${body}`);
}
