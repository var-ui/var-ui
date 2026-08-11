import { chip } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const c = chip({ tone: 'accent', appearance: 'subtle' });
  const label = serializeHtmlTag('span', recipeProps(c.label), 'React');
  return serializeHtmlTag('span', recipeProps(c.root), label);
}
