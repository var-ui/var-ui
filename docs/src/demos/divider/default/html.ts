import { divider, textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const above = serializeHtmlTag('p', mergeProps(textBlock({})), 'Above');
  const rule = serializeHtmlTag('hr', mergeProps(divider({})), '');
  const below = serializeHtmlTag('p', mergeProps(textBlock({})), 'Below');
  return `${above}${rule}${below}`;
}
