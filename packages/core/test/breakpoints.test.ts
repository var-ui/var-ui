import { describe, expect, it } from 'vite-plus/test';
import { appShellMobileBreakpointQueries } from '../src/breakpoints';

describe('appShellMobileBreakpointQueries', () => {
  it('derives max-width matchMedia conditions from TypeStyles breakpoints', () => {
    expect(appShellMobileBreakpointQueries).toEqual({
      sm: '(max-width: 640px)',
      md: '(max-width: 768px)',
      lg: '(max-width: 1024px)',
      none: 'not all',
    });
  });
});
