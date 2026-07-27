import { describe, it, expect } from 'vite-plus/test';
import { defineFonts } from './define-fonts';

describe('defineFonts', () => {
  it('builds font stacks and collects faces', () => {
    const result = defineFonts({
      sans: {
        face: {
          family: 'Space Grotesk',
          src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
          fontWeight: '300 700',
        },
        fallback: 'ui-sans-serif, system-ui, sans-serif',
      },
      mono: {
        face: {
          family: 'JetBrains Mono',
          src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
        },
        fallback: 'ui-monospace, monospace',
      },
    });

    expect(result.fonts).toHaveLength(2);
    expect(result.tokens.fontFamily.sans).toBe(
      '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    );
    expect(result.tokens.fontFamily.mono).toBe('"JetBrains Mono", ui-monospace, monospace');
  });

  it('omits undefined slots', () => {
    const result = defineFonts({
      sans: {
        face: { family: 'Inter', src: "url('/fonts/inter.woff2') format('woff2')" },
        fallback: 'sans-serif',
      },
    });

    expect(result.tokens.fontFamily).toEqual({ sans: '"Inter", sans-serif' });
    expect(result.tokens.fontFamily.mono).toBeUndefined();
  });
});
