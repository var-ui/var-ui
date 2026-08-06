import {
  designTokens,
  PALETTE_FAMILIES,
  tokenValues,
  type PaletteFamily,
  type PaletteTokenKey,
} from '@var-ui/core';

export const PALETTE_STEPS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;

export type PaletteSwatch = {
  family: PaletteFamily;
  step: (typeof PALETTE_STEPS)[number];
  token: string;
  cssVar: string;
  value: string;
};

export type SemanticSwatch = {
  group: string;
  token: string;
  cssVar: string;
  defaultValue: string;
};

type TokenRef = { var: string };

function isTokenRef(value: unknown): value is TokenRef {
  return Boolean(value && typeof value === 'object' && 'var' in value);
}

function isModeAwareColorLeaf(
  value: unknown,
): value is { light?: string | number; dark?: string | number } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length === 0) return false;
  if (!keys.includes('light') && !keys.includes('dark')) return false;
  return Object.values(record).every(
    (entry) => typeof entry === 'string' || typeof entry === 'number',
  );
}

/** Scalar default for docs display (palette refs, OKLCH, or mode-aware light/dark). */
export function formatColorDefaultValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (isModeAwareColorLeaf(value)) {
    const light = value.light != null ? String(value.light) : undefined;
    const dark = value.dark != null ? String(value.dark) : undefined;
    if (light && dark && light !== dark) return `${light} / ${dark}`;
    return light ?? dark ?? '';
  }
  return '';
}

function walkColorTokens(
  values: Record<string, unknown>,
  refs: Record<string, unknown>,
  path: string[] = [],
): Array<{ path: string; cssVar: string; defaultValue: string }> {
  const results: Array<{ path: string; cssVar: string; defaultValue: string }> = [];

  for (const [key, value] of Object.entries(values)) {
    const ref = refs[key];

    if (typeof value === 'string' && isTokenRef(ref)) {
      results.push({
        path: [...path, key].join('.'),
        cssVar: ref.var,
        defaultValue: value,
      });
      continue;
    }

    if (isModeAwareColorLeaf(value) && isTokenRef(ref)) {
      results.push({
        path: [...path, key].join('.'),
        cssVar: ref.var,
        defaultValue: formatColorDefaultValue(value),
      });
      continue;
    }

    if (value && typeof value === 'object' && ref && typeof ref === 'object') {
      results.push(
        ...walkColorTokens(value as Record<string, unknown>, ref as Record<string, unknown>, [
          ...path,
          key,
        ]),
      );
    }
  }

  return results;
}

export function getPaletteSwatches(): PaletteSwatch[] {
  return PALETTE_FAMILIES.flatMap((family) =>
    PALETTE_STEPS.map((step) => {
      const token = `${family}-${step}` as PaletteTokenKey;
      return {
        family,
        step,
        token,
        cssVar: designTokens.color.palette[token].var,
        value: formatColorDefaultValue(tokenValues.color.palette[token]),
      };
    }),
  );
}

export function getSemanticSwatches(): SemanticSwatch[] {
  const { palette: _palette, ...semanticColorValues } = tokenValues.color as Record<
    string,
    unknown
  >;

  return walkColorTokens(semanticColorValues, designTokens.color as Record<string, unknown>).map(
    ({ path, cssVar, defaultValue }) => {
      const [group] = path.split('.');
      return {
        group,
        token: `color.${path}`,
        cssVar,
        defaultValue,
      };
    },
  );
}

export function groupSemanticSwatches(swatches: SemanticSwatch[]): Map<string, SemanticSwatch[]> {
  const groups = new Map<string, SemanticSwatch[]>();

  for (const swatch of swatches) {
    const items = groups.get(swatch.group) ?? [];
    items.push(swatch);
    groups.set(swatch.group, items);
  }

  return groups;
}

export function formatCssVarName(cssVar: string): string {
  return cssVar.replace(/^var\((.+)\)$/, '$1');
}
