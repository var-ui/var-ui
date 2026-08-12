import { resizeHandle } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = resizeHandle();
  return serializeHtmlTag(
    'div',
    {
      ...recipeProps(s.root),
      'data-var-ui-side-nav-resize': true,
      'aria-label': 'Resize sidebar',
    },
    serializeHtmlTag('div', recipeProps(s.pill), ''),
  );
}
