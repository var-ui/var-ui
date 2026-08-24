import { describe, expect, it } from 'vite-plus/test';
import { RTL_I18N_FALLBACK_LOCALE, resolveDirection, resolveI18nProviderLocale } from './direction';

describe('resolveDirection', () => {
  it('defaults to ltr', () => {
    expect(resolveDirection({})).toBe('ltr');
  });

  it('lets an explicit direction win over locale', () => {
    expect(resolveDirection({ direction: 'rtl', locale: 'en-US' })).toBe('rtl');
    expect(resolveDirection({ direction: 'ltr', locale: 'he-IL' })).toBe('ltr');
  });

  it('derives rtl from an RTL locale when direction is omitted', () => {
    expect(resolveDirection({ locale: 'he-IL' })).toBe('rtl');
    expect(resolveDirection({ locale: 'en-US' })).toBe('ltr');
  });
});

describe('resolveI18nProviderLocale', () => {
  it('returns undefined for ltr with no locale (do not wrap I18nProvider)', () => {
    expect(resolveI18nProviderLocale({ direction: 'ltr' })).toBeUndefined();
  });

  it('uses the caller locale when provided', () => {
    expect(resolveI18nProviderLocale({ direction: 'rtl', locale: 'he-IL' })).toBe('he-IL');
    expect(resolveI18nProviderLocale({ direction: 'rtl', locale: 'en-US' })).toBe('en-US');
  });

  it('falls back to ar when direction is rtl and locale is omitted', () => {
    expect(resolveI18nProviderLocale({ direction: 'rtl' })).toBe(RTL_I18N_FALLBACK_LOCALE);
  });
});
