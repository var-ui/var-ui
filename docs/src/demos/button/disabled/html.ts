import { button, stack } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const stackRp = recipeProps(
    stack({ direction: 'row', gap: 'sm', align: 'center', justify: 'start', wrap: 'wrap' }),
  );
  const disabled = serializeHtmlTag(
    'button',
    { type: 'button', disabled: true, ...recipeProps(button({})) },
    'Disabled',
  );
  const disabledPrimary = serializeHtmlTag(
    'button',
    { type: 'button', disabled: true, ...recipeProps(button({ intent: 'primary' })) },
    'Disabled primary',
  );
  return serializeHtmlTag('div', stackRp, `${disabled}${disabledPrimary}`);
}
