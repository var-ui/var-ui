import { PasswordInput } from '@var-ui/react';

export default function Preview() {
  return (
    <PasswordInput
      label="Password"
      description="Use at least 8 characters"
      errorMessage="Password is too short"
      defaultValue="secret"
    />
  );
}
