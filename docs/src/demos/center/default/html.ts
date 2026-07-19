import { center, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const centerRp = recipeProps(center({ inline: 'false' }));
  const text = serializeHtmlTag('p', recipeProps(textBlock({})), 'Centered');
  return serializeHtmlTag(
    'div',
    { ...centerRp, style: 'height: 120px; border: 1px dashed var(--color-border)' },
    text,
  );
}
