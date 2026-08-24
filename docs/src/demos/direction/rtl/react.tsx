import { Breadcrumbs, DirectionProvider, SideNav, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <DirectionProvider direction="rtl">
      <div
        style={{
          height: 280,
          width: 240,
          border: '1px solid var(--var-ui-color-border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <SideNav header={<SideNav.Heading heading="Docs" />}>
          <SideNav.Section title="Main">
            <SideNav.Item label="Overview" href="#overview" isSelected />
            <SideNav.Item label="Hidden" href="#hidden" />
          </SideNav.Section>
        </SideNav>
      </div>
      <Breadcrumbs
        items={[
          { id: 'home', label: 'Home', href: '#' },
          { id: 'here', label: 'Current' },
        ]}
      />
      <Text>dir=rtl island</Text>
    </DirectionProvider>
  );
}
