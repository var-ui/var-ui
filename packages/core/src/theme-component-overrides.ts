import { styles } from './runtime';
import { themeableComponents, type ThemeableComponentName } from './themeable-components';
import type { ExtendMap } from './create-theme-base';
import type { DesignTheme, DesignThemeTokens, ThemeComponentsConfig } from './types';

export function applyThemeComponentOverrides<
  E extends ExtendMap,
  const C extends ThemeComponentsConfig<DesignThemeTokens<E>>,
>(components: C, className: string, tokenRefs: DesignTheme<E>['tokens']): void {
  for (const name of Object.keys(components) as Array<keyof C>) {
    const entry = components[name];
    if (entry == null) continue;
    applyThemeComponentOverride(name as ThemeableComponentName, entry, className, tokenRefs);
  }
}

function applyThemeComponentOverride<E extends ExtendMap, K extends ThemeableComponentName>(
  name: K,
  entry: NonNullable<ThemeComponentsConfig<DesignThemeTokens<E>>[K]>,
  className: string,
  tokenRefs: DesignTheme<E>['tokens'],
): void {
  const overrideConfig: unknown = typeof entry === 'function' ? entry(tokenRefs) : entry;
  // Registry iteration cannot correlate `name`, recipe, and override config for overload resolution.
  styles.override(themeableComponents[name] as never, overrideConfig as never, {
    selectorPrefix: `.${className}`,
    layer: 'overrides',
  });
}
