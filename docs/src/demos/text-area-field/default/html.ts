import { textAreaField } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const taf = textAreaField();
  const label = serializeHtmlTag('label', { ...recipeProps(taf.label), for: 'notes' }, 'Notes');
  const input = serializeHtmlTag(
    'textarea',
    { ...recipeProps(taf.input), id: 'notes', placeholder: 'Add a note…' },
    '',
  );
  return serializeHtmlTag('div', recipeProps(taf.root), `${label}${input}`);
}
