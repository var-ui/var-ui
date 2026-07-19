import { textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

/** Stable demo values — relative label matches the React default demo intent. */
const DEMO_ISO = '2026-07-19T21:35:00.000Z';
const DEMO_LABEL = '5 minutes ago';
const DEMO_TITLE = 'Jul 19, 2026, 2:35 PM';

export function render(): string {
  return serializeHtmlTag(
    'time',
    {
      ...recipeProps(textBlock({ size: 'sm', tone: 'secondary' })),
      datetime: DEMO_ISO,
      title: DEMO_TITLE,
    },
    DEMO_LABEL,
  );
}
