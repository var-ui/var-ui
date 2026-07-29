import { styles } from './runtime';
import { designBreakpoints } from './tokens/defaults/breakpoint';

/** Breakpoint names used by `AppShell` for `data-mobile` / `matchMedia`. */
export type AppShellMobileBreakpointName = Exclude<keyof typeof designBreakpoints, 'xl'>;

/** `AppShell` `mobileBreakpoint` prop, including `'none'` to disable mobile layout. */
export type AppShellMobileBreakpoint = AppShellMobileBreakpointName | 'none';

const toMatchMediaQuery = (mediaKey: `@media ${string}`) => mediaKey.slice('@media '.length);

/** `matchMedia` conditions for `AppShell` mobile layout, derived from TypeStyles breakpoints. */
export const appShellMobileBreakpointQueries = {
  sm: toMatchMediaQuery(styles.breakpoint('sm', 'max')),
  md: toMatchMediaQuery(styles.breakpoint('md', 'max')),
  lg: toMatchMediaQuery(styles.breakpoint('lg', 'max')),
  none: 'not all',
} as const satisfies Record<AppShellMobileBreakpoint, string>;
