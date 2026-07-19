import { checkbox } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cb = checkbox();
  const input = serializeHtmlTag(
    'input',
    { type: 'checkbox', style: 'position:absolute;width:1px;height:1px;opacity:0' },
    '',
  );
  const box = serializeHtmlTag('span', recipeProps(cb.box), '');
  const label = serializeHtmlTag('span', recipeProps(cb.label), 'Accept terms');
  return serializeHtmlTag('label', recipeProps(cb.root), `${input}${box}${label}`);
}
