import { section, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = section();
  const title = serializeHtmlTag('h2', mergeProps(s.title), 'Example section');
  const body = serializeHtmlTag('p', mergeProps(textBlock({})), 'Section content goes here.');
  return serializeHtmlTag('section', mergeProps(s.root), `${title}${body}`);
}
