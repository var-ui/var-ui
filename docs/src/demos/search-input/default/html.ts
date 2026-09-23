import { searchInput } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = searchInput({ variant: 'default', size: 'md' });
  return serializeHtmlTag(
    'div',
    { ...mergeProps(s.root), 'data-var-ui-search-input': true, 'data-variant': 'default' },
    serializeHtmlTag('span', { ...mergeProps(s.icon), 'aria-hidden': true }, '') +
      serializeHtmlTag(
        'input',
        {
          ...mergeProps(s.input),
          type: 'search',
          placeholder: 'Search…',
          'aria-label': 'Search',
        },
        '',
      ),
  );
}
