import { describe, expect, it } from 'vite-plus/test';
import { designTokens as t } from '@var-ui/core';
import { varUiCodeTheme } from './shikiCodeTheme';

describe('varUiCodeTheme', () => {
  it('references semantic color.code CSS variables', () => {
    expect(varUiCodeTheme.colors['editor.foreground']).toBe(t.color.code.base.var);
    expect(
      varUiCodeTheme.tokenColors.some(
        (rule) => rule.settings.foreground === t.color.code.keyword.var,
      ),
    ).toBe(true);
    expect(
      varUiCodeTheme.tokenColors.some(
        (rule) => rule.settings.foreground === t.color.code.string.var,
      ),
    ).toBe(true);
  });

  it('maps diff tokens to addition/deletion colors', () => {
    const addition = varUiCodeTheme.tokenColors.find(
      (rule) => Array.isArray(rule.scope) && rule.scope.includes('markup.inserted'),
    );
    expect(addition?.settings.foreground).toBe(t.color.code.addition.var);
    expect(addition?.settings.background).toBe(t.color.code.additionBackground.var);
  });
});
