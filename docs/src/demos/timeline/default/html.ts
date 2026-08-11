import { timeline } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
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
      ...recipeProps(styles.bullet),
      'data-active': active ? '' : undefined,
      'aria-hidden': 'true',
    },
    '',
  );
  const body = [
    serializeHtmlTag('div', recipeProps(styles.title), title),
    serializeHtmlTag('div', recipeProps(styles.timestamp), timestamp),
    serializeHtmlTag('div', recipeProps(styles.description), description),
  ].join('');
  const itemBody = serializeHtmlTag('div', recipeProps(styles.body), body);
  return serializeHtmlTag(
    'li',
    { ...recipeProps(styles.item), 'data-active': active ? '' : undefined },
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
  return serializeHtmlTag('ol', recipeProps(styles.root), items);
}
