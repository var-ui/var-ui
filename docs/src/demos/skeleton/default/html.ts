import { skeleton } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'div',
    {
      ...recipeProps(skeleton({ shape: 'text' })),
      'aria-hidden': true,
      style: 'width: 120px; height: 16px;',
    },
    '',
  );
}
