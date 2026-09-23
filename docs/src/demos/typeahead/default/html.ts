import { combobox } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = combobox();
  const label = serializeHtmlTag(
    'label',
    { ...mergeProps(cb.label), for: 'fruit-typeahead' },
    'Fruit',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...mergeProps(cb.input),
      id: 'fruit-typeahead',
      type: 'text',
      placeholder: 'Search…',
      role: 'combobox',
      'aria-autocomplete': 'list',
    },
    '',
  );
  const wrapper = serializeHtmlTag('div', mergeProps(cb.inputWrapper), input);
  return serializeHtmlTag('div', mergeProps(cb.root), `${label}${wrapper}`);
}
