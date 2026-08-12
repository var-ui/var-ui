import { z } from 'zod';

/** Frontmatter for design-system component MDX pages. */
export const componentFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  tableOfContents: z.boolean().optional().default(true),
});

export type ComponentFrontmatter = z.infer<typeof componentFrontmatterSchema>;

/** Starlight-style factory: `schema: componentDocsSchema()` */
export function componentDocsSchema() {
  return componentFrontmatterSchema;
}
