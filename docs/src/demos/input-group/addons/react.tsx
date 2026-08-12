import { InputGroup, InputGroupInput, InputGroupText } from '@var-ui/react';

export default function Preview() {
  return (
    <InputGroup label="Website" description="Prefix and suffix addons">
      <InputGroupText>https://</InputGroupText>
      <InputGroupInput aria-label="Website" placeholder="example" />
      <InputGroupText>.com</InputGroupText>
    </InputGroup>
  );
}
