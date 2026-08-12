import { Button, Toolbar } from '@var-ui/react';

export default function Preview() {
  return (
    <Toolbar
      label="Document actions"
      startContent={<Button intent="secondary">Bold</Button>}
      endContent={<Button intent="secondary">Share</Button>}
    />
  );
}
