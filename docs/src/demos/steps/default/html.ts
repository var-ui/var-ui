import { steps } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = steps();
  return serializeHtmlTag(
    'ol',
    recipeProps(s.root),
    '<li>Install package</li><li>Import styles</li><li>Render components</li>',
  );
}
