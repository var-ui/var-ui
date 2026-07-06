import type { JSX, ReactNode } from 'react';
import { Children, useState } from 'react';
import { avatar, avatarGroup, statusDot } from '@var-ui/core';
import { cx } from './utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  src?: string;
  alt?: string;
  /** Display name — initials fallback uses the first letter of the first two words. */
  name?: string;
  size?: AvatarSize;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('');
}

/**
 * Image avatar with initials fallback and optional presence dot.
 *
 * ```tsx
 * <Avatar src={user.photo} name={user.name} status="success" />
 * ```
 */
export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
}: AvatarProps): JSX.Element {
  const [errored, setErrored] = useState(false);
  const a = avatar({ size });
  const showImage = Boolean(src) && !errored;
  return (
    <span className={cx(a.root, className)}>
      {showImage ? (
        <img
          className={a.image}
          src={src}
          alt={alt ?? name ?? ''}
          onError={() => setErrored(true)}
        />
      ) : (
        <span
          className={a.initials}
          aria-hidden={alt || name ? undefined : true}
          role={alt || name ? 'img' : undefined}
          aria-label={alt ?? name}
        >
          {name ? initialsOf(name) : '?'}
        </span>
      )}
      {status ? (
        <span className={a.status} data-avatar-status>
          <span className={statusDot({ tone: status })} />
        </span>
      ) : null}
    </span>
  );
}

export type AvatarGroupProps = {
  children: ReactNode;
  /** Maximum avatars before collapsing into a "+N" chip. */
  max?: number;
  className?: string;
};

/**
 * Overlapping stack of avatars with overflow count.
 *
 * ```tsx
 * <AvatarGroup max={3}>{users.map(u => <Avatar key={u.id} name={u.name} />)}</AvatarGroup>
 * ```
 */
export function AvatarGroup({ children, max = 4, className }: AvatarGroupProps): JSX.Element {
  const g = avatarGroup();
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;
  return (
    <span className={cx(g.root, className)}>
      {visible.map((child, index) => (
        <span className={g.item} key={index}>
          {child}
        </span>
      ))}
      {hidden > 0 ? <span className={g.overflow}>+{hidden}</span> : null}
    </span>
  );
}
