import { avatar, statusDot } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const a = avatar({ size: 'md' });
  const initials = serializeHtmlTag(
    'span',
    { ...recipeProps(a.initials), role: 'img', 'aria-label': 'Ada Lovelace' },
    'AL',
  );
  const status = serializeHtmlTag(
    'span',
    { ...recipeProps(a.status), 'data-avatar-status': true },
    serializeHtmlTag('span', recipeProps(statusDot({ tone: 'success' })), ''),
  );
  return serializeHtmlTag('span', recipeProps(a.root), `${initials}${status}`);
}
