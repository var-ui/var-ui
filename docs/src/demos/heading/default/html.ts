import { heading } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag('h2', recipeProps(heading({ size: 'md' })), 'Section title');
}
