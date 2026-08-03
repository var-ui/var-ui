import { describe, expect, it } from 'vite-plus/test';

describe('@var-ui/core/styles', () => {
  it('loads without throwing', async () => {
    await expect(import('../src/styles')).resolves.toBeDefined();
  });
});
