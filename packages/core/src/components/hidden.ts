import { cx } from 'typestyles';
import { styles, typestyles } from '../runtime';

export type HiddenBreakpoint = 'sm' | 'md' | 'lg' | 'xl';
export type HiddenMap = Partial<Record<'base' | HiddenBreakpoint, boolean>>;

const HIDDEN_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const satisfies readonly HiddenBreakpoint[];
const layer = { layer: 'utilities' as const };

export function hiddenStyle(hide?: boolean | HiddenMap): Record<string, unknown> {
  if (hide === true) return { display: 'none' };
  if (hide === false || hide == null || Object.keys(hide).length === 0) {
    return { display: 'contents' };
  }
  const style: Record<string, unknown> = {};
  if ('base' in hide) {
    style.display = hide.base ? 'none' : 'contents';
  } else {
    style.display = 'contents';
  }
  for (const bp of HIDDEN_BREAKPOINTS) {
    if (bp in hide) {
      style[styles.breakpoint(bp, 'min')] = { display: hide[bp] ? 'none' : 'contents' };
    }
  }
  return style;
}

const hiddenAlways = typestyles.styles.class('hidden-always', { display: 'none' }, layer);
const hiddenBaseTrue = typestyles.styles.class('hidden-base-true', { display: 'none' }, layer);
const hiddenBaseFalse = typestyles.styles.class(
  'hidden-base-false',
  { display: 'contents' },
  layer,
);

const hiddenAt = {
  sm: {
    true: typestyles.styles.class(
      'hidden-sm-true',
      { [styles.breakpoint('sm', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.styles.class(
      'hidden-sm-false',
      { [styles.breakpoint('sm', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  md: {
    true: typestyles.styles.class(
      'hidden-md-true',
      { [styles.breakpoint('md', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.styles.class(
      'hidden-md-false',
      { [styles.breakpoint('md', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  lg: {
    true: typestyles.styles.class(
      'hidden-lg-true',
      { [styles.breakpoint('lg', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.styles.class(
      'hidden-lg-false',
      { [styles.breakpoint('lg', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  xl: {
    true: typestyles.styles.class(
      'hidden-xl-true',
      { [styles.breakpoint('xl', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.styles.class(
      'hidden-xl-false',
      { [styles.breakpoint('xl', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
} as const;

export function hiddenClassName(options: { hide?: boolean | HiddenMap } = {}): string {
  const hide = options.hide;
  if (hide === true) return hiddenAlways;
  if (
    hide === false ||
    hide == null ||
    (typeof hide === 'object' && Object.keys(hide).length === 0)
  ) {
    return hiddenBaseFalse;
  }
  const classes: string[] = [];
  if ('base' in hide) {
    classes.push(hide.base ? hiddenBaseTrue : hiddenBaseFalse);
  } else {
    classes.push(hiddenBaseFalse);
  }
  for (const bp of HIDDEN_BREAKPOINTS) {
    if (bp in hide) {
      classes.push(hide[bp] ? hiddenAt[bp].true : hiddenAt[bp].false);
    }
  }
  return cx(...classes);
}
