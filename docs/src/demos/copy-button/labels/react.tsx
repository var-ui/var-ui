import { CopyButton } from '@var-ui/react';

export default function Preview() {
  return (
    <CopyButton
      value="npm i @var-ui/react"
      copyLabel="Copy install command"
      copiedLabel="Copied to clipboard"
    />
  );
}
