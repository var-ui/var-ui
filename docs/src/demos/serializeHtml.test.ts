import { describe, expect, it } from 'vite-plus/test';
import { serializeHtmlTag } from './serializeHtml';

describe('serializeHtmlTag', () => {
  it('maps className to class and emits data attrs', () => {
    const html = serializeHtmlTag(
      'button',
      {
        type: 'button',
        className: 'var-ui-button',
        'data-intent': 'primary',
        disabled: true,
      },
      'Go',
    );
    expect(html).toBe(
      '<button type="button" class="var-ui-button" data-intent="primary" disabled>Go</button>',
    );
  });
});
