import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { dialog } from './dialog';

describe('dialog', () => {
  it('registers existing slots by default', () => {
    dialog();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-dialog-overlay');
    expect(css).toContain('var-ui-dialog-modal');
    expect(css).toContain('var-ui-dialog-content');
    expect(css).toContain('var-ui-dialog-header');
    expect(css).toContain('var-ui-dialog-heading');
    expect(css).toContain('var-ui-dialog-description');
    expect(css).toContain('var-ui-dialog-closeButton');
  });

  it('registers an actions slot', () => {
    dialog();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-dialog-actions');
  });

  it('registers an alertdialog role variant', () => {
    dialog({ role: 'alertdialog' });
    const css = getRegisteredCss();
    expect(css).toMatch(/var-ui-dialog-\w+-role-alertdialog/);
  });

  it('defaults to the dialog role', () => {
    const classes = dialog();
    const defaultClasses = dialog({ role: 'dialog' });
    expect(classes.modal).toBe(defaultClasses.modal);
  });
});
