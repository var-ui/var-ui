import { collapsible } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const c = collapsible({ variant: 'bordered' });
  const summary = serializeHtmlTag('summary', recipeProps(c.trigger), 'Install');
  const panel = serializeHtmlTag('div', recipeProps(c.panel), 'npm install @var-ui/core');
  return serializeHtmlTag('details', recipeProps(c.root), `${summary}${panel}`);
}
