export type TransformPropRow = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
};

export type TransformMdxInput = {
  source: string;
  snippets: Record<string, { react: string; astro?: string; html?: string }>;
  props: TransformPropRow[];
  filePath: string;
};

export type TransformMdxResult = {
  title: string;
  description: string;
  markdown: string;
};

const FENCE_RE = /(```[\s\S]*?```)/g;
const DEMO_RE = /<Demo\s+id=["']([^"']+)["']\s*\/>/g;
const PROPS_TABLE_RE = /<PropsTable\s+slug=["'][^"']+["']\s*\/>/g;
const WIDGET_RE = /<(CssVariableReference|ColorSwatches|ShadowSwatches)\s*\/>/g;
const WIDGET_PLACEHOLDER = '_Interactive widget — see the HTML docs page._';

export function transformMdx(input: TransformMdxInput): TransformMdxResult {
  const { title, description, markdown: body } = parseFrontmatter(input.source);
  const markdown = transformSegments(body, input);
  return { title, description, markdown };
}

function parseFrontmatter(source: string): TransformMdxResult {
  if (!source.startsWith('---')) {
    return { title: '', description: '', markdown: source };
  }

  const closeIndex = source.indexOf('\n---', 3);
  if (closeIndex === -1) {
    return { title: '', description: '', markdown: source };
  }

  const frontmatter = source.slice(4, closeIndex);
  const markdown = source.slice(closeIndex + 4);

  let title = '';
  let description = '';
  for (const line of frontmatter.split('\n')) {
    if (line.startsWith('title:')) {
      title = line.slice('title:'.length).trim();
    } else if (line.startsWith('description:')) {
      description = line.slice('description:'.length).trim();
    }
  }

  return { title, description, markdown };
}

function transformSegments(markdown: string, input: TransformMdxInput): string {
  return markdown
    .split(FENCE_RE)
    .map((part, index) => (index % 2 === 1 ? part : transformProse(part, input)))
    .join('');
}

function transformProse(segment: string, input: TransformMdxInput): string {
  const withDemos = segment.replace(DEMO_RE, (_match, id: string) => {
    const snippet = input.snippets[id];
    if (!snippet) {
      throw new Error(`${input.filePath}: missing snippets for Demo id "${id}"`);
    }
    return renderDemoFences(snippet);
  });

  const withProps = withDemos.replace(PROPS_TABLE_RE, () => renderPropsTable(input.props));

  return withProps.replace(WIDGET_RE, WIDGET_PLACEHOLDER);
}

function renderDemoFences(snippet: { react: string; astro?: string; html?: string }): string {
  const fences = [fence('tsx', snippet.react)];
  if (snippet.astro) fences.push(fence('astro', snippet.astro));
  if (snippet.html) fences.push(fence('html', snippet.html));
  return fences.join('\n\n');
}

function fence(lang: string, code: string): string {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

function renderPropsTable(props: TransformPropRow[]): string {
  if (props.length === 0) return '';

  const header = '| Name | Type | Required | Default | Description |';
  const separator = '| --- | --- | --- | --- | --- |';
  const rows = props.map(
    (prop) =>
      `| ${prop.name} | ${prop.type} | ${prop.required ? 'yes' : 'no'} | ${prop.default ?? ''} | ${prop.description ?? ''} |`,
  );
  return [header, separator, ...rows].join('\n');
}
