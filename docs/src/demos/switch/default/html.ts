import { switchStyles } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const sw = switchStyles();
  const input = serializeHtmlTag(
    'input',
    {
      type: 'checkbox',
      role: 'switch',
      style: 'position:absolute;width:1px;height:1px;opacity:0',
    },
    '',
  );
  const thumb = serializeHtmlTag('span', recipeProps(sw.thumb), '');
  const track = serializeHtmlTag('span', recipeProps(sw.track), thumb);
  const label = serializeHtmlTag('span', recipeProps(sw.label), 'Enable notifications');
  return serializeHtmlTag('label', recipeProps(sw.root), `${input}${track}${label}`);
}
