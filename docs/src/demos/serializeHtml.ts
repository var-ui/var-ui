type HtmlAttrValue = string | boolean | undefined;

function toHtmlAttrName(key: string): string {
  return key === 'className' ? 'class' : key;
}

/** Serialize a tag + attrs (from recipeProps) into an HTML element string. */
export function serializeHtmlTag(
  tag: string,
  props: Record<string, HtmlAttrValue>,
  children: string,
): string {
  const attrs = Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => {
      const name = toHtmlAttrName(key);
      if (value === true) return name;
      return `${name}="${String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    })
    .join(' ');

  return attrs ? `<${tag} ${attrs}>${children}</${tag}>` : `<${tag}>${children}</${tag}>`;
}
