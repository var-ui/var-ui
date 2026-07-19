import { divider, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const above = serializeHtmlTag('p', recipeProps(textBlock({})), 'Above');
  const rule = serializeHtmlTag('hr', recipeProps(divider({})), '');
  const below = serializeHtmlTag('p', recipeProps(textBlock({})), 'Below');
  return `${above}${rule}${below}`;
}
