'use client';

import { Link, useRouterState } from '@tanstack/react-router';
import type { DocHeading } from '@/lib/extract-headings';
import { sidebar } from '@/data/navigation';
import { docsShell } from '@/styles/docsShell';

type DocsSidebarProps = {
  onNavigate?: () => void;
};

type SidebarSection = (typeof sidebar)[keyof typeof sidebar];

function getSidebarSection(pathname: string): SidebarSection {
  if (pathname.startsWith('/components')) return sidebar['/components'];
  if (pathname.startsWith('/theming')) return sidebar['/theming'];
  return sidebar['/docs'];
}

function isGroupedSidebar(section: SidebarSection): section is (typeof sidebar)['/components'] {
  return section.length > 0 && 'items' in section[0];
}

function isSidebarLinkActive(pathname: string, link: string) {
  if (link === '/docs' || link === '/components' || link === '/theming') {
    return pathname === link;
  }

  return pathname === link;
}

function SidebarLink({
  active,
  href,
  label,
  onNavigate,
}: {
  active: boolean;
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const shell = docsShell();

  return (
    <Link
      className={active ? shell.sidebarLinkActive : shell.sidebarLink}
      onClick={onNavigate}
      to={href}
    >
      {label}
    </Link>
  );
}

export function DocsSidebar({ onNavigate }: DocsSidebarProps) {
  const shell = docsShell();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const section = getSidebarSection(pathname);

  if (!isGroupedSidebar(section)) {
    return (
      <nav aria-label="Section" className={shell.sidebarInner}>
        <ul className={shell.sidebarList}>
          {section.map((item) => (
            <li key={item.link}>
              <SidebarLink
                active={isSidebarLinkActive(pathname, item.link)}
                href={item.link}
                label={item.text}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Section" className={shell.sidebarInner}>
      {section.map((group) => (
        <div className={shell.sidebarGroup} key={group.text}>
          <p className={shell.sidebarGroupLabel}>{group.text}</p>
          <ul className={shell.sidebarList}>
            {group.items.map((item) => (
              <li key={item.link}>
                <SidebarLink
                  active={isSidebarLinkActive(pathname, item.link)}
                  href={item.link}
                  label={item.text}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebarRail(props: DocsSidebarProps) {
  const shell = docsShell();

  return (
    <aside className={shell.sidebar}>
      <DocsSidebar {...props} />
    </aside>
  );
}

type DocsTocProps = {
  headings: DocHeading[];
};

export function DocsToc({ headings }: DocsTocProps) {
  const shell = docsShell();

  if (headings.length === 0) return null;

  return (
    <aside className={shell.toc}>
      <div className={shell.tocInner}>
        <p className={shell.tocTitle}>On this page</p>
        <ul className={shell.tocList}>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                className={
                  heading.level === 3 ? `${shell.tocLink} ${shell.tocLinkNested}` : shell.tocLink
                }
                href={`#${heading.id}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
