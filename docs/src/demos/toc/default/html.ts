import { toc } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = toc();
  const item = (label: string, href: string, selected = false) =>
    serializeHtmlTag(
      'li',
      recipeProps(s.item),
      serializeHtmlTag(
        'a',
        {
          ...recipeProps(s.link),
          href,
          ...(selected ? { 'data-selected': true, 'aria-current': 'location' } : {}),
        },
        label,
      ),
    );
  return serializeHtmlTag(
    'nav',
    { ...recipeProps(s.root), 'aria-label': 'On this page' },
    serializeHtmlTag('p', recipeProps(s.title), 'On this page') +
      serializeHtmlTag(
        'ol',
        recipeProps(s.list),
        item('Examples', '#examples', true) + item('Props', '#props'),
      ),
  );
}
