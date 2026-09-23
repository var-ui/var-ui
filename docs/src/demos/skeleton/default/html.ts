import { skeleton } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'div',
    {
      ...mergeProps(skeleton({ shape: 'text' })),
      'aria-hidden': true,
      style: 'width: 120px; height: 16px;',
    },
    '',
  );
}
