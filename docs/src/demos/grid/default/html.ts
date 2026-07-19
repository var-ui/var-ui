import { card, grid } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function renderCard(title: string, body: string): string {
  const c = card();
  return serializeHtmlTag(
    'div',
    recipeProps(c.root),
    `${serializeHtmlTag('h3', recipeProps(c.title), title)}${serializeHtmlTag('div', recipeProps(c.body), body)}`,
  );
}

export function render(): string {
  const gridRp = recipeProps(grid({ columns: 'two', gap: 'md' }));
  return serializeHtmlTag(
    'div',
    gridRp,
    `${renderCard('Static card', 'Plain content surface.')}${renderCard('Another card', 'Second grid cell.')}`,
  );
}
