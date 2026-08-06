import { describe, it } from 'vite-plus/test';
import type { OverrideConfigFor } from 'typestyles';
import { sideNav } from '../../src/components/sideNav';

describe('sideNav override typing', () => {
  it('infers slot overrides from recipe slots', () => {
    type SideNavOverride = OverrideConfigFor<typeof sideNav>;
    const ok: SideNavOverride = {
      base: {
        root: { borderColor: 'transparent' },
      },
    };
    void ok;
  });
});
