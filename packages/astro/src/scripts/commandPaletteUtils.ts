export type CommandPaletteItem = {
  id: string;
  title: string;
  meta?: string;
  keywords?: string[];
  group?: string;
};

export type CommandPaletteGroup = {
  id: string;
  label: string;
  items: CommandPaletteItem[];
};

export function matchCommandPaletteItem(item: CommandPaletteItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (item.title.toLowerCase().includes(q)) return true;
  if (item.meta?.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(q))) return true;
  return false;
}

export function filterCommandPaletteItems(
  items: ReadonlyArray<CommandPaletteItem>,
  query: string,
): CommandPaletteItem[] {
  return items.filter((item) => matchCommandPaletteItem(item, query));
}

export function groupCommandPaletteResults(
  items: ReadonlyArray<CommandPaletteItem>,
): CommandPaletteGroup[] {
  const hasGroups = items.some((item) => item.group);
  if (!hasGroups) {
    return items.length > 0 ? [{ id: 'default', label: '', items: [...items] }] : [];
  }

  const order: string[] = [];
  const buckets = new Map<string, CommandPaletteItem[]>();

  for (const item of items) {
    const label = item.group ?? 'Other';
    if (!buckets.has(label)) {
      buckets.set(label, []);
      order.push(label);
    }
    buckets.get(label)!.push(item);
  }

  return order.map((label) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    items: buckets.get(label)!,
  }));
}

export function flattenCommandPaletteGroups(
  groups: ReadonlyArray<CommandPaletteGroup>,
): CommandPaletteItem[] {
  return groups.flatMap((group) => group.items);
}

export function moveCommandPaletteActiveIndex(
  activeIndex: number,
  length: number,
  direction: 'up' | 'down',
): number {
  if (length <= 0) return -1;
  if (activeIndex < 0) return direction === 'down' ? 0 : length - 1;
  if (direction === 'down') return (activeIndex + 1) % length;
  return (activeIndex - 1 + length) % length;
}
