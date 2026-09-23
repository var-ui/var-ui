import { mobileNav } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = mobileNav();
  return serializeHtmlTag(
    'div',
    { 'data-var-ui-mobile-nav': true },
    serializeHtmlTag(
      'div',
      { ...mergeProps(s.overlay), 'data-var-ui-mobile-nav-overlay': true },
      '',
    ) +
      serializeHtmlTag(
        'div',
        {
          ...mergeProps(s.panel),
          'data-var-ui-mobile-nav-panel': true,
          role: 'dialog',
          'aria-label': 'Navigation',
        },
        'Menu',
      ),
  );
}
