import { textAreaField } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const taf = textAreaField();
  const label = serializeHtmlTag('label', { ...mergeProps(taf.label), for: 'notes' }, 'Notes');
  const input = serializeHtmlTag(
    'textarea',
    { ...mergeProps(taf.input), id: 'notes', placeholder: 'Add a note…' },
    '',
  );
  return serializeHtmlTag('div', mergeProps(taf.root), `${label}${input}`);
}
