import { describe, expect, it } from 'vite-plus/test';
import { parseComponentDocsConfig, ComponentDocsUserConfigSchema } from './config';

describe('parseComponentDocsConfig', () => {
  it('applies defaults for an empty config', () => {
    const config = parseComponentDocsConfig({});
    expect(config.frameworks).toEqual(['react', 'astro', 'html']);
    expect(config.defaultFramework).toBe('react');
    expect(config.cookieName).toBe('var-ui-framework');
    expect(config.disableComponentRoutes).toBe(true);
    expect(config.disableMiddleware).toBe(true);
  });

  it('accepts extractProps write + outputDir', () => {
    const write = () => {};
    const config = parseComponentDocsConfig({
      extractProps: {
        write,
        outputDir: 'src/generated/props',
        watch: ['../packages/react/src'],
      },
    });
    expect(config.extractProps?.write).toBe(write);
    expect(config.extractProps?.watch).toEqual(['../packages/react/src']);
  });

  it('rejects non-function write', () => {
    expect(
      ComponentDocsUserConfigSchema.safeParse({
        extractProps: { write: 'nope' },
      }).success,
    ).toBe(false);
  });

  it('rejects empty cookieName', () => {
    expect(ComponentDocsUserConfigSchema.safeParse({ cookieName: '' }).success).toBe(false);
  });
});
