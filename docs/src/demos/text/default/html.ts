import { textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'p',
    mergeProps(textBlock({ tone: 'secondary' })),
    'Body text with secondary tone.',
  );
}
