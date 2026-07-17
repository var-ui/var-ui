import type { AnchorHTMLAttributes, HTMLAttributes, JSX } from 'react';
import { card } from '@var-ui/core';
import { cx, recipeProps } from './utils';

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
    <div {...props} {...recipeProps(c.root, className)}>
      {title ? <h3 {...recipeProps(c.title)}>{title}</h3> : null}
      <div {...recipeProps(c.body)}>{children}</div>
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
      <span {...recipeProps(c.linkTitle)}>{title}</span>
      {description ? <p {...recipeProps(c.linkDescription)}>{description}</p> : null}
      {hint ? <span {...recipeProps(c.linkHint)}>{hint}</span> : null}
    </a>
  );
}
