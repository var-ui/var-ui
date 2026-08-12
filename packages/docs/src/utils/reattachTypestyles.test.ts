import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { ensureDocumentStylesAttached } from 'typestyles';
import { reattachTypestyles } from './reattachTypestyles';

vi.mock('typestyles', () => ({
  ensureDocumentStylesAttached: vi.fn(),
}));

describe('reattachTypestyles', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls ensureDocumentStylesAttached', () => {
    vi.mocked(ensureDocumentStylesAttached).mockClear();
    reattachTypestyles();
    expect(ensureDocumentStylesAttached).toHaveBeenCalledOnce();
  });
});
