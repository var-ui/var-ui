import { alert } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const a = alert({ tone: 'info', appearance: 'subtle', contentGap: 'spaced' });
  const title = serializeHtmlTag('p', recipeProps(a.title), 'Registry icons');
  const content = serializeHtmlTag(
    'div',
    { ...recipeProps(a.content), 'data-alert-content': true },
    'Alerts pull their tone glyph from IconProvider automatically.',
  );
  const body = serializeHtmlTag('div', recipeProps(a.body), `${title}${content}`);
  return serializeHtmlTag(
    'div',
    {
      ...recipeProps(a.root),
      'data-alert': true,
      'data-alert-variant': 'info',
      'data-alert-appearance': 'subtle',
    },
    body,
  );
}
