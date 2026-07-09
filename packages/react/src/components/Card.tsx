import type { AnchorHTMLAttributes, HTMLAttributes, JSX } from 'react';
import { card } from '@var-ui/core';
import { cx } from './utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional heading rendered above the body. */
  title?: string;
};

/**
 * Static content surface with an optional title.
 *
 * ```tsx
 * <Card title="Usage">1.2M requests this month.</Card>
 * ```
 */
export function Card({ title, className, children, ...props }: CardProps): JSX.Element {
  const c = card();
  return (
    <div {...props} className={cx(c.root, className)}>
      {title ? <h3 className={c.title}>{title}</h3> : null}
      <div className={c.body}>{children}</div>
    </div>
  );
}

export type ClickableCardProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Card headline. */
  title: string;
  /** Supporting copy below the title. */
  description?: string;
  /** Trailing hint line (e.g. reading time, "Learn more →"). */
  hint?: string;
};

/**
 * Whole-card link surface (navigation cards, doc tiles).
 *
 * ```tsx
 * <ClickableCard href="/docs/theming" title="Theming" description="Override any token." hint="5 min read" />
 * ```
 */
export function ClickableCard({
  title,
  description,
  hint,
  className,
  ...props
}: ClickableCardProps): JSX.Element {
  const c = card();
  return (
    <a {...props} className={cx(c.root, c.linkRoot, className)}>
      <span className={c.linkTitle}>{title}</span>
      {description ? <p className={c.linkDescription}>{description}</p> : null}
      {hint ? <span className={c.linkHint}>{hint}</span> : null}
    </a>
  );
}
