import { aspectRatio } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'div',
    {
      ...recipeProps(aspectRatio()),
      style:
        'background: var(--color-surface-muted); max-width: 320px; aspect-ratio: 1.7777777777777777',
    },
    '',
  );
}
