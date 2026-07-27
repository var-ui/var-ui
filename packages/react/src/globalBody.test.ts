import { describe, it, expect } from 'vite-plus/test';

describe('globalBody', () => {
  it('loads', async () => {
    await expect(import('./globalBody')).resolves.toBeDefined();
  });
});
