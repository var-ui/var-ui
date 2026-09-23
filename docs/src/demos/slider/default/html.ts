import { slider } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = slider();
  const value = 40;
  const label = serializeHtmlTag(
    'label',
    mergeProps(s.label),
    `${serializeHtmlTag('span', {}, 'Volume')}${serializeHtmlTag('span', mergeProps(s.output), String(value))}`,
  );
  const track = serializeHtmlTag(
    'div',
    mergeProps(s.track),
    serializeHtmlTag('div', { ...mergeProps(s.fill), style: `width: ${value}%` }, ''),
  );
  const thumb = serializeHtmlTag(
    'div',
    {
      ...mergeProps(s.thumb),
      role: 'slider',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': String(value),
      tabindex: '0',
      style: `top: 50%; left: ${value}%; transform: translate(-50%, -50%)`,
    },
    '',
  );
  const control = serializeHtmlTag('div', mergeProps(s.control), `${track}${thumb}`);
  return serializeHtmlTag(
    'div',
    { ...mergeProps(s.root), role: 'group', 'aria-label': 'Volume' },
    `${label}${control}`,
  );
}
