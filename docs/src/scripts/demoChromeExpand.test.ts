import { afterEach, describe, expect, it } from 'vite-plus/test';
import { initDemoChromeExpand } from './demoChromeExpand';

function mountDemoCode(code: string): HTMLElement {
  document.body.innerHTML = `
    <section data-demo-chrome-code data-demo-code="${code.replace(/"/g, '&quot;')}">
      <div data-codeblock-body></div>
      <div data-demo-fade></div>
      <div data-demo-expand-wrap>
        <button type="button" data-demo-expand>Expand code</button>
      </div>
    </section>
  `;
  return document.querySelector('[data-demo-chrome-code]')!;
}

describe('initDemoChromeExpand', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hides expand control for short snippets', () => {
    const section = mountDemoCode('import { Button } from "@var-ui/react";\n\n<Button />');
    initDemoChromeExpand();

    expect(section.querySelector('[data-demo-expand-wrap]')?.hasAttribute('hidden')).toBe(true);
  });

  it('collapses long snippets and toggles on click', () => {
    const lines = Array.from({ length: 12 }, (_, i) => `line ${i + 1}`).join('\n');
    const section = mountDemoCode(lines);
    initDemoChromeExpand();

    const body = section.querySelector<HTMLElement>('[data-codeblock-body]')!;
    const button = section.querySelector<HTMLButtonElement>('[data-demo-expand]')!;

    expect(section.hasAttribute('data-demo-collapsed')).toBe(true);
    expect(body.style.maxHeight).toBe('11rem');

    button.click();
    expect(section.hasAttribute('data-demo-collapsed')).toBe(false);
    expect(body.style.maxHeight).toBe('');
    expect(button.textContent).toBe('Collapse code');

    button.click();
    expect(section.hasAttribute('data-demo-collapsed')).toBe(true);
  });
});
