import { accordionGroup, collapsible } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function renderItem(id: string, title: string, body: string): string {
  const c = collapsible({ variant: 'accordion' });
  const summary = serializeHtmlTag('summary', recipeProps(c.trigger), title);
  const panel = serializeHtmlTag('div', recipeProps(c.panel), body);
  return serializeHtmlTag('details', { ...recipeProps(c.root), id }, `${summary}${panel}`);
}

export function render(): string {
  const group = accordionGroup({ variant: 'bordered' });
  const items = [
    renderItem('billing', 'Billing', 'Update payment method and view invoices.'),
    renderItem('shipping', 'Shipping', 'Manage delivery addresses and preferences.'),
  ].join('');
  return serializeHtmlTag('div', recipeProps(group.root), items);
}
