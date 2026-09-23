import { steps } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = steps();
  return serializeHtmlTag(
    'ol',
    mergeProps(s.root),
    '<li>Install package</li><li>Import styles</li><li>Render components</li>',
  );
}
