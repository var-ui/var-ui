import { spinner } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const visuallyHiddenStyle =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0';

export function render(): string {
  const ring = serializeHtmlTag('span', { ...recipeProps(spinner({})), 'aria-hidden': 'true' }, '');
  const label = serializeHtmlTag('span', { style: visuallyHiddenStyle }, 'Loading results');
  return serializeHtmlTag('span', { role: 'status' }, `${ring}${label}`);
}
