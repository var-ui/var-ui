import { HStack, IconButton, VStack } from '@var-ui/react';

export default function Preview() {
  return (
    <VStack gap="lg">
      <HStack gap="sm">
        <IconButton name="search" aria-label="Search small" size="sm" />
        <IconButton name="search" aria-label="Search medium" size="md" />
        <IconButton name="search" aria-label="Search large" size="lg" />
      </HStack>
      <HStack gap="sm">
        <IconButton name="close" aria-label="Close" intent="secondary" />
        <IconButton name="search" aria-label="Search" intent="primary" />
        <IconButton name="menu" aria-label="Menu" intent="ghost" />
        <IconButton name="close" aria-label="Delete" intent="danger" />
      </HStack>
    </VStack>
  );
}
