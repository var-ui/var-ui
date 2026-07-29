import { describe, expect, it } from 'vite-plus/test';
import { dialog } from '../../src/components/dialog';

describe('dialog', () => {
  it('defaults to the dialog role', () => {
    const classes = dialog();
    const defaultClasses = dialog({ role: 'dialog' });
    expect(classes.modal.props).toEqual(defaultClasses.modal.props);
  });
});
