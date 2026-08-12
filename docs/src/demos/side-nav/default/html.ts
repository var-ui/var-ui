import { sideNav } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = sideNav();
  return serializeHtmlTag(
    'nav',
    { ...recipeProps(s.root), 'aria-label': 'Side navigation', 'data-var-ui-side-nav': true },
    serializeHtmlTag(
      'a',
      { ...recipeProps(s.item), href: '/', 'data-selected': true },
      'Dashboard',
    ),
  );
}
