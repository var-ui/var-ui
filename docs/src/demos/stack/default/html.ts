import { button, stack } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const stackRp = recipeProps(
    stack({ direction: 'row', gap: 'sm', align: 'center', justify: 'start', wrap: 'nowrap' }),
  );
  const cancel = serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button({ intent: 'secondary' })) },
    'Cancel',
  );
  const save = serializeHtmlTag('button', { type: 'button', ...recipeProps(button({})) }, 'Save');
  return serializeHtmlTag('div', stackRp, `${cancel}${save}`);
}
