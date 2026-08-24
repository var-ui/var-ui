import { breadcrumbs, sideNav, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = sideNav();
  const b = breadcrumbs();
  const heading = serializeHtmlTag('div', recipeProps(s.heading), 'Docs');
  const stickyTop = serializeHtmlTag('div', recipeProps(s.stickyTop), heading);
  const overview = serializeHtmlTag(
    'a',
    { ...recipeProps(s.item), href: '#overview', 'data-selected': true },
    serializeHtmlTag('span', recipeProps(s.itemLabel), 'Overview'),
  );
  const hidden = serializeHtmlTag(
    'a',
    { ...recipeProps(s.item), href: '#hidden' },
    serializeHtmlTag('span', recipeProps(s.itemLabel), 'Hidden'),
  );
  const section = serializeHtmlTag(
    'div',
    recipeProps(s.section),
    serializeHtmlTag('div', recipeProps(s.sectionTitle), 'Main') + overview + hidden,
  );
  const nav = serializeHtmlTag(
    'nav',
    { ...recipeProps(s.root), 'aria-label': 'Side navigation', 'data-var-ui-side-nav': true },
    stickyTop + serializeHtmlTag('div', recipeProps(s.scrollable), section),
  );
  const chrome = serializeHtmlTag(
    'div',
    {
      style:
        'height: 280px; width: 240px; border: 1px solid var(--var-ui-color-border-subtle); border-radius: 8px; overflow: hidden;',
    },
    nav,
  );
  const items = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'here', label: 'Current' },
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
  const crumbs = serializeHtmlTag(
    'nav',
    { ...recipeProps(b.root), 'aria-label': 'Breadcrumb' },
    serializeHtmlTag('ol', recipeProps(b.list), lis),
  );
  const text = serializeHtmlTag('p', recipeProps(textBlock({})), 'dir=rtl island');
  return serializeHtmlTag('div', { dir: 'rtl' }, chrome + crumbs + text);
}
