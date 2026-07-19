import { link } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag('a', { href: '#', ...recipeProps(link) }, 'Documentation');
}
