import { thumbnail } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const PREVIEW_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%236c8"/%3E%3C/svg%3E';

function serializeVoidTag(
  tag: string,
  props: Record<string, string | boolean | undefined>,
): string {
  const attrs = Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => {
      const name = key === 'className' ? 'class' : key;
      if (value === true) return name;
      return `${name}="${String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    })
    .join(' ');
  return attrs ? `<${tag} ${attrs} />` : `<${tag} />`;
}

export function render(): string {
  const s = thumbnail({ size: 'md' });
  const image = serializeVoidTag('img', {
    ...recipeProps(s.image),
    src: PREVIEW_URL,
    alt: 'Preview image',
  });
  return serializeHtmlTag('span', recipeProps(s.root), image);
}
