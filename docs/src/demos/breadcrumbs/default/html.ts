import { breadcrumbs } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const b = breadcrumbs();
  const items = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'docs', label: 'Docs', href: '/docs' },
    { id: 'current', label: 'Breadcrumbs' },
  ];
  const lastId = items[items.length - 1]?.id;
  const lis = items
    .map((item) => {
      const isCurrent = item.id === lastId;
      const link =
        item.href && !isCurrent
          ? serializeHtmlTag('a', { ...recipeProps(b.link), href: item.href }, item.label)
          : serializeHtmlTag('span', { ...recipeProps(b.link), 'data-disabled': true }, item.label);
      return serializeHtmlTag(
        'li',
        { ...recipeProps(b.item), ...(isCurrent ? { 'data-current': true } : {}) },
        link,
      );
    })
    .join('');
  return serializeHtmlTag(
    'nav',
    { ...recipeProps(b.root), 'aria-label': 'Breadcrumb' },
    serializeHtmlTag('ol', recipeProps(b.list), lis),
  );
}
