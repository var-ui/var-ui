import { describe, expect, it, vi } from 'vite-plus/test';
import { copyText } from './codeBlockCopy';

describe('copyText', () => {
  it('writes to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // @ts-expect-error test stub
    globalThis.navigator = { clipboard: { writeText } };
    await expect(copyText('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });
});
