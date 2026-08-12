import { topNav } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = topNav();
  const item = (label: string, href: string, selected = false) =>
    serializeHtmlTag(
      'a',
      {
        ...recipeProps(s.item),
        href,
        ...(selected ? { 'data-selected': true, 'aria-current': 'page' } : {}),
      },
      label,
    );
  return serializeHtmlTag(
    'nav',
    { ...recipeProps(s.root), 'aria-label': 'Top navigation' },
    serializeHtmlTag(
      'div',
      recipeProps(s.start),
      item('Home', '/', true) + item('Docs', '/docs') + item('Blog', '/blog'),
    ),
  );
}
