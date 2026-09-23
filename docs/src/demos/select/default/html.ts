import { select } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
];

export function render(): string {
  const s = select();
  const label = serializeHtmlTag('label', { ...mergeProps(s.label), for: 'fruit' }, 'Fruit');
  const optionEls = [
    serializeHtmlTag('option', { value: '', disabled: true, selected: true }, 'Select…'),
    ...options.map((o) => serializeHtmlTag('option', { value: o.id }, o.label)),
  ].join('');
  const trigger = serializeHtmlTag('select', { ...mergeProps(s.trigger), id: 'fruit' }, optionEls);
  return serializeHtmlTag('div', mergeProps(s.root), `${label}${trigger}`);
}
