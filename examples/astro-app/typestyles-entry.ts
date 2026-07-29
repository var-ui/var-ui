// Build-time CSS extraction entry for @typestyles/vite.
// Side-effect imports register every recipe the gallery can render.
import { themeableComponents } from '@var-ui/core';

for (const recipe of Object.values(themeableComponents)) {
  if (typeof recipe === 'function') {
    (recipe as () => unknown)();
  }
}
