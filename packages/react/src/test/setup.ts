import { afterEach } from 'vite-plus/test';
import { cleanup } from '@testing-library/react';

// RTL auto-cleanup relies on vitest globals; register it explicitly instead.
afterEach(() => {
  cleanup();
});
