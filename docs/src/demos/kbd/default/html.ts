import { kbd } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const key = (label: string) => serializeHtmlTag('kbd', mergeProps(kbd()), label);
  return `<span>Press ${key('⌘')} ${key('K')}</span>`;
}
