import { hiddenClassName, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const hiddenRp = mergeProps(hiddenClassName({ hide: { md: true } }));
  const text = serializeHtmlTag('p', mergeProps(textBlock({})), 'Visible below md');
  return serializeHtmlTag('aside', hiddenRp, text);
}
