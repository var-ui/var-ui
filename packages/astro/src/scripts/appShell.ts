/** `id` of the `<main>` landmark — target of the skip-to-content link. */
export const APP_SHELL_MAIN_ID = 'var-ui-app-shell-main';

const MOBILE_BREAKPOINT_QUERIES = {
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  none: 'not all',
} as const;

type MobileBreakpoint = keyof typeof MOBILE_BREAKPOINT_QUERIES;

export function initAppShell(root: HTMLElement): () => void {
  const breakpoint = (root.dataset.mobileBreakpoint ?? 'md') as MobileBreakpoint;
  const query = MOBILE_BREAKPOINT_QUERIES[breakpoint] ?? MOBILE_BREAKPOINT_QUERIES.md;
  const mql = window.matchMedia(query);

  const update = () => {
    if (mql.matches) {
      root.setAttribute('data-mobile', '');
    } else {
      root.removeAttribute('data-mobile');
    }
  };

  update();
  mql.addEventListener('change', update);
  return () => mql.removeEventListener('change', update);
}

export function initAppShells(): void {
  document.querySelectorAll('[data-var-ui-app-shell]').forEach((root) => {
    initAppShell(root as HTMLElement);
  });
}
