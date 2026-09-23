import { timeline } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

function renderItem(
  styles: ReturnType<typeof timeline>,
  title: string,
  timestamp: string,
  description: string,
  active = true,
): string {
  const bullet = serializeHtmlTag(
    'div',
    {
      ...mergeProps(styles.bullet),
      'data-active': active ? '' : undefined,
      'aria-hidden': 'true',
    },
    '',
  );
  const body = [
    serializeHtmlTag('div', mergeProps(styles.title), title),
    serializeHtmlTag('div', mergeProps(styles.timestamp), timestamp),
    serializeHtmlTag('div', mergeProps(styles.description), description),
  ].join('');
  const itemBody = serializeHtmlTag('div', mergeProps(styles.body), body);
  return serializeHtmlTag(
    'li',
    { ...mergeProps(styles.item), 'data-active': active ? '' : undefined },
    `${bullet}${itemBody}`,
  );
}

export function render(): string {
  const styles = timeline({ tone: 'accent' });
  const items = [
    renderItem(styles, 'Created', '2 hours ago', 'Issue opened', true),
    renderItem(styles, 'In review', '1 hour ago', 'Waiting on approval', true),
    renderItem(styles, 'Merged', 'Just now', 'PR #42', false),
  ].join('');
  return serializeHtmlTag('ol', mergeProps(styles.root), items);
}
