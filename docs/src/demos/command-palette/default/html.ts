import { commandPalette } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const cp = (commandPalette as unknown as () => Record<string, unknown>)();
  return serializeHtmlTag(
    'div',
    { id: 'docs-command-palette', 'data-var-ui-command-palette-root': true },
    serializeHtmlTag(
      'dialog',
      {
        ...(mergeProps(cp.root as never) as object),
        id: 'docs-command-palette-dialog',
        'aria-label': 'Search…',
      },
      'Command palette',
    ),
  );
}
