import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatComposer } from './chatComposer';

describe('chatComposer', () => {
  it('registers all slots', () => {
    chatComposer();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-chat-composer');
    expect(css).toContain('.var-ui-chat-composer__inputRow');
    expect(css).toContain('.var-ui-chat-composer__input');
    expect(css).toContain('.var-ui-chat-composer__actions');
  });
});
