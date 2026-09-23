import { appShell } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const s = appShell({ height: 'fill', variant: 'elevated', contentPadding: '0' });
  return serializeHtmlTag(
    'div',
    {
      style:
        'height: 220px; border: 1px solid var(--var-ui-color-border-subtle); border-radius: 8px; overflow: hidden;',
    },
    serializeHtmlTag(
      'div',
      { ...mergeProps(s.root), 'data-var-ui-app-shell': true },
      serializeHtmlTag(
        'div',
        mergeProps(s.frame),
        serializeHtmlTag(
          'main',
          { ...mergeProps(s.main), id: 'var-ui-app-shell-main' },
          'Main content',
        ),
      ),
    ),
  );
}
