import { avatar, statusDot } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const a = avatar({ size: 'md' });
  const initials = serializeHtmlTag(
    'span',
    { ...mergeProps(a.initials), role: 'img', 'aria-label': 'Ada Lovelace' },
    'AL',
  );
  const status = serializeHtmlTag(
    'span',
    { ...mergeProps(a.status), 'data-avatar-status': true },
    serializeHtmlTag('span', mergeProps(statusDot({ tone: 'success' })), ''),
  );
  return serializeHtmlTag('span', mergeProps(a.root), `${initials}${status}`);
}
