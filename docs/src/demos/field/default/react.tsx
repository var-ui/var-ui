import { Field } from '@var-ui/react';

export default function Preview() {
  return (
    <Field
      label="Custom control"
      description="Any input composes the shared field chrome."
      htmlFor="custom-range"
    >
      <input id="custom-range" type="range" />
    </Field>
  );
}
