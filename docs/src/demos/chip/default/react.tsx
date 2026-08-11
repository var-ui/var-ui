import { useState } from 'react';
import { Chip, ChipGroup, HStack, Pill } from '@var-ui/react';

export default function Preview() {
  const [frameworks, setFrameworks] = useState<Set<string>>(() => new Set(['react']));
  const [tags, setTags] = useState(['Docs', 'API']);

  return (
    <HStack gap="md" wrap align="start">
      <ChipGroup
        tone="accent"
        selectionMode="multiple"
        selectedKeys={frameworks}
        onSelectionChange={(keys) => setFrameworks(new Set([...keys].map(String)))}
        aria-label="Frameworks"
      >
        <Chip value="react">React</Chip>
        <Chip value="vue">Vue</Chip>
        <Chip value="svelte">Svelte</Chip>
      </ChipGroup>
      <HStack gap="sm" wrap align="center">
        {tags.map((tag) => (
          <Pill
            key={tag}
            tone="neutral"
            onRemove={() => setTags((current) => current.filter((t) => t !== tag))}
          >
            {tag}
          </Pill>
        ))}
      </HStack>
    </HStack>
  );
}
