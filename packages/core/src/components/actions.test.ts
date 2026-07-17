import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { buttonGroup } from './buttonGroup';
import { menu } from './menu';
import { numberInput } from './numberInput';
import { segmentedControl } from './segmentedControl';
import { slider } from './slider';
import { toggleButton } from './toggleButton';
import { button } from './button';

describe('button layout variants', () => {
  it('registers icon layout and size variants', () => {
    button({ layout: 'icon', size: 'sm', intent: 'ghost' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-button[data-layout="icon"]');
    expect(css).toContain('.var-ui-button[data-size="sm"]');
  });
});

describe('buttonGroup', () => {
  it('registers grouped button root slot', () => {
    buttonGroup();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-button-group');
  });
});

describe('toggleButton', () => {
  it('registers selected-state styling', () => {
    toggleButton({ size: 'sm' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-toggle-button');
    expect(css).toContain('[data-selected]');
  });
});

describe('segmentedControl', () => {
  it('registers track root slot', () => {
    segmentedControl();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-segmented-control');
  });
});

describe('menu', () => {
  it('registers popover and item slots', () => {
    menu();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-menu__popover');
    expect(css).toContain('.var-ui-menu__item');
    expect(css).toContain('.var-ui-menu__itemDanger');
  });
});

describe('slider', () => {
  it('registers track and thumb slots', () => {
    slider();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-slider-track');
    expect(css).toContain('var-ui-slider-thumb');
  });
});

describe('numberInput', () => {
  it('registers input and stepper slots', () => {
    numberInput();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-number-input-input');
    expect(css).toContain('var-ui-number-input-stepper');
  });
});
