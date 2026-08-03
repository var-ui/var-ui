import { PALETTE_FAMILIES } from '@var-ui/core';
import { recipeClassName } from '@var-ui/react';
import {
  formatCssVarName,
  getPaletteSwatches,
  getSemanticSwatches,
  groupSemanticSwatches,
} from '@/lib/color-tokens';
import { colorSwatchesStyles } from '@/styles/colorSwatches';

const allPaletteSwatches = getPaletteSwatches();
const paletteByFamily = PALETTE_FAMILIES.map((family) => ({
  family,
  swatches: allPaletteSwatches.filter((swatch) => swatch.family === family),
}));

const semanticGroups = groupSemanticSwatches(getSemanticSwatches());

export default function ColorSwatches() {
  const c = colorSwatchesStyles();

  return (
    <div className={recipeClassName(c.root)}>
      <section className={recipeClassName(c.section)} aria-labelledby="palette-heading">
        <h2 id="palette-heading" className={recipeClassName(c.sectionTitle)}>
          Palette
        </h2>
        <p className={recipeClassName(c.sectionDescription)}>
          Primitive color ramps generated from OKLCH. Each family has ten steps from lightest (1) to
          darkest (10). Reference with <code>designTokens.color.palette['family-step']</code>.
        </p>

        {paletteByFamily.map(({ family, swatches }) => (
          <div key={family} className={recipeClassName(c.paletteFamily)}>
            <span className={recipeClassName(c.paletteFamilyName)}>{family}</span>
            <div
              className={recipeClassName(c.paletteRamp)}
              role="list"
              aria-label={`${family} palette`}
            >
              {swatches.map((swatch) => (
                <div
                  key={swatch.token}
                  className={recipeClassName(c.paletteSwatch)}
                  role="listitem"
                  title={`palette.${swatch.token} — ${swatch.value}`}
                >
                  <div
                    className={recipeClassName(c.paletteStep)}
                    style={{ backgroundColor: swatch.cssVar }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className={recipeClassName(c.section)} aria-labelledby="semantic-heading">
        <h2 id="semantic-heading" className={recipeClassName(c.sectionTitle)}>
          Semantic colors
        </h2>
        <p className={recipeClassName(c.sectionDescription)}>
          UI role tokens that map to palette steps or computed mixes. Swatches follow the site color
          mode — toggle light/dark in the header to compare faces.
        </p>

        {[...semanticGroups.entries()].map(([group, swatches]) => (
          <div key={group} className={recipeClassName(c.semanticGroup)}>
            <h3 className={recipeClassName(c.semanticGroupTitle)}>{group}</h3>
            <div
              className={recipeClassName(c.semanticGrid)}
              role="list"
              aria-label={`${group} colors`}
            >
              {swatches.map((swatch) => (
                <div
                  key={swatch.token}
                  className={recipeClassName(c.semanticCard)}
                  role="listitem"
                  title={swatch.defaultValue}
                >
                  <div
                    className={recipeClassName(c.semanticPreview)}
                    style={{ backgroundColor: swatch.cssVar }}
                    aria-hidden="true"
                  />
                  <div className={recipeClassName(c.semanticMeta)}>
                    <span className={recipeClassName(c.semanticToken)}>
                      {swatch.token.replace(`color.${group}.`, '')}
                    </span>
                    <span className={recipeClassName(c.semanticVar)}>
                      {formatCssVarName(swatch.cssVar)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
