import { InputGroup, InputGroupInput, InputGroupText } from '@var-ui/react';

export default function Preview() {
  return (
    <InputGroup label="Price">
      <InputGroupText>$</InputGroupText>
      <InputGroupInput aria-label="Price" defaultValue="19" />
    </InputGroup>
  );
}
