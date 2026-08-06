import { slider } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = slider();
  const value = 40;
  const label = serializeHtmlTag(
    'label',
    recipeProps(s.label),
    `${serializeHtmlTag('span', {}, 'Volume')}${serializeHtmlTag('span', recipeProps(s.output), String(value))}`,
  );
  const track = serializeHtmlTag(
    'div',
    recipeProps(s.track),
    serializeHtmlTag('div', { ...recipeProps(s.fill), style: `width: ${value}%` }, ''),
  );
  const thumb = serializeHtmlTag(
    'div',
    {
      ...recipeProps(s.thumb),
      role: 'slider',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': String(value),
      tabindex: '0',
      style: `top: 50%; left: ${value}%; transform: translate(-50%, -50%)`,
    },
    '',
  );
  const control = serializeHtmlTag('div', recipeProps(s.control), `${track}${thumb}`);
  return serializeHtmlTag(
    'div',
    { ...recipeProps(s.root), role: 'group', 'aria-label': 'Volume' },
    `${label}${control}`,
  );
}
