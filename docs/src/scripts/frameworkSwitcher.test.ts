import { describe, expect, it } from 'vite-plus/test';
import { frameworkCookieWriteValue } from './frameworkSwitcher';
import { FRAMEWORK_COOKIE } from '../lib/framework';

describe('frameworkCookieWriteValue', () => {
  it('builds a cookie assignment for the chosen framework', () => {
    expect(frameworkCookieWriteValue('html')).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(frameworkCookieWriteValue('html')).toMatch(/Path=\//);
    expect(frameworkCookieWriteValue('html')).toMatch(/Max-Age=/);
  });
});
