import { Button, IconButton, Toolbar } from '@var-ui/react';

export default function Preview() {
  return (
    <Toolbar
      label="Editor toolbar"
      startContent={
        <>
          <IconButton name="menu" aria-label="Menu" />
          <IconButton name="search" aria-label="Search" />
        </>
      }
      centerContent={<Button intent="secondary">Untitled</Button>}
      endContent={<Button intent="primary">Share</Button>}
    />
  );
}
