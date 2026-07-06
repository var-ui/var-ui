import type { JSX } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { thumbnail } from '@var-ui/core';
import { Icon } from '../icons';
import { cx } from './utils';

export type ThumbnailProps = {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

/**
 * Attachment/media preview tile with an optional remove button.
 *
 * ```tsx
 * <Thumbnail src={file.previewUrl} alt={file.name} onDismiss={() => remove(file)} />
 * ```
 */
export function Thumbnail({
  src,
  alt,
  size = 'md',
  onDismiss,
  dismissLabel = 'Remove',
  className,
}: ThumbnailProps): JSX.Element {
  const s = thumbnail({ size });
  return (
    <span className={cx(s.root, className)}>
      <img className={s.image} src={src} alt={alt} />
      {onDismiss ? (
        <AriaButton className={s.dismiss} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </span>
  );
}
