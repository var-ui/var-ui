import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { codeBlock } from '@var-ui/core';
import { Icon } from '../icons';
import { cx, recipeClassName, recipeProps } from './utils';

type CodeBlockVariant = 'default' | 'inline' | 'diff' | 'terminal';
type FeedbackTone = 'success' | 'error' | null;

export type CodeBlockProps = {
  /** Source code string to display. */
  code: string;
  /** Language tag shown in the header (e.g. `tsx`, `bash`). */
  language?: string;
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
    default: recipeClassName(cb.rootDefault),
    inline: recipeClassName(cb.rootInline),
    diff: recipeClassName(cb.rootDiff),
    terminal: recipeClassName(cb.rootTerminal),
  };

  const [isCopied, setIsCopied] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>(null);

  const highlightedSet = useMemo(() => new Set(highlightedLines), [highlightedLines]);
  const lines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code]);
  const terminal = variant === 'terminal';
  const inline = variant === 'inline';

  const feedbackClassName = cx(
    recipeClassName(cb.feedback),
    recipeClassName(cb.feedbackInline),
    feedbackTone === 'success' && recipeClassName(cb.feedbackSuccess),
    feedbackTone === 'error' && recipeClassName(cb.feedbackError),
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
      setFeedbackText(copiedLabel);
      setFeedbackTone('success');
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
        {...recipeProps(
          cb.root,
          cx(variantRootClass[variant], recipeClassName(cb.code), className),
        )}
        data-codeblock
      >
        {code}
      </code>
    );
  }

  return (
    <div {...recipeProps(cb.root, cx(variantRootClass[variant], className))} data-codeblock>
      <div
        {...recipeProps(cb.header, cx(terminal && recipeClassName(cb.headerTerminal)))}
        data-codeblock-header
      >
        <div {...recipeProps(cb.title)}>
          {filename ? <span {...recipeProps(cb.filename)}>{filename}</span> : null}
          {language ? (
            <span
              {...recipeProps(cb.language, cx(terminal && recipeClassName(cb.languageTerminal)))}
            >
              {language}
            </span>
          ) : null}
        </div>
        {copyable ? (
          <div {...recipeProps(cb.actions)}>
            <button
              type="button"
              {...recipeProps(
                cb.copyButton,
                cx(
                  !isCopied && !hasError && recipeClassName(cb.copyButtonIdle),
                  isCopied && recipeClassName(cb.copyButtonCopied),
                  hasError && recipeClassName(cb.copyButtonError),
                ),
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
        {...recipeProps(
          cb.body,
          cx(recipeClassName(cb.bodyScrollable), terminal && recipeClassName(cb.bodyTerminal)),
        )}
        data-codeblock-body
      >
        <pre
          {...recipeProps(
            cb.pre,
            cx(
              wrapLongLines ? recipeClassName(cb.preWrap) : recipeClassName(cb.preScrollX),
              terminal && recipeClassName(cb.preTerminal),
            ),
          )}
          data-codeblock-pre
        >
          {showLineNumbers ? (
            <code {...recipeProps(cb.code, recipeClassName(cb.lines))}>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                return (
                  <span
                    key={lineNumber}
                    {...recipeProps(
                      cb.line,
                      cx(highlightedSet.has(lineNumber) && recipeClassName(cb.lineHighlighted)),
                    )}
                  >
                    <span {...recipeProps(cb.lineNumber)} aria-hidden="true">
                      {lineNumber}
                    </span>
                    <span {...recipeProps(cb.lineContent)}>{line || ' '}</span>
                  </span>
                );
              })}
            </code>
          ) : (
            <code {...recipeProps(cb.code)}>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
