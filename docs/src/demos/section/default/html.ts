import { section, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = section();
  const title = serializeHtmlTag('h2', recipeProps(s.title), 'Example section');
  const body = serializeHtmlTag('p', recipeProps(textBlock({})), 'Section content goes here.');
  return serializeHtmlTag('section', recipeProps(s.root), `${title}${body}`);
}
