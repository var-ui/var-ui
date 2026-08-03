import { CodeBlock, type CodeBlockProps } from '@var-ui/react';
import { highlightCodeBlockContent } from '@/lib/highlightCodeBlock';

export function HighlightedCodeBlock(props: CodeBlockProps) {
  const { code, language, showLineNumbers, ...rest } = props;
  const highlighted = highlightCodeBlockContent(code, language, { showLineNumbers });

  return (
    <CodeBlock
      code={code}
      language={language}
      showLineNumbers={showLineNumbers}
      {...highlighted}
      {...rest}
    />
  );
}
