import { resizeHandle } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = resizeHandle();
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(s.root),
      'data-var-ui-side-nav-resize': true,
      'aria-label': 'Resize sidebar',
    },
    serializeHtmlTag('div', mergeProps(s.pill), ''),
  );
}
