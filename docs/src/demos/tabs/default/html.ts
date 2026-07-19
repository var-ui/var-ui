import { tabs, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const panels = [
  { id: 'overview', label: 'Overview', content: 'First panel content.', selected: true },
  { id: 'details', label: 'Details', content: 'Second panel content.', selected: false },
];

export function render(): string {
  const t = tabs();
  const tabButtons = panels
    .map((panel) =>
      serializeHtmlTag(
        'button',
        {
          type: 'button',
          role: 'tab',
          id: `tab-${panel.id}`,
          'aria-controls': `panel-${panel.id}`,
          'aria-selected': panel.selected ? 'true' : 'false',
          tabindex: panel.selected ? '0' : '-1',
          ...(panel.selected ? { 'data-selected': true } : {}),
          ...recipeProps(t.tab),
        },
        panel.label,
      ),
    )
    .join('');
  const list = serializeHtmlTag('div', { role: 'tablist', ...recipeProps(t.list) }, tabButtons);
  const tabPanels = panels
    .map((panel) => {
      const body = serializeHtmlTag('p', recipeProps(textBlock({})), panel.content);
      return serializeHtmlTag(
        'div',
        {
          role: 'tabpanel',
          id: `panel-${panel.id}`,
          'aria-labelledby': `tab-${panel.id}`,
          ...(panel.selected ? {} : { hidden: true }),
          ...recipeProps(t.panel),
        },
        body,
      );
    })
    .join('');
  return serializeHtmlTag(
    'div',
    { 'data-var-ui-tabs': true, ...recipeProps(t.root) },
    `${list}${tabPanels}`,
  );
}
