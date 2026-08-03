import type { SlotComponentFunction, SlotVariantDefinitions } from 'typestyles';
import { designTokens as t, typestyles } from '@var-ui/core';

const s = t.color.code;

/** Layout ancestor must include `codeHljsScope.root` so rules match `CodeBlock` output. */
const cb = '[data-codeblock]';

function scopeSelectorList(list: string): string {
  return list
    .split(',')
    .map((part) => `& ${cb} ${part.trim()}`)
    .join(', ');
}

/**
 * Maps `color.code` tokens to highlight.js class names for this docs site.
 *
 * Wire `--var-ui-color-code-*` to your own highlighter however it expects colors
 * (CSS selectors for hljs, a Shiki theme object, Prism plugin, etc.).
 *
 * Compose **`codeHljsScope.root`** on a page shell so selectors apply inside
 * `[data-codeblock]` wrappers.
 */
export const codeHljsScope: SlotComponentFunction<
  ['root'],
  SlotVariantDefinitions<'root'>
> = typestyles.styles.component(
  'docs-hljs',
  {
    slots: ['root'],
    root: {
      [`& ${cb} .hljs`]: {
        color: s.base.var,
        background: 'transparent',
        display: 'block',
        overflowX: 'auto',
      },
      [scopeSelectorList(
        '.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_',
      )]: {
        color: s.keyword.var,
      },
      [scopeSelectorList(
        '.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_',
      )]: {
        color: s.title.var,
      },
      [scopeSelectorList(
        '.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-variable,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id',
      )]: {
        color: s.attr.var,
      },
      [scopeSelectorList('.hljs-regexp,.hljs-string,.hljs-meta .hljs-string')]: {
        color: s.string.var,
      },
      [scopeSelectorList('.hljs-built_in,.hljs-symbol')]: {
        color: s.builtIn.var,
      },
      [scopeSelectorList('.hljs-comment,.hljs-code,.hljs-formula')]: {
        color: s.comment.var,
      },
      [scopeSelectorList('.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo')]: {
        color: s.name.var,
      },
      [scopeSelectorList('.hljs-subst')]: {
        color: s.base.var,
      },
      [scopeSelectorList('.hljs-section')]: {
        color: s.section.var,
        fontWeight: 'bold',
      },
      [scopeSelectorList('.hljs-bullet')]: {
        color: s.bullet.var,
      },
      [scopeSelectorList('.hljs-emphasis')]: {
        color: s.base.var,
        fontStyle: 'italic',
      },
      [scopeSelectorList('.hljs-strong')]: {
        color: s.base.var,
        fontWeight: 'bold',
      },
      [scopeSelectorList('.hljs-addition')]: {
        color: s.addition.var,
        backgroundColor: s.additionBackground.var,
      },
      [scopeSelectorList('.hljs-deletion')]: {
        color: s.deletion.var,
        backgroundColor: s.deletionBackground.var,
      },
    },
  },
  { layer: 'utilities' },
);
