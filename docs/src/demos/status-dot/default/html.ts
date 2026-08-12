import { statusDot } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'span',
    {
      ...recipeProps(statusDot({ tone: 'success', appearance: 'filled', pulse: 'false' })),
      role: 'img',
      'aria-label': 'Online',
    },
    '',
  );
}
