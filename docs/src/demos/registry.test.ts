import { describe, expect, it } from 'vite-plus/test';
import { astroDemoIds, astroDemoMap } from './astroDemoMap';
import { htmlDemoIds, htmlDemoMap } from './htmlDemoMap';
import { reactDemoIds, reactDemoMap } from './reactDemoMap';
import { REACT_ONLY_DEMO_IDS } from './reactOnlyDemoIds';
import {
  DEMO_IDS,
  assertDemoComplete,
  demoRegistry,
  demoSnippets,
  reactDemoLoaders,
} from './registry';
import { render as renderButtonDefault } from './button/default/html';
import { render as renderHiddenHideMd } from './hidden/hide-md/html';
import { render as renderHiddenShowMd } from './hidden/show-md/html';

describe('demo registry completeness', () => {
  it('has snippets and loaders for every id across frameworks', () => {
    for (const id of DEMO_IDS) {
      expect(demoSnippets[id].react.length).toBeGreaterThan(0);
      expect(demoSnippets[id].astro.length).toBeGreaterThan(0);
      expect(demoSnippets[id].html.length).toBeGreaterThan(0);
      expect(reactDemoLoaders[id]).toBeTypeOf('function');
      if (!REACT_ONLY_DEMO_IDS.has(id)) {
        expect(astroDemoIds).toContain(id);
        expect(htmlDemoIds).toContain(id);
      }
      assertDemoComplete(demoRegistry[id]);
    }
  });

  it('keeps astro/html/react map keys in sync with DEMO_IDS', () => {
    const crossFrameworkIds = DEMO_IDS.filter((id) => !REACT_ONLY_DEMO_IDS.has(id));
    expect([...astroDemoIds].sort()).toEqual([...crossFrameworkIds].sort());
    expect([...htmlDemoIds].sort()).toEqual([...crossFrameworkIds].sort());
    expect([...reactDemoIds].sort()).toEqual([...DEMO_IDS].sort());
    expect(Object.keys(astroDemoMap).sort()).toEqual([...crossFrameworkIds].sort());
    expect(Object.keys(htmlDemoMap).sort()).toEqual([...crossFrameworkIds].sort());
    expect(Object.keys(reactDemoMap).sort()).toEqual([...DEMO_IDS].sort());
  });

  it('keeps Hidden HTML snippets aligned with live hide classes', () => {
    const hideMdClass = renderHiddenHideMd().match(/<aside class="([^"]+)"/)?.[1];
    const showMdClass = renderHiddenShowMd().match(/<aside class="([^"]+)"/)?.[1];
    expect(hideMdClass).toBeTruthy();
    expect(showMdClass).toBeTruthy();
    expect(demoSnippets['hidden.hide-md'].html).toContain(`class="${hideMdClass}"`);
    expect(demoSnippets['hidden.show-md'].html).toContain(`class="${showMdClass}"`);
  });

  it('serializes HTML button previews with class + data attrs', () => {
    const html = renderButtonDefault();
    expect(html).toMatch(/^<button /);
    expect(html).toContain('class="var-ui-button"');
    expect(html).toContain('data-tone="neutral"');
    expect(html).toContain('data-appearance="subtle"');
    expect(html).toContain('>Click me</button>');
    expect(html).not.toContain('className=');
  });
});
