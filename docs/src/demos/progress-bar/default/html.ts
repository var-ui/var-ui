import { progressBar } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const p = progressBar({ tone: 'accent', indeterminate: 'false' });
  const header = serializeHtmlTag(
    'div',
    recipeProps(p.header),
    `${serializeHtmlTag('span', recipeProps(p.label), 'Uploading assets')}${serializeHtmlTag('span', recipeProps(p.valueText), '64%')}`,
  );
  const fill = serializeHtmlTag('div', { ...recipeProps(p.fill), style: 'width: 64%' }, '');
  const track = serializeHtmlTag('div', recipeProps(p.track), fill);
  return serializeHtmlTag(
    'div',
    {
      ...recipeProps(p.root),
      role: 'progressbar',
      'aria-label': 'Uploading assets',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '64',
    },
    `${header}${track}`,
  );
}
