import { combobox } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = combobox();
  const label = serializeHtmlTag(
    'label',
    { ...mergeProps(cb.label), for: 'fruit-typeahead-field' },
    'Fruit',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...mergeProps(cb.input),
      id: 'fruit-typeahead-field',
      type: 'text',
      placeholder: 'Search…',
      role: 'combobox',
      'aria-invalid': 'true',
    },
    '',
  );
  const wrapper = serializeHtmlTag('div', mergeProps(cb.inputWrapper), input);
  const description = serializeHtmlTag(
    'p',
    mergeProps(cb.description),
    'Start typing to filter the list.',
  );
  const error = serializeHtmlTag('p', mergeProps(cb.error), 'Choose a fruit to continue.');
  return serializeHtmlTag('div', mergeProps(cb.root), `${label}${wrapper}${description}${error}`);
}
