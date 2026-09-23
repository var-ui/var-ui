import { topNav } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = topNav();
  const item = (label: string, href: string, selected = false) =>
    serializeHtmlTag(
      'a',
      {
        ...mergeProps(s.item),
        href,
        ...(selected ? { 'data-selected': true, 'aria-current': 'page' } : {}),
      },
      label,
    );
  return serializeHtmlTag(
    'nav',
    { ...mergeProps(s.root), 'aria-label': 'Top navigation' },
    serializeHtmlTag(
      'div',
      mergeProps(s.start),
      item('Home', '/', true) + item('Docs', '/docs') + item('Blog', '/blog'),
    ),
  );
}
