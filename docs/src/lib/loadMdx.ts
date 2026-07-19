type MdxModule = {
  frontmatter: {
    title: string;
    description?: string;
  };
  Content: unknown;
};

/** Resolve a glob key ending with `/{slug}.mdx`. */
export function findMdxModule(
  modules: Record<string, () => Promise<unknown>>,
  slug: string,
): (() => Promise<MdxModule>) | undefined {
  const suffix = `/${slug}.mdx`;
  const key = Object.keys(modules).find((path) => path.endsWith(suffix));
  if (!key) return undefined;
  return modules[key] as () => Promise<MdxModule>;
}
