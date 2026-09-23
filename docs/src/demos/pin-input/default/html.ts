import { pinInput } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const LENGTH = 4;
const VALUE = '1234';

export function render(): string {
  const p = pinInput();
  const label = serializeHtmlTag(
    'label',
    { ...mergeProps(p.label), id: 'pin-input-demo-label' },
    'Verification code',
  );
  const cells = Array.from({ length: LENGTH }, (_, index) => {
    const digit = VALUE[index] ?? '';
    const isLast = index === LENGTH - 1;
    return serializeHtmlTag(
      'input',
      {
        ...mergeProps(p.cell),
        type: 'text',
        inputmode: 'numeric',
        pattern: '[0-9]*',
        maxlength: '1',
        autocomplete: index === 0 ? 'one-time-code' : 'off',
        'aria-label': `Digit ${index + 1} of ${LENGTH}`,
        value: digit,
        ...(isLast ? { autofocus: true } : {}),
      },
      '',
    );
  }).join('');
  const group = serializeHtmlTag(
    'div',
    { ...mergeProps(p.group), role: 'group', 'aria-labelledby': 'pin-input-demo-label' },
    cells,
  );
  return serializeHtmlTag('div', mergeProps(p.root), `${label}${group}`);
}
