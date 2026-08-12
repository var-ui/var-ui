import { describe, expect, it } from 'vite-plus/test';
import { astroDemoIds } from './astroDemoMap';
import { htmlDemoIds } from './htmlDemoMap';
import { collectMdxDemoIds } from './mdxDemoIds';
import { REACT_ONLY_DEMO_IDS } from './reactOnlyDemoIds';
import { DEMO_IDS, demoSnippets, reactDemoLoaders, type DemoId } from './registry';

describe('MDX demo completeness gate', () => {
  it('every React-only demo id is registered', () => {
    for (const id of REACT_ONLY_DEMO_IDS) {
      expect(DEMO_IDS, `REACT_ONLY_DEMO_IDS entry missing from DEMO_IDS: ${id}`).toContain(id);
    }
  });

  it('every active MDX Demo id is fully registered', () => {
    const ids = collectMdxDemoIds();
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(DEMO_IDS, `missing DEMO_IDS: ${id}`).toContain(id);
      expect(demoSnippets[id as keyof typeof demoSnippets].react.length).toBeGreaterThan(0);
      expect(reactDemoLoaders[id as keyof typeof reactDemoLoaders]).toBeTypeOf('function');

      if (REACT_ONLY_DEMO_IDS.has(id as DemoId)) {
        continue;
      }

      expect(demoSnippets[id as keyof typeof demoSnippets].astro.length).toBeGreaterThan(0);
      expect(demoSnippets[id as keyof typeof demoSnippets].html.length).toBeGreaterThan(0);
      expect(astroDemoIds).toContain(id);
      expect(htmlDemoIds).toContain(id);
    }
  });
});
