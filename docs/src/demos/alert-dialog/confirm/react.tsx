import { AlertDialog } from '@var-ui/react';

export default function Preview() {
  return (
    <AlertDialog
      triggerLabel="Publish"
      title="Publish post?"
      description="Your draft will become visible to everyone with the link."
      confirmLabel="Publish"
      cancelLabel="Keep editing"
      onConfirm={() => {}}
    />
  );
}
