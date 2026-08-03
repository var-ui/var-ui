import { button, stack, resolveButtonProps } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function buttonTag(label: string, options: Parameters<typeof resolveButtonProps>[0]): string {
  return serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button(resolveButtonProps(options))) },
    label,
  );
}

export function render(): string {
  const appearances = stack({
    direction: 'row',
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: 'wrap',
  });
  const tones = stack({
    direction: 'row',
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: 'wrap',
  });
  const root = stack({ direction: 'column', gap: 'md', align: 'stretch', justify: 'start' });

  const appearanceRow = serializeHtmlTag(
    'div',
    recipeProps(appearances),
    [
      buttonTag('Filled', { tone: 'accent', appearance: 'filled' }),
      buttonTag('Outline', { tone: 'accent', appearance: 'outline' }),
      buttonTag('Subtle', { tone: 'accent', appearance: 'subtle' }),
      buttonTag('Ghost', { tone: 'accent', appearance: 'ghost' }),
    ].join(''),
  );
  const toneRow = serializeHtmlTag(
    'div',
    recipeProps(tones),
    [
      buttonTag('Accent', { tone: 'accent', appearance: 'filled' }),
      buttonTag('Success', { tone: 'success', appearance: 'filled' }),
      buttonTag('Warning', { tone: 'warning', appearance: 'filled' }),
      buttonTag('Danger', { tone: 'danger', appearance: 'filled' }),
      buttonTag('Info', { tone: 'info', appearance: 'filled' }),
    ].join(''),
  );

  return serializeHtmlTag('div', recipeProps(root), `${appearanceRow}${toneRow}`);
}
