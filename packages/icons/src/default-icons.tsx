import type { ReactNode } from 'react';
import { defaultGlyphInnerHtml, iconNameList, type IconName } from '@var-ui/core';
import { glyphFromInnerHtml } from './glyph';

/** Default React glyphs — pass to `IconProvider`. */
export const defaultIcons: Partial<Record<IconName, ReactNode>> = Object.fromEntries(
  iconNameList.map((name) => [name, glyphFromInnerHtml(defaultGlyphInnerHtml[name])]),
);
