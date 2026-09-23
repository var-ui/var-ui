import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { codeBlock } from '@var-ui/core';
import { Icon } from '../icons';
import { combine, cx, mergeProps } from './utils';

type CodeBlockVariant = 'default' | 'inline' | 'diff' | 'terminal';
type FeedbackTone = 'success' | 'error' | null;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type CodeBlockProps = {
  /** Source code string to display and copy. */
  code: string;
  /** Language tag shown in the header (e.g. `tsx`, `bash`). */
  language?: string;
  /** Pre-highlighted HTML for the code body. Pair with `codeClassName` from your highlighter. */
  codeHtml?: string;
  /** Classes for the highlighted `<code>` element (e.g. `hljs language-tsx`). */
  codeClassName?: string;
  /** Pre-highlighted HTML per line when `showLineNumbers` is enabled. */
  lineHtml?: string[];
  /** Optional filename shown in the header. */
  filename?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Whether to show the copy-to-clipboard button. @default true */
  copyable?: boolean;
  /** Visual variant of the code block. @default default */
  variant?: CodeBlockVariant;
  /** Wrap long lines instead of horizontal scrolling. @default false */
  wrapLongLines?: boolean;
  /** Show line numbers in a gutter column. @default false */
  showLineNumbers?: boolean;
  /** 1-based line numbers to highlight. */
  highlightedLines?: number[];
  /** Accessible label for the copy button. @default Copy code */
  copyLabel?: string;
  /** Feedback text after a successful copy. @default Copied */
  copiedLabel?: string;
  /** Feedback text when clipboard write fails. @default Copy failed */
  copyErrorLabel?: string;
};

export function CodeBlock({
  code,
  language,
  codeHtml,
  codeClassName: highlightedCodeClassName,
  lineHtml,
  filename,
  className,
  copyable = true,
  variant = 'default',
  wrapLongLines = false,
  showLineNumbers = false,
  highlightedLines = [],
  copyLabel = 'Copy code',
  copiedLabel = 'Copied',
  copyErrorLabel = 'Copy failed',
}: CodeBlockProps): JSX.Element {
  const cb = codeBlock();
  const variantRootClass: Record<CodeBlockVariant, string> = {
    default: cb.rootDefault.className,
    inline: cb.rootInline.className,
    diff: cb.rootDiff.className,
    terminal: cb.rootTerminal.className,
  };

  const [isCopied, setIsCopied] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>(null);

  const highlightedSet = useMemo(() => new Set(highlightedLines), [highlightedLines]);
  const lines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code]);
  const terminal = variant === 'terminal';
  const inline = variant === 'inline';
  const useHighlightedHtml = Boolean(codeHtml || lineHtml) && !terminal;
  const resolvedCodeClassName = cx(cb.code.className, highlightedCodeClassName);

  const feedbackClassName = cx(
    cb.feedback.className,
    cb.feedbackInline.className,
    feedbackTone === 'success' && cb.feedbackSuccess.className,
    feedbackTone === 'error' && cb.feedbackError.className,
  );

  const resetCopyState = () => {
    setIsCopied(false);
    setHasError(false);
    setFeedbackText('');
    setFeedbackTone(null);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setHasError(false);
      // Button label already reads "Copied"; skip inline feedback when labels match.
      setFeedbackText(copiedLabel === 'Copied' ? '' : copiedLabel);
      setFeedbackTone(copiedLabel === 'Copied' ? null : 'success');
    } catch {
      setIsCopied(false);
      setHasError(true);
      setFeedbackText(copyErrorLabel);
      setFeedbackTone('error');
    }

    setTimeout(resetCopyState, 1200);
  };

  if (inline) {
    return (
      <code
        {...mergeProps(cb.root, cx(variantRootClass[variant], cb.code.className, className))}
        data-codeblock
      >
        {code}
      </code>
    );
  }

  return (
    <div {...mergeProps(cb.root, cx(variantRootClass[variant], className))} data-codeblock>
      <div
        {...mergeProps(cb.header, cx(terminal && cb.headerTerminal.className))}
        data-codeblock-header
      >
        <div {...mergeProps(cb.title)}>
          {filename ? <span {...mergeProps(cb.filename)}>{filename}</span> : null}
          {language ? (
            <span {...mergeProps(cb.language, cx(terminal && cb.languageTerminal.className))}>
              {language}
            </span>
          ) : null}
        </div>
        {copyable ? (
          <div {...mergeProps(cb.actions)}>
            <button
              type="button"
              {...combine(
                cb.copyButton,
                !isCopied && !hasError && cb.copyButtonIdle,
                isCopied && cb.copyButtonCopied,
                hasError && cb.copyButtonError,
              )}
              data-copied={isCopied || undefined}
              data-error={hasError || undefined}
              onClick={onCopy}
              aria-label={isCopied ? copiedLabel : copyLabel}
            >
              <Icon name={isCopied ? 'check' : 'copy'} size="sm" />
              {isCopied ? 'Copied' : hasError ? 'Error' : 'Copy'}
            </button>
            <span className={feedbackClassName} role="status" aria-live="polite">
              {feedbackText}
            </span>
          </div>
        ) : null}
      </div>

      <div
        {...mergeProps(
          cb.body,
          cx(cb.bodyScrollable.className, terminal && cb.bodyTerminal.className),
        )}
        data-codeblock-body
      >
        <pre
          {...mergeProps(
            cb.pre,
            cx(
              wrapLongLines ? cb.preWrap.className : cb.preScrollX.className,
              terminal && cb.preTerminal.className,
            ),
          )}
          data-codeblock-pre
        >
          {showLineNumbers ? (
            <code {...mergeProps(cb.code, cb.lines.className)}>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const lineContentHtml = lineHtml?.[index];
                return (
                  <span
                    key={lineNumber}
                    {...mergeProps(
                      cb.line,
                      cx(highlightedSet.has(lineNumber) && cb.lineHighlighted.className),
                    )}
                  >
                    <span {...mergeProps(cb.lineNumber)} aria-hidden="true">
                      {lineNumber}
                    </span>
                    <span
                      {...mergeProps(cb.lineContent)}
                      {...(lineContentHtml
                        ? { dangerouslySetInnerHTML: { __html: lineContentHtml } }
                        : { children: line || ' ' })}
                    />
                  </span>
                );
              })}
            </code>
          ) : useHighlightedHtml ? (
            <code
              {...mergeProps(cb.code, resolvedCodeClassName)}
              dangerouslySetInnerHTML={{ __html: codeHtml! }}
            />
          ) : (
            <code {...mergeProps(cb.code)}>{escapeHtml(code)}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
