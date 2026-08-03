import { combobox } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = combobox();
  const label = serializeHtmlTag(
    'label',
    { ...recipeProps(cb.label), for: 'fruit-field' },
    'Favorite fruit',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...recipeProps(cb.input),
      id: 'fruit-field',
      type: 'text',
      placeholder: 'Search fruits…',
      role: 'combobox',
      'aria-invalid': 'true',
    },
    '',
  );
  const wrapper = serializeHtmlTag('div', recipeProps(cb.inputWrapper), input);
  const description = serializeHtmlTag(
    'p',
    recipeProps(cb.description),
    'Pick a fruit from the list.',
  );
  const error = serializeHtmlTag('p', recipeProps(cb.error), 'Selection is required.');
  return serializeHtmlTag('div', recipeProps(cb.root), `${label}${wrapper}${description}${error}`);
}
