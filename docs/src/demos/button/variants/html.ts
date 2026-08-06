import { button, stack, resolveButtonProps } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
const appearances = ['filled', 'outline', 'subtle', 'ghost'] as const;

function toneLabel(tone: (typeof tones)[number]) {
  return tone.charAt(0).toUpperCase() + tone.slice(1);
}

function buttonTag(label: string, options: Parameters<typeof resolveButtonProps>[0]): string {
  return serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button(resolveButtonProps(options))) },
    label,
  );
}

export function render(): string {
  const row = stack({
    direction: 'row',
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: 'wrap',
  });
  const root = stack({ direction: 'column', gap: 'lg', align: 'stretch', justify: 'start' });

  const rows = appearances
    .map((appearance) => {
      const buttons = tones
        .map((tone) => buttonTag(toneLabel(tone), { tone, appearance }))
        .join('');
      return serializeHtmlTag('div', recipeProps(row), buttons);
    })
    .join('');

  return serializeHtmlTag('div', recipeProps(root), rows);
}
