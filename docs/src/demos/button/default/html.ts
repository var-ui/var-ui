import { button } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const rp = recipeProps(button({}));
  return serializeHtmlTag('button', { type: 'button', ...rp }, 'Click me');
}
