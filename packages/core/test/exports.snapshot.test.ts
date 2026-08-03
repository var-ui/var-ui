import { describe, expect, it } from 'vite-plus/test';
import * as internal from '../src/internal';
import * as pkg from '../src/index';
import { buildPackageExportsAudit, entryPathFor } from './lib/package-exports-audit';

describe('@var-ui/core public exports', () => {
  it('matches the export inventory snapshot', () => {
    const audit = buildPackageExportsAudit(pkg as Record<string, unknown>, entryPathFor('index'));
    expect(audit).toMatchSnapshot();
  });
});

describe('@var-ui/core/internal exports', () => {
  it('matches the internal export inventory snapshot', () => {
    const audit = buildPackageExportsAudit(
      internal as Record<string, unknown>,
      entryPathFor('internal'),
    );
    expect(audit).toMatchSnapshot();
  });
});
