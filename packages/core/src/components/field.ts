import { styles } from '../runtime';
import { designTokens as t } from '../tokens';

export type FieldChromeColors = {
  label: string;
  description: string;
  error: string;
};

/**
 * Shared label/description/error declarations composed by every field-shaped
 * recipe (textField, textAreaField, select, and the standalone `field`).
 * Each recipe passes its own `c.vars()` refs so per-component theming keeps
 * working; class names stay per-recipe (public API is untouched).
 */
export function fieldChrome(colors: FieldChromeColors) {
  return {
    root: {
      display: 'grid',
      gap: t.space[1],
    },
    label: {
      fontSize: t.fontSize.md,
      fontWeight: t.fontWeight.medium,
      color: colors.label,
    },
    description: {
      fontSize: t.fontSize.sm,
      color: colors.description,
    },
    error: {
      fontSize: t.fontSize.sm,
      color: colors.error,
    },
  } as const;
}

/**
 * Standalone field chrome for custom inputs that aren't one of the built-in
 * field recipes — label, help text, and validation message around any control.
 *
 * ```tsx
 * const f = field();
 * <div className={f.root}>
 *   <label className={f.label}>Amount</label>
 *   <MyCustomInput />
 *   <p className={f.description}>Help text</p>
 * </div>
 * ```
 */
export const field = styles.component(
  'field',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: `${t.color.text.primary}`,
        syntax: '<color>',
        inherits: false,
      },
      descriptionColor: {
        value: `${t.color.text.secondary}`,
        syntax: '<color>',
        inherits: false,
      },
      errorColor: {
        value: `${t.color.danger.default}`,
        syntax: '<color>',
        inherits: false,
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: ['root', 'label', 'description', 'error'],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
    };
  },
  { layer: 'components' },
);
