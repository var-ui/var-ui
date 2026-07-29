import type { CSSProperties, JSX, ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link as AriaLink } from 'react-aria-components';
import { positionTocIndicator, toc as tocStyles, type TocHeading } from '@var-ui/core';
import { useTocSpy } from '../hooks/useTocSpy';
import { recipeProps } from './utils';

export type TocItemProps = {
  label: string;
  href: string;
  isSelected?: boolean;
  isNested?: boolean;
  className?: string;
};

/** Anchor row for one heading in a `Toc` list. */
export function TocItem({
  label,
  href,
  isSelected = false,
  isNested = false,
  className,
}: TocItemProps): JSX.Element {
  const s = tocStyles();

  return (
    <li {...recipeProps(s.item)} data-nested={isNested || undefined}>
      <AriaLink
        href={href}
        {...recipeProps(s.link, className)}
        {...(isSelected ? { 'data-selected': '' } : {})}
        aria-current={isSelected ? 'location' : undefined}
      >
        {label}
      </AriaLink>
    </li>
  );
}

export type TocProps = {
  /** Visible section label above the list. @default 'On this page' */
  title?: ReactNode;
  /** Manual `Toc.Item` children. Omit when using `auto`. */
  children?: ReactNode;
  /** Scan a content root for `h2`/`h3` headings with ids. */
  auto?: boolean;
  contentSelector?: string;
  headingSelector?: string;
  minHeadings?: number;
  headerOffset?: number;
  /** Hide the nav below the `xl` breakpoint. @default false */
  hideBelowXl?: boolean;
  /** Sets `--var-ui-toc-sticky-top` on the root. */
  stickyTop?: string;
  className?: string;
  /** Accessible name for the nav landmark. @default title or 'On this page' */
  label?: string;
};

function TocList({
  headings,
  activeId,
  children,
  listRef,
}: {
  headings?: TocHeading[];
  activeId?: string | null;
  children?: ReactNode;
  listRef: React.RefObject<HTMLOListElement>;
}): JSX.Element {
  const s = tocStyles();

  return (
    <ol ref={listRef} {...recipeProps(s.list)}>
      <span {...recipeProps(s.indicator)} data-toc-indicator aria-hidden="true" />
      {children ??
        (headings ?? []).map((heading) => (
          <TocItem
            key={heading.id}
            label={heading.text}
            href={`#${heading.id}`}
            isNested={heading.level === 3}
            isSelected={heading.id === activeId}
          />
        ))}
    </ol>
  );
}

/**
 * In-page table of contents for long docs. Compose manual items or enable `auto`
 * to scan a content root for heading anchors.
 */
export function Toc({
  title = 'On this page',
  children,
  auto = false,
  contentSelector,
  headingSelector,
  minHeadings = 2,
  headerOffset,
  hideBelowXl = false,
  stickyTop,
  className,
  label,
}: TocProps): JSX.Element | null {
  const listRef = useRef<HTMLOListElement>(null);
  const [contentRoot, setContentRoot] = useState<ParentNode | null>(null);

  useEffect(() => {
    if (!auto || !contentSelector) {
      setContentRoot(null);
      return;
    }
    setContentRoot(document.querySelector(contentSelector));
  }, [auto, contentSelector]);

  const { headings, activeId } = useTocSpy(auto ? contentRoot : null, {
    headingSelector,
    minHeadings,
    headerOffset,
  });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeLink = list.querySelector<HTMLAnchorElement>('[data-selected]');
    positionTocIndicator(list, activeLink);
  }, [activeId, headings, children]);

  const s = tocStyles({ hideBelow: hideBelowXl ? 'xl' : 'none' });
  const resolvedLabel = label ?? (typeof title === 'string' ? title : 'On this page');
  const rootStyle = stickyTop
    ? ({ '--var-ui-toc-sticky-top': stickyTop } as CSSProperties)
    : undefined;

  if (auto && headings.length < minHeadings) {
    return null;
  }

  return (
    <nav aria-label={resolvedLabel} style={rootStyle} {...recipeProps(s.root, className)}>
      {title != null ? <p {...recipeProps(s.title)}>{title}</p> : null}
      <TocList listRef={listRef} headings={auto ? headings : undefined} activeId={activeId}>
        {children}
      </TocList>
    </nav>
  );
}

Toc.Item = TocItem;
