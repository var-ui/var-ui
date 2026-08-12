import { Steps } from '@var-ui/react';

export default function Preview() {
  return (
    <Steps>
      <li>Choose a plan</li>
      <li aria-current="step">Enter billing details</li>
      <li>Confirm purchase</li>
    </Steps>
  );
}
