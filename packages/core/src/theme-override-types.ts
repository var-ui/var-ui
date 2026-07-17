import type {
  ComponentAttrsReturn,
  ComponentReturn,
  FlatComponentReturn,
  FlatOverrideConfig,
  OverrideConfig,
  SlotAttrsReturn,
  SlotComponentFunction,
  SlotOverrideConfig,
  SlotVariantDefinitions,
  VariantDefinitions,
  VariantOptionStyle,
} from 'typestyles';
import type { themeableComponents, ThemeableComponentName } from './themeable-components';

/**
 * Style leaf for theme `components` overrides — TypeStyles {@link VariantOptionStyle}
 * (CSS IntelliSense + custom-property / nested-selector assignability; typestyles@0.11.2+).
 */
export type ThemeOverrideStyle = VariantOptionStyle;

/** Dimensioned recipe override shape (attribute or class mode). */
export type ThemeOverrideConfig<V extends VariantDefinitions> = OverrideConfig<V>;

/** Slot recipe with variants. */
export type ThemeSlotOverrideConfig<
  Slots extends readonly string[],
  V extends SlotVariantDefinitions<Slots[number]>,
> = SlotOverrideConfig<Slots, V>;

/** Multi-slot recipe (no variants). Slot names are a string union. */
export type ThemeMultiSlotOverrideConfig<Slots extends string> = {
  base?: Partial<Record<Slots, ThemeOverrideStyle>>;
  variants?: never;
  compoundVariants?: never;
};

/** Flat (non-dimensioned) recipe. */
export type ThemeFlatOverrideConfig<K extends string> = FlatOverrideConfig<K>;

/**
 * Override config inferred from a recipe return, mirroring `styles.override` overloads.
 *
 * Multi-slot recipes are detected via the `__tsMultiSlot` brand (`MultiSlotReturn` is not
 * a public export in all typestyles builds).
 */
export type OverrideConfigFor<C> =
  C extends ComponentReturn<infer V>
    ? OverrideConfig<V>
    : C extends ComponentAttrsReturn<infer V>
      ? OverrideConfig<V>
      : C extends FlatComponentReturn<infer K>
        ? FlatOverrideConfig<K>
        : C extends { readonly __tsMultiSlot: true }
          ? C extends () => infer R
            ? ThemeMultiSlotOverrideConfig<keyof R & string>
            : never
          : C extends SlotComponentFunction<infer Slots, infer V>
            ? SlotOverrideConfig<Slots, V>
            : C extends SlotAttrsReturn<infer Slots, infer V>
              ? SlotOverrideConfig<Slots, V>
              : never;

/** Override config for one registry entry in {@link themeableComponents}. */
export type ThemeComponentOverrideFor<K extends ThemeableComponentName> = OverrideConfigFor<
  (typeof themeableComponents)[K]
>;

/** Union of all themeable recipe override shapes (escape hatch / docs). */
export type ThemeComponentOverride = {
  [K in ThemeableComponentName]: ThemeComponentOverrideFor<K>;
}[ThemeableComponentName];
