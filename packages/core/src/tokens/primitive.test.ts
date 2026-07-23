import { describe, expect, it } from 'vite-plus/test';
import {
  durationValues,
  fontSizeValues,
  letterSpacingValues,
  opacityValues,
  radiusValues,
  shadowValues,
  sizeValues,
  spaceValues,
} from './primitive';

describe('primitive token scales', () => {
  it('matches calibrated fontSizeValues snapshot', () => {
    expect(fontSizeValues).toMatchInlineSnapshot(`
      {
        "2xl": "24px",
        "3xl": "29px",
        "lg": "17px",
        "md": "14px",
        "sm": "12px",
        "xl": "20px",
        "xs": "10px",
      }
    `);
  });

  it('matches calibrated radiusValues snapshot', () => {
    expect(radiusValues).toMatchInlineSnapshot(`
      {
        "full": "0",
        "lg": "0px",
        "md": "0px",
        "none": "0",
        "sm": "0px",
        "xl": "0px",
      }
    `);
  });

  it('matches calibrated durationValues snapshot', () => {
    expect(durationValues).toMatchInlineSnapshot(`
      {
        "fast": "80ms",
        "fast-max": "105ms",
        "fast-min": "60ms",
        "medium": "140ms",
        "medium-max": "185ms",
        "medium-min": "105ms",
        "slow": "220ms",
        "slow-max": "295ms",
        "slow-min": "165ms",
      }
    `);
  });

  it('keeps md anchored at 14px', () => {
    expect(fontSizeValues.md).toBe('14px');
  });

  it('keeps brutalist radius at zero for scaled steps', () => {
    expect(radiusValues.sm).toBe('0px');
    expect(radiusValues.md).toBe('0px');
    expect(radiusValues.lg).toBe('0px');
    expect(radiusValues.xl).toBe('0px');
  });

  it('orders duration bands min < anchor < max', () => {
    for (const band of ['fast', 'medium', 'slow'] as const) {
      const min = Number.parseInt(durationValues[`${band}-min`], 10);
      const anchor = Number.parseInt(durationValues[band], 10);
      const max = Number.parseInt(durationValues[`${band}-max`], 10);
      expect(min).toBeLessThan(anchor);
      expect(anchor).toBeLessThan(max);
    }
  });

  it('includes expanded space scale', () => {
    expect(spaceValues[0]).toBe('0px');
    expect(spaceValues[7]).toBe('28px');
    expect(spaceValues[20]).toBe('80px');
  });

  it('matches sizeValues snapshot', () => {
    expect(sizeValues).toMatchInlineSnapshot(`
      {
        "control": {
          "lg": "36px",
          "md": "32px",
          "sm": "28px",
        },
        "icon": {
          "lg": "20px",
          "md": "16px",
          "sm": "14px",
        },
      }
    `);
  });

  it('matches opacityValues snapshot', () => {
    expect(opacityValues).toMatchInlineSnapshot(`
      {
        "disabled": "0.5",
        "muted": "0.6",
      }
    `);
  });

  it('matches letterSpacingValues snapshot', () => {
    expect(letterSpacingValues).toMatchInlineSnapshot(`
      {
        "caps": "0.06em",
        "normal": "0",
        "tight": "-0.015em",
        "wide": "0.025em",
      }
    `);
  });

  it('includes soft elevation shadows', () => {
    expect(shadowValues.elevation.low).toMatch(/color-mix/);
    expect(shadowValues.elevation.med).toMatch(/0 4px 12px/);
    expect(shadowValues.elevation.high).toMatch(/0 12px 32px/);
  });
});
