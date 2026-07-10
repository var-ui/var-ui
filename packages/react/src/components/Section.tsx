import type { HTMLAttributes, JSX } from 'react';
import { section } from '@var-ui/core';
import { cx } from './utils';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Optional heading rendered as an h2 inside the section. */
  title?: string;
};

/**
 * Bordered surface region with an optional heading.
 *
 * ```tsx
 * <Section title="Feedback">{demos}</Section>
 * ```
 */
export function Section({ title, className, children, ...props }: SectionProps): JSX.Element {
  const s = section();
  return (
    <section {...props} className={cx(s.root, className)}>
      {title ? <h2 className={s.title}>{title}</h2> : null}
      {children}
    </section>
  );
}
