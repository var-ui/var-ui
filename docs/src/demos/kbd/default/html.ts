import { kbd } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const key = (label: string) => serializeHtmlTag('kbd', recipeProps(kbd()), label);
  return `<span>Press ${key('⌘')} ${key('K')}</span>`;
}
