import { describe, expect, it } from 'vite-plus/test';
import { FRAMEWORK_COOKIE, parseFrameworkCookie, readFrameworkFromCookieHeader } from './framework';

describe('parseFrameworkCookie', () => {
  it('defaults to react when missing or invalid', () => {
    expect(parseFrameworkCookie(undefined)).toBe('react');
    expect(parseFrameworkCookie('')).toBe('react');
    expect(parseFrameworkCookie('vue')).toBe('react');
  });

  it('accepts react, astro, html', () => {
    expect(parseFrameworkCookie('react')).toBe('react');
    expect(parseFrameworkCookie('astro')).toBe('astro');
    expect(parseFrameworkCookie('html')).toBe('html');
  });
});

describe('readFrameworkFromCookieHeader', () => {
  it('reads var-ui-framework from Cookie header', () => {
    expect(readFrameworkFromCookieHeader(`${FRAMEWORK_COOKIE}=astro; other=1`)).toBe('astro');
    expect(readFrameworkFromCookieHeader(null)).toBe('react');
  });
});
