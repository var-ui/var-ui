import { searchInput } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = searchInput({ variant: 'default', size: 'md' });
  return serializeHtmlTag(
    'div',
    { ...recipeProps(s.root), 'data-var-ui-search-input': true, 'data-variant': 'default' },
    serializeHtmlTag('span', { ...recipeProps(s.icon), 'aria-hidden': true }, '') +
      serializeHtmlTag(
        'input',
        {
          ...recipeProps(s.input),
          type: 'search',
          placeholder: 'Search…',
          'aria-label': 'Search',
        },
        '',
      ),
  );
}
