import { describe, expect, it } from 'vite-plus/test';
import { astroDemoIds } from './astroDemoMap';
import { htmlDemoIds } from './htmlDemoMap';
import { collectMdxDemoIds } from './mdxDemoIds';
import { DEMO_IDS, demoSnippets, reactDemoLoaders } from './registry';

describe('MDX demo completeness gate', () => {
  it('every active MDX Demo id is fully registered', () => {
    const ids = collectMdxDemoIds();
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(DEMO_IDS, `missing DEMO_IDS: ${id}`).toContain(id);
      expect(demoSnippets[id as keyof typeof demoSnippets].react.length).toBeGreaterThan(0);
      expect(demoSnippets[id as keyof typeof demoSnippets].astro.length).toBeGreaterThan(0);
      expect(demoSnippets[id as keyof typeof demoSnippets].html.length).toBeGreaterThan(0);
      expect(reactDemoLoaders[id as keyof typeof reactDemoLoaders]).toBeTypeOf('function');
      expect(astroDemoIds).toContain(id);
      expect(htmlDemoIds).toContain(id);
    }
  });
});
