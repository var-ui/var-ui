import { Hidden, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <Hidden hide={{ md: true }} as="aside">
      <Text>Visible below md</Text>
    </Hidden>
  );
}
