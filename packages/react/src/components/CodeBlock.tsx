import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { codeBlock } from '@var-ui/core';
import { cx } from './utils';

type CodeBlockVariant = 'default' | 'inline' | 'diff' | 'terminal';
type FeedbackTone = 'success' | 'error' | null;

export type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  copyable?: boolean;
  variant?: CodeBlockVariant;
  wrapLongLines?: boolean;
  showLineNumbers?: boolean;
  highlightedLines?: number[];
  copyLabel?: string;
  copiedLabel?: string;
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
    default: cb.rootDefault,
    inline: cb.rootInline,
    diff: cb.rootDiff,
    terminal: cb.rootTerminal,
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
    cb.feedback,
    cb.feedbackInline,
    feedbackTone === 'success' && cb.feedbackSuccess,
    feedbackTone === 'error' && cb.feedbackError,
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
      <code className={cx(cb.root, variantRootClass[variant], cb.code, className)} data-codeblock>
        {code}
      </code>
    );
  }

  return (
    <div className={cx(cb.root, variantRootClass[variant], className)} data-codeblock>
      <div className={cx(cb.header, terminal && cb.headerTerminal)} data-codeblock-header>
        <div className={cb.title}>
          {filename ? <span className={cb.filename}>{filename}</span> : null}
          {language ? (
            <span className={cx(cb.language, terminal && cb.languageTerminal)}>{language}</span>
          ) : null}
        </div>
        {copyable ? (
          <div className={cb.actions}>
            <button
              type="button"
              className={cx(
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
              {isCopied ? 'Copied' : hasError ? 'Error' : 'Copy'}
            </button>
            <span className={feedbackClassName} role="status" aria-live="polite">
              {feedbackText}
            </span>
          </div>
        ) : null}
      </div>

      <div
        className={cx(cb.body, cb.bodyScrollable, terminal && cb.bodyTerminal)}
        data-codeblock-body
      >
        <pre
          className={cx(
            cb.pre,
            wrapLongLines ? cb.preWrap : cb.preScrollX,
            terminal && cb.preTerminal,
          )}
          data-codeblock-pre
        >
          {showLineNumbers ? (
            <code className={cx(cb.code, cb.lines)}>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                return (
                  <span
                    key={lineNumber}
                    className={cx(cb.line, highlightedSet.has(lineNumber) && cb.lineHighlighted)}
                  >
                    <span className={cb.lineNumber} aria-hidden="true">
                      {lineNumber}
                    </span>
                    <span className={cb.lineContent}>{line || ' '}</span>
                  </span>
                );
              })}
            </code>
          ) : (
            <code className={cb.code}>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
