import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatToolCalls } from './chatToolCalls';

describe('chatToolCalls', () => {
  it('registers slots and status/expanded variants', () => {
    chatToolCalls({ status: 'running', expanded: 'true' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-tool-calls-root');
    expect(css).toContain('var-ui-chat-tool-calls-header');
    expect(css).toContain('var-ui-chat-tool-calls-statusIcon-status-running');
    expect(css).toContain('var-ui-chat-tool-calls-chevron-expanded-true');
  });
});
