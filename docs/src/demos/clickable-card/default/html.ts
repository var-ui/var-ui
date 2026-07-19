import { card } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function classOf(result: string | { className: string }): string {
  return typeof result === 'string' ? result : result.className;
}

export function render(): string {
  const c = card();
  const title = serializeHtmlTag('span', recipeProps(c.linkTitle), 'Theming guide');
  const description = serializeHtmlTag(
    'p',
    recipeProps(c.linkDescription),
    'Override any token with plain CSS custom properties.',
  );
  const hint = serializeHtmlTag('span', recipeProps(c.linkHint), '5 min read');
  return serializeHtmlTag(
    'a',
    { href: '#', ...recipeProps(c.root, classOf(c.linkRoot)) },
    `${title}${description}${hint}`,
  );
}
