import { badge } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag('span', mergeProps(badge({ tone: 'accent' })), 'Beta');
}
