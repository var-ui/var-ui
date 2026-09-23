import { combobox } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = combobox();
  const label = serializeHtmlTag(
    'label',
    { ...mergeProps(cb.label), for: 'fruit-field' },
    'Favorite fruit',
  );
  const input = serializeHtmlTag(
    'input',
    {
      ...mergeProps(cb.input),
      id: 'fruit-field',
      type: 'text',
      placeholder: 'Search fruits…',
      role: 'combobox',
      'aria-invalid': 'true',
    },
    '',
  );
  const wrapper = serializeHtmlTag('div', mergeProps(cb.inputWrapper), input);
  const description = serializeHtmlTag(
    'p',
    mergeProps(cb.description),
    'Pick a fruit from the list.',
  );
  const error = serializeHtmlTag('p', mergeProps(cb.error), 'Selection is required.');
  return serializeHtmlTag('div', mergeProps(cb.root), `${label}${wrapper}${description}${error}`);
}
