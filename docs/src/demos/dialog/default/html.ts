import { button, dialog } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const closeIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';

export function render(): string {
  const d = dialog();
  const trigger = serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button({ intent: 'secondary' })), disabled: true },
    'Open dialog',
  );
  const heading = serializeHtmlTag(
    'h2',
    { id: 'dialog-demo-title', ...recipeProps(d.heading) },
    'Icon close button',
  );
  const closeBtn = serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(d.closeButton), 'aria-label': 'Close', disabled: true },
    closeIcon,
  );
  const header = serializeHtmlTag('div', recipeProps(d.header), `${heading}${closeBtn}`);
  const description = serializeHtmlTag(
    'p',
    recipeProps(d.description),
    'The dismiss control now uses the registry close glyph.',
  );
  const closeAction = serializeHtmlTag(
    'button',
    { type: 'button', ...recipeProps(button({})), disabled: true },
    'Close',
  );
  const content = serializeHtmlTag(
    'div',
    recipeProps(d.content),
    `${header}${description}${closeAction}`,
  );
  const modal = serializeHtmlTag(
    'div',
    {
      ...recipeProps(d.modal),
      role: 'dialog',
      'aria-labelledby': 'dialog-demo-title',
      'aria-modal': 'true',
    },
    content,
  );
  const overlay = serializeHtmlTag(
    'div',
    {
      ...recipeProps(d.overlay),
      style: 'position: relative; inset: auto; min-height: 220px',
    },
    modal,
  );
  return `<div style="display: grid; gap: 1rem">${trigger}${overlay}</div>`;
}
