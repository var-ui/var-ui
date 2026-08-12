import { SimpleGrid } from '@var-ui/react';

export default function Preview() {
  return (
    <SimpleGrid cols={3} spacing="sm" style={{ width: '100%' }}>
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
    </SimpleGrid>
  );
}
