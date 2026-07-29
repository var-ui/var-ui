import { Collapsible, CollapsibleGroup, IconProvider } from '@var-ui/react';

export default function Preview() {
  return (
    <IconProvider icons={{}}>
      <CollapsibleGroup>
        <Collapsible id="install" title="Install" variant="bordered">
          <p>npm install @var-ui/react @var-ui/core</p>
        </Collapsible>
        <Collapsible id="usage" title="Usage" variant="bordered">
          <p>Wrap your app in DesignSystemProvider.</p>
        </Collapsible>
      </CollapsibleGroup>
    </IconProvider>
  );
}
