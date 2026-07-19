import { field } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const f = field();
  const label = serializeHtmlTag(
    'label',
    { ...recipeProps(f.label), for: 'custom-range' },
    'Custom control',
  );
  const input = serializeHtmlTag('input', { id: 'custom-range', type: 'range' }, '');
  const description = serializeHtmlTag(
    'p',
    recipeProps(f.description),
    'Any input composes the shared field chrome.',
  );
  return serializeHtmlTag('div', recipeProps(f.root), `${label}${input}${description}`);
}
