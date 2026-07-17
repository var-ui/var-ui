import type { JSX, ReactNode } from 'react';
import { alert, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { recipeProps } from './utils';

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
  /** Semantic tone that drives color and the default icon. */
  variant: AlertVariant;
  /** Surface treatment. @default subtle */
  appearance?: AlertAppearance;
  /** Optional bold headline above the body content. */
  title?: string;
  /** Optional text link rendered below the message body. */
  action?: { href: string; label: string };
  /** Override the default tone glyph; pass null to hide the icon slot. */
  icon?: ReactNode | null;
  /** Message body. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
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
      {...recipeProps(a.root, className)}
      data-alert
      data-alert-variant={variant}
      data-alert-appearance={appearance}
    >
      {resolvedIcon !== null ? (
        <div {...recipeProps(a.icon)} data-alert-icon>
          {resolvedIcon}
        </div>
      ) : null}
      <div {...recipeProps(a.body)}>
        {title ? <p {...recipeProps(a.title)}>{title}</p> : null}
        <div {...recipeProps(a.content)} data-alert-content>
          {children}
        </div>
        {action ? (
          <div {...recipeProps(a.action)}>
            <a {...recipeProps(a.actionLink)} href={action.href} data-alert-action>
              {action.label}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
