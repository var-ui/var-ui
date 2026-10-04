import { spinner, visuallyHidden } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = spinner({});
  const ring = serializeHtmlTag('span', { ...mergeProps(s.indicator), 'aria-hidden': 'true' }, '');
  const label = serializeHtmlTag('span', mergeProps(visuallyHidden()), 'Loading results');
  return serializeHtmlTag('span', { role: 'status' }, `${ring}${label}`);
}
