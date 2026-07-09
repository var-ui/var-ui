import type { JSX, ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { banner, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

const toneIcon: Record<BannerTone, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

export type BannerProps = {
  /** Semantic tone that drives color and the default icon. @default info */
  tone?: BannerTone;
  /** Surface treatment. @default subtle */
  appearance?: 'subtle' | 'solid';
  /** Optional bold headline shown before the body text. */
  title?: string;
  /** Override the default tone glyph; pass null to hide the icon slot. */
  icon?: ReactNode | null;
  /** Inline action elements (links, small buttons). */
  actions?: ReactNode;
  /** When provided, renders a dismiss button that calls this handler on press. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default Dismiss */
  dismissLabel?: string;
  /** Announcement body text. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Full-width page announcement with tone icon, actions, and optional dismiss.
 *
 * ```tsx
 * <Banner tone="warning" title="Scheduled maintenance" onDismiss={hide}>
 *   Sunday 02:00–04:00 UTC.
 * </Banner>
 * ```
 */
export function Banner({
  tone = 'info',
  appearance = 'subtle',
  title,
  icon,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  children,
  className,
}: BannerProps): JSX.Element {
  const b = banner({ tone, appearance });
  const glyph = icon === undefined ? <Icon name={toneIcon[tone]} /> : icon;
  return (
    <div
      className={cx(b.root, className)}
      role={tone === 'warning' || tone === 'danger' ? 'alert' : 'status'}
    >
      {glyph !== null ? <span className={b.icon}>{glyph}</span> : null}
      <div className={b.content}>
        {title ? <span className={b.title}>{title}</span> : null}
        <span>{children}</span>
      </div>
      {actions ? <div className={b.actions}>{actions}</div> : null}
      {onDismiss ? (
        <AriaButton className={b.dismiss} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </div>
  );
}
