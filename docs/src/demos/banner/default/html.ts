import { banner } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const b = banner({ tone: 'success', appearance: 'solid' });
  const content = serializeHtmlTag(
    'div',
    recipeProps(b.content),
    serializeHtmlTag('span', {}, 'Deploy finished in 42s.'),
  );
  return serializeHtmlTag(
    'div',
    { ...recipeProps(b.root), 'data-banner': true, role: 'status' },
    content,
  );
}
