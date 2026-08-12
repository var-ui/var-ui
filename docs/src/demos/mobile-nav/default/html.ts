import { mobileNav } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = mobileNav();
  return serializeHtmlTag(
    'div',
    { 'data-var-ui-mobile-nav': true },
    serializeHtmlTag(
      'div',
      { ...recipeProps(s.overlay), 'data-var-ui-mobile-nav-overlay': true },
      '',
    ) +
      serializeHtmlTag(
        'div',
        {
          ...recipeProps(s.panel),
          'data-var-ui-mobile-nav-panel': true,
          role: 'dialog',
          'aria-label': 'Navigation',
        },
        'Menu',
      ),
  );
}
