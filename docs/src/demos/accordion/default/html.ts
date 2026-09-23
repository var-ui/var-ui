import { accordionGroup, collapsible } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function renderItem(id: string, title: string, body: string): string {
  const c = collapsible({ variant: 'accordion' });
  const summary = serializeHtmlTag('summary', mergeProps(c.trigger), title);
  const panel = serializeHtmlTag('div', mergeProps(c.panel), body);
  return serializeHtmlTag('details', { ...mergeProps(c.root), id }, `${summary}${panel}`);
}

export function render(): string {
  const group = accordionGroup({ variant: 'bordered' });
  const items = [
    renderItem('billing', 'Billing', 'Update payment method and view invoices.'),
    renderItem('shipping', 'Shipping', 'Manage delivery addresses and preferences.'),
  ].join('');
  return serializeHtmlTag('div', mergeProps(group.root), items);
}
