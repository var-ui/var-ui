'use client';

import { useNavigate } from '@tanstack/react-router';
import { CommandPalette, IconButton, Kbd, useMediaQuery } from '@var-ui/react';
import { useMemo, useState } from 'react';
import { buildDocsSearchIndex } from '@/lib/search-index';

/** Header search trigger + ⌘K CommandPalette over the docs route index. */
export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const items = useMemo(() => buildDocsSearchIndex(), []);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <IconButton name="search" aria-label="Search docs" onPress={() => setOpen(true)} />
      {isMobile ? null : <Kbd>⌘K</Kbd>}
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        items={items}
        placeholder="Search docs…"
        onAction={(id) => {
          setOpen(false);
          void navigate({ to: id });
        }}
      />
    </>
  );
}
