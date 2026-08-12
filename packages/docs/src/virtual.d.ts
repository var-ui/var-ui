declare module 'virtual:var-docs/config' {
  const config: import('./config').VarDocsConfig;
  export default config;
}

declare module 'virtual:var-docs/components/Layout' {
  const Layout: (props: Record<string, unknown>) => unknown;
  export default Layout;
}

declare module 'virtual:var-docs/mdx-components' {
  const components: Record<string, unknown>;
  export default components;
  export const ColorSwatches: unknown;
  export const CssVariableReference: unknown;
  export const ShadowSwatches: unknown;
}
