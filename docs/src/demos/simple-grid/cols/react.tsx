import { SimpleGrid } from '@var-ui/react';

export default function Preview() {
  return (
    <SimpleGrid cols={4} spacing="md" style={{ width: '100%' }}>
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
    </SimpleGrid>
  );
}
