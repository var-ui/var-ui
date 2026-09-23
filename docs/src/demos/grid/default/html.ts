import { card, grid } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function renderCard(title: string, body: string): string {
  const c = card();
  return serializeHtmlTag(
    'div',
    mergeProps(c.root),
    `${serializeHtmlTag('h3', mergeProps(c.title), title)}${serializeHtmlTag('div', mergeProps(c.body), body)}`,
  );
}

export function render(): string {
  const gridRp = mergeProps(grid({ columns: 'two', gap: 'md' }));
  return serializeHtmlTag(
    'div',
    gridRp,
    `${renderCard('Static card', 'Plain content surface.')}${renderCard('Another card', 'Second grid cell.')}`,
  );
}
