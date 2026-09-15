import { describe, expect, it } from 'vite-plus/test';
import { transformMdx } from './transform-mdx';

const snippets = {
  'button.default': {
    react: "import { Button } from '@var-ui/react';\n\n<Button>Click me</Button>",
  },
};

describe('transformMdx', () => {
  it('strips frontmatter into title and description', () => {
    const result = transformMdx({
      source: '---\ntitle: Button\ndescription: Triggers an action.\n---\n\n# Button\n',
      snippets,
      props: [],
      filePath: 'button.mdx',
    });
    expect(result.title).toBe('Button');
    expect(result.description).toBe('Triggers an action.');
    expect(result.markdown).toContain('# Button');
    expect(result.markdown).not.toContain('---');
  });

  it('replaces Demo tags with fenced snippets and preserves other fences', () => {
    const result = transformMdx({
      source: '# Button\n\n```tsx\n<DesignSystemProvider />\n```\n\n<Demo id="button.default" />\n',
      snippets,
      props: [],
      filePath: 'button.mdx',
    });
    expect(result.markdown).toContain('```tsx\n<DesignSystemProvider />\n```');
    expect(result.markdown).toContain('<Button>Click me</Button>');
    expect(result.markdown).not.toContain('<Demo');
  });

  it('throws when a Demo id has no snippets', () => {
    expect(() =>
      transformMdx({
        source: '<Demo id="missing.default" />',
        snippets,
        props: [],
        filePath: 'button.mdx',
      }),
    ).toThrow(/missing\.default/);
  });

  it('renders PropsTable from props and omits it when empty', () => {
    const withProps = transformMdx({
      source: '<PropsTable slug="button" />',
      snippets,
      props: [{ name: 'intent', type: 'string', required: false, default: 'primary' }],
      filePath: 'button.mdx',
    });
    expect(withProps.markdown).toContain('| intent |');
    const empty = transformMdx({
      source: '<PropsTable slug="button" />',
      snippets,
      props: [],
      filePath: 'button.mdx',
    });
    expect(empty.markdown).not.toContain('| intent |');
  });

  it('replaces allowlisted widgets and leaves other JSX', () => {
    const result = transformMdx({
      source: '<ColorSwatches />\n\n<Form onSubmit={() => {}}>\n',
      snippets,
      props: [],
      filePath: 'colors.mdx',
    });
    expect(result.markdown).toContain('_Interactive widget — see the HTML docs page._');
    expect(result.markdown).not.toContain('<ColorSwatches');
    expect(result.markdown).toContain('<Form onSubmit={() => {}}>');
  });
});
