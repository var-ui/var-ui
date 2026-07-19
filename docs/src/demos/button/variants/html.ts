import { button, stack } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const stackRp = recipeProps(
    stack({ direction: 'row', gap: 'sm', align: 'center', justify: 'start', wrap: 'wrap' }),
  );
  const primary = serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button({ intent: 'primary' })) },
    'Primary',
  );
  const secondary = serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button({ intent: 'secondary' })) },
    'Secondary',
  );
  const ghost = serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button({ intent: 'ghost' })) },
    'Ghost',
  );
  return serializeHtmlTag('div', stackRp, `${primary}${secondary}${ghost}`);
}
