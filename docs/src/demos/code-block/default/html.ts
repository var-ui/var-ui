import { codeBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function classOf(result: string | { className: string }): string {
  return typeof result === 'string' ? result : result.className;
}

export function render(): string {
  const cb = codeBlock();
  const code = 'const greeting = "hello";';
  const language = serializeHtmlTag('span', recipeProps(cb.language), 'tsx');
  const title = serializeHtmlTag('div', recipeProps(cb.title), language);
  const header = serializeHtmlTag(
    'div',
    { ...recipeProps(cb.header), 'data-codeblock-header': true },
    title,
  );
  const codeEl = serializeHtmlTag('code', recipeProps(cb.code), code);
  const pre = serializeHtmlTag(
    'pre',
    {
      ...recipeProps(cb.pre, classOf(cb.preScrollX)),
      'data-codeblock-pre': true,
    },
    codeEl,
  );
  const body = serializeHtmlTag(
    'div',
    {
      ...recipeProps(cb.body, classOf(cb.bodyScrollable)),
      'data-codeblock-body': true,
    },
    pre,
  );
  return serializeHtmlTag(
    'div',
    {
      ...recipeProps(cb.root, classOf(cb.rootDefault)),
      'data-codeblock': true,
    },
    `${header}${body}`,
  );
}
