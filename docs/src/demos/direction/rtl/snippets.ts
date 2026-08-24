import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Breadcrumbs, DirectionProvider, SideNav, Text } from '@var-ui/react';

<DirectionProvider direction="rtl">
  <SideNav header={<SideNav.Heading heading="Docs" />}>
    <SideNav.Section title="Main">
      <SideNav.Item label="Overview" href="#overview" isSelected />
      <SideNav.Item label="Hidden" href="#hidden" />
    </SideNav.Section>
  </SideNav>
  <Breadcrumbs
    items={[
      { id: 'home', label: 'Home', href: '#' },
      { id: 'here', label: 'Current' },
    ]}
  />
  <Text>dir=rtl island</Text>
</DirectionProvider>`,
  astro: `---
import { Breadcrumbs, SideNav, SideNavHeading, SideNavItem, SideNavSection, Text } from '@var-ui/astro';
---
<div dir="rtl">
  <SideNav>
    <SideNavHeading slot="header" heading="Docs" />
    <SideNavSection title="Main">
      <SideNavItem label="Overview" href="#overview" isSelected />
      <SideNavItem label="Hidden" href="#hidden" />
    </SideNavSection>
  </SideNav>
  <Breadcrumbs
    items={[
      { id: 'home', label: 'Home', href: '#' },
      { id: 'here', label: 'Current' },
    ]}
  />
  <Text>dir=rtl island</Text>
</div>`,
  html: `<div dir="rtl">
  <nav class="var-ui-side-nav" aria-label="Side navigation">…</nav>
  <nav class="var-ui-breadcrumbs" aria-label="Breadcrumb">…</nav>
  <p class="var-ui-text-block">dir=rtl island</p>
</div>`,
} satisfies DemoSnippets;
