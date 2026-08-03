import { highlightCode, highlightCodeClassName } from './highlightCode';

export type HighlightedCodeBlockContent = {
  codeHtml?: string;
  codeClassName?: string;
  lineHtml?: string[];
};

/** Build pre-highlighted HTML for `CodeBlock` from plain source. */
export function highlightCodeBlockContent(
  code: string,
  language?: string,
  options?: { showLineNumbers?: boolean },
): HighlightedCodeBlockContent {
  if (!language) return {};

  if (options?.showLineNumbers) {
    const lines = code.replace(/\n$/, '').split('\n');
    return { lineHtml: lines.map((line) => highlightCode(line, language) || '&nbsp;') };
  }

  return {
    codeHtml: highlightCode(code, language),
    codeClassName: highlightCodeClassName(language),
  };
}
