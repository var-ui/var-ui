import { hiddenClassName, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const hiddenRp = recipeProps(hiddenClassName({ hide: { base: true, md: false } }));
  const text = serializeHtmlTag('p', recipeProps(textBlock({})), 'Visible from md');
  return serializeHtmlTag('aside', hiddenRp, text);
}
