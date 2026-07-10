export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function extractHeadings(content: string): DocHeading[] {
  const headings: DocHeading[] = [];

  for (const line of content.split('\n')) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      headings.push({ id: slugify(h2[1]), text: h2[1], level: 2 });
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      headings.push({ id: slugify(h3[1]), text: h3[1], level: 3 });
    }
  }

  return headings;
}
