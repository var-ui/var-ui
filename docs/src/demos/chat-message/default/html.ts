import { avatar, chatMessage, chatMessageBubble, stack, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const DEMO_ISO = '2026-07-19T21:35:00.000Z';
const DEMO_LABEL = '2:35 PM';
const DEMO_TITLE = 'Jul 19, 2026, 2:35 PM';

export function render(): string {
  const m = chatMessage({ sender: 'assistant' });
  const bubble = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'none' });
  const a = avatar({ size: 'sm' });
  const initials = serializeHtmlTag(
    'span',
    { ...recipeProps(a.initials), role: 'img', 'aria-label': 'Navi' },
    'N',
  );
  const avatarEl = serializeHtmlTag(
    'div',
    recipeProps(m.avatar),
    serializeHtmlTag('span', recipeProps(a.root), initials),
  );
  const name = serializeHtmlTag(
    'div',
    recipeProps(m.header),
    serializeHtmlTag('span', recipeProps(m.name), 'Navi'),
  );
  const bubbleEl = serializeHtmlTag('div', recipeProps(bubble.root), 'Hello! How can I help?');
  const time = serializeHtmlTag(
    'time',
    {
      ...recipeProps(textBlock({ size: 'sm', tone: 'secondary' })),
      datetime: DEMO_ISO,
      title: DEMO_TITLE,
    },
    DEMO_LABEL,
  );
  const metadata = serializeHtmlTag(
    'div',
    recipeProps(m.metadata),
    serializeHtmlTag(
      'div',
      recipeProps(
        stack({ direction: 'row', gap: 'xs', align: 'center', justify: 'start', wrap: 'nowrap' }),
      ),
      time,
    ),
  );
  const content = serializeHtmlTag('div', recipeProps(m.content), `${name}${bubbleEl}${metadata}`);
  return serializeHtmlTag('div', recipeProps(m.root), `${avatarEl}${content}`);
}
