import { Button, HStack, Popover } from '@var-ui/react';

export default function Preview() {
  return (
    <Popover trigger={<Button intent="secondary">Share</Button>} title="Share link">
      <p>Anyone with the link can view this draft.</p>
      <HStack gap="sm" style={{ marginTop: 12 }}>
        <Button intent="primary" size="sm">
          Copy link
        </Button>
        <Button intent="ghost" size="sm">
          Cancel
        </Button>
      </HStack>
    </Popover>
  );
}
