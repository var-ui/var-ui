# @var-ui/icons

Optional default glyphs for the [var-ui](https://github.com/var-ui/var-ui) design system.

var-ui components never bundle SVGs — they resolve semantic icon names
(`close`, `chevronDown`, `search`, …) through `IconProvider` from
`@var-ui/react`. This package supplies a hand-authored default set so apps
don't have to bring their own icon library. It is an **optional** peer of
`@var-ui/react`; apps that skip it pay zero icon payload (unmapped names
render a shared empty placeholder).

## Install

```bash
pnpm add @var-ui/icons
```

## Usage

```tsx
import { IconProvider } from '@var-ui/react';
import { defaultIcons } from '@var-ui/icons';

<IconProvider icons={defaultIcons}>
  <App />
</IconProvider>;
```

Granular bundles are exported too (`bundle1Icons`, …) if you want a subset.
Icons are minimal inline SVGs — 24×24 viewBox, `currentColor`, `aria-hidden` —
and tree-shake with your bundler since nothing is auto-imported.

To use a third-party icon library instead, map its glyphs onto `IconName`
keys — see the `@var-ui/react` README.
