import { combobox } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = combobox();
  const label = serializeHtmlTag(
    'label',
    { ...recipeProps(cb.label), for: 'fruit-search' },
    'Favorite fruit',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...recipeProps(cb.input),
      id: 'fruit-search',
      type: 'text',
      placeholder: 'Search fruits…',
      role: 'combobox',
      'aria-autocomplete': 'list',
    },
    '',
  );
  const wrapper = serializeHtmlTag('div', recipeProps(cb.inputWrapper), input);
  return serializeHtmlTag('div', recipeProps(cb.root), `${label}${wrapper}`);
}
