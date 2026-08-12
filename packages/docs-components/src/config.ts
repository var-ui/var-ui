import { z } from 'zod';

const DocsFrameworkSchema = z.enum(['react', 'astro', 'html']);

export const ComponentDocsExtractPropsSchema = z
  .object({
    /** Writes generated props JSON into `outputDir`. */
    write: z.custom<(outputDir: string) => void | Promise<void>>(
      (value) => typeof value === 'function',
      { message: 'extractProps.write must be a function' },
    ),
    /** Output directory for generated JSON (relative to project root). */
    outputDir: z.string().min(1).default('src/generated/props'),
    /**
     * Paths (relative to project root) to watch in dev for re-extract.
     * @example `['../packages/react/src']`
     */
    watch: z.array(z.string()).optional(),
  })
  .optional();

export const ComponentDocsUserConfigSchema = z.object({
  /** Frameworks shown in the switcher. */
  frameworks: z.array(DocsFrameworkSchema).optional().default(['react', 'astro', 'html']),
  /** Default when cookie is missing. */
  defaultFramework: DocsFrameworkSchema.optional().default('react'),
  /** Cookie name for the selected framework. */
  cookieName: z.string().min(1).optional().default('var-ui-framework'),
  /** Vite props extraction. Omit to skip. */
  extractProps: ComponentDocsExtractPropsSchema,
  /**
   * When true, do not inject `/components` routes (site owns pages).
   * Required for Netlify SSR workspace packages today.
   */
  disableComponentRoutes: z.boolean().optional().default(true),
  /** When true, do not register framework middleware (site owns middleware). */
  disableMiddleware: z.boolean().optional().default(true),
});

export type ComponentDocsUserConfig = z.input<typeof ComponentDocsUserConfigSchema>;
export type ComponentDocsConfig = z.output<typeof ComponentDocsUserConfigSchema>;

export function parseComponentDocsConfig(input: unknown = {}): ComponentDocsConfig {
  return ComponentDocsUserConfigSchema.parse(input ?? {});
}
