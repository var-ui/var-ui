import { chip } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const c = chip({ tone: 'accent', appearance: 'subtle' });
  const label = serializeHtmlTag('span', mergeProps(c.label), 'React');
  return serializeHtmlTag('span', mergeProps(c.root), label);
}
