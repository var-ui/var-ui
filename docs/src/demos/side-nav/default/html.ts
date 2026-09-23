import { sideNav } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = sideNav();
  return serializeHtmlTag(
    'nav',
    { ...mergeProps(s.root), 'aria-label': 'Side navigation', 'data-var-ui-side-nav': true },
    serializeHtmlTag('a', { ...mergeProps(s.item), href: '/', 'data-selected': true }, 'Dashboard'),
  );
}
