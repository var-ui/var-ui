import { combobox } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = combobox();
  const label = serializeHtmlTag(
    'label',
    { ...recipeProps(cb.label), for: 'fruit-typeahead' },
    'Fruit',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...recipeProps(cb.input),
      id: 'fruit-typeahead',
      type: 'text',
      placeholder: 'Search…',
      role: 'combobox',
      'aria-autocomplete': 'list',
    },
    '',
  );
  const wrapper = serializeHtmlTag('div', recipeProps(cb.inputWrapper), input);
  return serializeHtmlTag('div', recipeProps(cb.root), `${label}${wrapper}`);
}
