import type { JSX, ReactNode } from 'react';
import { chatSystemMessage } from '@var-ui/core';
import { cx } from '../utils';

export type ChatSystemMessageTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type ChatSystemMessageProps = {
  /** Semantic tone. @default neutral */
  tone?: ChatSystemMessageTone;
  /** Optional leading icon — pass an `<Icon name="…" />`. */
  icon?: ReactNode;
  /** Message text. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Centered inline system message — presence updates, mode switches, etc.
 *
 * ```tsx
 * <ChatSystemMessage tone="info">Model switched to GPT-5</ChatSystemMessage>
 * ```
 */
export function ChatSystemMessage({
  tone = 'neutral',
  icon,
  children,
  className,
}: ChatSystemMessageProps): JSX.Element {
  const s = chatSystemMessage({ tone });
  return (
    <div className={cx(s.root, className)} role="status">
      {icon ? <span className={s.icon}>{icon}</span> : null}
      <span className={s.text}>{children}</span>
    </div>
  );
}
