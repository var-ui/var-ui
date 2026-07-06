import type { JSX, ReactNode } from 'react';
import { alert, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'tip';
export type AlertAppearance = 'subtle' | 'solid';

/** Tone → registry glyph (spec §0.4): danger shares the `error` glyph, tip shares `info`. */
const variantIconName: Record<AlertVariant, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  tip: 'info',
};

export type AlertProps = {
  variant: AlertVariant;
  appearance?: AlertAppearance;
  title?: string;
  action?: { href: string; label: string };
  /** Override the default tone glyph; pass null to hide the icon slot. */
  icon?: ReactNode | null;
  children: ReactNode;
  className?: string;
};

export function Alert({
  variant,
  appearance = 'subtle',
  title,
  action,
  icon,
  children,
  className,
}: AlertProps): JSX.Element {
  const a = alert({
    tone: variant,
    appearance,
    contentGap: title ? 'spaced' : 'flush',
  });

  const resolvedIcon = icon === undefined ? <Icon name={variantIconName[variant]} /> : icon;

  return (
    <div
      className={cx(a.root, className)}
      data-alert
      data-alert-variant={variant}
      data-alert-appearance={appearance}
    >
      {resolvedIcon !== null ? (
        <div className={a.icon} data-alert-icon>
          {resolvedIcon}
        </div>
      ) : null}
      <div className={a.body}>
        {title ? <p className={a.title}>{title}</p> : null}
        <div className={a.content} data-alert-content>
          {children}
        </div>
        {action ? (
          <div className={a.action}>
            <a className={a.actionLink} href={action.href} data-alert-action>
              {action.label}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
