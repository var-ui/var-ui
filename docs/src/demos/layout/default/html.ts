import {
  layout,
  layoutContent,
  layoutHeader,
  layoutPanel,
  layoutShellPaddingAssignments,
  textBlock,
} from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function styleFromAssignments(assignments: Record<string, string>): string {
  return Object.entries(assignments)
    .map(([name, value]) => `${name}:${value}`)
    .join(';');
}

export function render(): string {
  const shell = layout({ height: 'auto' });
  const h = layoutHeader({});
  const header = serializeHtmlTag(
    'div',
    recipeProps(h.header),
    serializeHtmlTag('div', recipeProps(h.headerInner), 'Explorer'),
  );
  const pStart = layoutPanel({ hasDivider: true });
  const start = serializeHtmlTag(
    'div',
    { ...recipeProps(pStart.panel), 'data-side': 'start', style: 'width:180px' },
    'Nav',
  );
  const content = serializeHtmlTag(
    'div',
    recipeProps(layoutContent({ padding: 'inherit' }).content),
    serializeHtmlTag('p', recipeProps(textBlock({ size: 'sm' })), 'Main content'),
  );
  const pEnd = layoutPanel({ hasDivider: true });
  const end = serializeHtmlTag(
    'div',
    {
      ...recipeProps(pEnd.panel),
      'data-side': 'end',
      style: 'width:240px',
      role: 'complementary',
      'aria-label': 'Details',
    },
    'Inspector',
  );
  const middle = serializeHtmlTag('div', recipeProps(shell.middle), `${start}${content}${end}`);
  const inner = serializeHtmlTag('div', recipeProps(shell.inner), `${header}${middle}`);
  const outer = serializeHtmlTag('div', recipeProps(shell.outer), inner);
  return serializeHtmlTag(
    'div',
    {
      ...recipeProps(shell.root),
      style: styleFromAssignments(layoutShellPaddingAssignments(0)),
      'data-has-header': '',
      'data-has-start': '',
      'data-has-end': '',
    },
    outer,
  );
}
