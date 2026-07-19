import { grid, select } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
  { id: 'orange', label: 'Orange' },
  { id: 'grape', label: 'Grape' },
];

function renderSelect(id: string, label: string, placeholder: string): string {
  const s = select();
  const labelEl = serializeHtmlTag('label', { ...recipeProps(s.label), for: id }, label);
  const optionEls = [
    serializeHtmlTag('option', { value: '', disabled: true, selected: true }, placeholder),
    ...options.map((o) => serializeHtmlTag('option', { value: o.id }, o.label)),
  ].join('');
  const trigger = serializeHtmlTag('select', { ...recipeProps(s.trigger), id }, optionEls);
  return serializeHtmlTag('div', recipeProps(s.root), `${labelEl}${trigger}`);
}

export function render(): string {
  return serializeHtmlTag(
    'div',
    recipeProps(grid({ columns: 'two', gap: 'lg' })),
    `${renderSelect('fruit-options', 'Fruit', 'Select…')}${renderSelect('favorite-fruit', 'Favorite fruit', 'Choose a fruit…')}`,
  );
}
