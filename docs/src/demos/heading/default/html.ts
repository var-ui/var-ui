import { heading } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag('h2', mergeProps(heading({ size: 'md' })), 'Section title');
}
