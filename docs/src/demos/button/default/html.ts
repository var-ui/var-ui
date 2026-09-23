import { button } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const rp = mergeProps(button({}));
  return serializeHtmlTag('button', { type: 'button', ...rp }, 'Click me');
}
