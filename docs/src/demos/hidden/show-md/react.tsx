import { Hidden, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <Hidden hide={{ base: true, md: false }} as="aside">
      <Text>Visible from md</Text>
    </Hidden>
  );
}
