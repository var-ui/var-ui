import { afterEach } from 'vite-plus/test';
import { cleanup } from '@testing-library/react';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverStub as typeof ResizeObserver;
}

// RTL auto-cleanup relies on vitest globals; register it explicitly instead.
afterEach(() => {
  cleanup();
});
