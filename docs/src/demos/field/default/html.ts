import { field } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const f = field();
  const label = serializeHtmlTag(
    'label',
    { ...mergeProps(f.label), for: 'custom-range' },
    'Custom control',
  );
  const input = serializeHtmlTag('input', { id: 'custom-range', type: 'range' }, '');
  const description = serializeHtmlTag(
    'p',
    mergeProps(f.description),
    'Any input composes the shared field chrome.',
  );
  return serializeHtmlTag('div', mergeProps(f.root), `${label}${input}${description}`);
}
