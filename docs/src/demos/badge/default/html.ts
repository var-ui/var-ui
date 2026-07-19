import { badge } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag('span', recipeProps(badge({ tone: 'accent' })), 'Beta');
}
