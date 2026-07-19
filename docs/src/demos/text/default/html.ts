import { textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'p',
    recipeProps(textBlock({ tone: 'secondary' })),
    'Body text with secondary tone.',
  );
}
