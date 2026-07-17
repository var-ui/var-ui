import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { dialog } from './dialog';

describe('dialog', () => {
  it('registers existing slots by default', () => {
    dialog();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-dialog__overlay');
    expect(css).toContain('.var-ui-dialog__modal');
    expect(css).toContain('.var-ui-dialog__content');
    expect(css).toContain('.var-ui-dialog__header');
    expect(css).toContain('.var-ui-dialog__heading');
    expect(css).toContain('.var-ui-dialog__description');
    expect(css).toContain('.var-ui-dialog__closeButton');
  });

  it('registers an actions slot', () => {
    dialog();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-dialog__actions');
  });

  it('registers an alertdialog role variant', () => {
    dialog({ role: 'alertdialog' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-dialog__modal[data-role="alertdialog"]');
  });

  it('defaults to the dialog role', () => {
    const classes = dialog();
    const defaultClasses = dialog({ role: 'dialog' });
    expect(classes.modal.props).toEqual(defaultClasses.modal.props);
  });
});
