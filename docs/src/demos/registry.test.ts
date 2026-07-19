import { describe, expect, it } from 'vite-plus/test';
import { astroDemoIds, astroDemoMap } from './astroDemoMap';
import { htmlDemoIds, htmlDemoMap } from './htmlDemoMap';
import {
  DEMO_IDS,
  assertDemoComplete,
  demoRegistry,
  demoSnippets,
  reactDemoLoaders,
} from './registry';
import { render as renderButtonDefault } from './button/default/html';

describe('demo registry completeness', () => {
  it('has snippets and loaders for every id across frameworks', () => {
    for (const id of DEMO_IDS) {
      expect(demoSnippets[id].react.length).toBeGreaterThan(0);
      expect(demoSnippets[id].astro.length).toBeGreaterThan(0);
      expect(demoSnippets[id].html.length).toBeGreaterThan(0);
      expect(reactDemoLoaders[id]).toBeTypeOf('function');
      expect(astroDemoIds).toContain(id);
      expect(htmlDemoIds).toContain(id);
      assertDemoComplete(demoRegistry[id]);
    }
  });

  it('keeps astro/html map keys in sync with DEMO_IDS', () => {
    expect([...astroDemoIds].sort()).toEqual([...DEMO_IDS].sort());
    expect([...htmlDemoIds].sort()).toEqual([...DEMO_IDS].sort());
    expect(Object.keys(astroDemoMap).sort()).toEqual([...DEMO_IDS].sort());
    expect(Object.keys(htmlDemoMap).sort()).toEqual([...DEMO_IDS].sort());
  });

  it('serializes HTML button previews with class + data attrs', () => {
    const html = renderButtonDefault();
    expect(html).toMatch(/^<button /);
    expect(html).toContain('class="var-ui-button"');
    expect(html).toContain('data-intent="secondary"');
    expect(html).toContain('>Click me</button>');
    expect(html).not.toContain('className=');
  });
});
