import { collapsible } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const c = collapsible({ variant: 'bordered' });
  const summary = serializeHtmlTag('summary', mergeProps(c.trigger), 'Install');
  const panel = serializeHtmlTag('div', mergeProps(c.panel), 'npm install @var-ui/core');
  return serializeHtmlTag('details', mergeProps(c.root), `${summary}${panel}`);
}
