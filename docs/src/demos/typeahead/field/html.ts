import { combobox } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = combobox();
  const label = serializeHtmlTag(
    'label',
    { ...recipeProps(cb.label), for: 'fruit-typeahead-field' },
    'Fruit',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...recipeProps(cb.input),
      id: 'fruit-typeahead-field',
      type: 'text',
      placeholder: 'Search…',
      role: 'combobox',
      'aria-invalid': 'true',
    },
    '',
  );
  const wrapper = serializeHtmlTag('div', recipeProps(cb.inputWrapper), input);
  const description = serializeHtmlTag(
    'p',
    recipeProps(cb.description),
    'Start typing to filter the list.',
  );
  const error = serializeHtmlTag('p', recipeProps(cb.error), 'Choose a fruit to continue.');
  return serializeHtmlTag('div', recipeProps(cb.root), `${label}${wrapper}${description}${error}`);
}
