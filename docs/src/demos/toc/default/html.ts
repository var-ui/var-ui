import { toc } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = toc();
  const item = (label: string, href: string, selected = false) =>
    serializeHtmlTag(
      'li',
      mergeProps(s.item),
      serializeHtmlTag(
        'a',
        {
          ...mergeProps(s.link),
          href,
          ...(selected ? { 'data-selected': true, 'aria-current': 'location' } : {}),
        },
        label,
      ),
    );
  return serializeHtmlTag(
    'nav',
    { ...mergeProps(s.root), 'aria-label': 'On this page' },
    serializeHtmlTag('p', mergeProps(s.title), 'On this page') +
      serializeHtmlTag(
        'ol',
        mergeProps(s.list),
        item('Examples', '#examples', true) + item('Props', '#props'),
      ),
  );
}
