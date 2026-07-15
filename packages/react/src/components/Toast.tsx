import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { toast as toastRecipe, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { cx } from './utils';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';
export type ToastContentData = {
  title: string;
  description?: string;
  tone?: ToastTone;
};
export type ToastPlacement = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';

const toneIcon: Record<ToastTone, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

const DEFAULT_DURATION = 4000;
const DEFAULT_MAX = 3;

type ToastSlot = 'region' | 'item' | 'icon' | 'body' | 'title' | 'description' | 'close';
type ToastRecipeFn = (args?: {
  tone?: ToastTone;
  placement?: ToastPlacement;
}) => Record<ToastSlot, string>;
// `toast` resolves to `styles`'s dimensioned-variant overload at the type level (returns `string`)
// instead of its slot overload, even though it returns a per-slot class map at runtime — see
// packages/core/src/components/toast.ts. Recast until that recipe's overload resolution is fixed upstream.
const toastSlots = toastRecipe as unknown as ToastRecipeFn;

type ToastContextValue = {
  queue: UNSTABLE_ToastQueue<ToastContentData>;
  placement: ToastPlacement;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProps = {
  /** Semantic tone that drives color and the default icon. @default info */
  tone?: ToastTone;
  /** Bold headline shown in the toast body. */
  title: string;
  /** Supporting copy shown below the title. */
  description?: string;
  /** When provided, renders a dismiss button that calls this handler on press. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default Dismiss */
  dismissLabel?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Presentational toast chrome, usable standalone or inside a `ToastRegion` render prop.
 *
 * ```tsx
 * <Toast tone="success" title="Saved" description="Draft stored." onDismiss={hide} />
 * ```
 */
export function Toast({
  tone = 'info',
  title,
  description,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
}: ToastProps): JSX.Element {
  const t = toastSlots({ tone });
  return (
    <div className={cx(t.item, className)} role="status">
      <span className={t.icon}>
        <Icon name={toneIcon[tone]} />
      </span>
      <div className={t.body}>
        <div className={t.title}>{title}</div>
        {description ? <div className={t.description}>{description}</div> : null}
      </div>
      {onDismiss ? (
        <AriaButton className={t.close} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </div>
  );
}

export type ToastRegionProps = {
  /** The toast queue to display. Construct one with `new ToastQueue()` for a declarative, provider-free setup. */
  queue: UNSTABLE_ToastQueue<ToastContentData>;
  /** Screen corner the region anchors to. @default bottom-end */
  placement?: ToastPlacement;
  /** Additional CSS class names merged onto the region element. */
  className?: string;
};

/**
 * Renders the live queue of toasts anchored to a screen corner. Always bound to a queue —
 * either one owned by `ToastProvider` or one constructed and passed in directly.
 */
export function ToastRegion({
  queue,
  placement = 'bottom-end',
  className,
}: ToastRegionProps): JSX.Element {
  const { style: layerStyle } = useLayer();
  const region = toastSlots({ placement });
  return (
    <AriaToastRegion queue={queue} className={cx(region.region, className)} style={layerStyle}>
      {({ toast: queued }) => {
        const tone = queued.content.tone ?? 'info';
        const t = toastSlots({ tone });
        return (
          <AriaToast toast={queued} className={t.item}>
            <span className={t.icon}>
              <Icon name={toneIcon[tone]} />
            </span>
            <AriaToastContent className={t.body}>
              <Text slot="title" className={t.title}>
                {queued.content.title}
              </Text>
              {queued.content.description ? (
                <Text slot="description" className={t.description}>
                  {queued.content.description}
                </Text>
              ) : null}
            </AriaToastContent>
            <AriaButton
              className={t.close}
              aria-label="Dismiss"
              onPress={() => queue.close(queued.key)}
            >
              <Icon name="close" size="sm" />
            </AriaButton>
          </AriaToast>
        );
      }}
    </AriaToastRegion>
  );
}

export type ToastProviderProps = {
  children: ReactNode;
  /** Screen corner the toast region anchors to. @default bottom-end */
  placement?: ToastPlacement;
  /** Maximum number of toasts visible at once; older toasts queue behind this limit. @default 3 */
  maxVisibleToasts?: number;
};

/**
 * Owns a toast queue and mounts the `ToastRegion` for the subtree. Pair with `useToast()` to
 * push notifications from anywhere below.
 *
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({
  children,
  placement = 'bottom-end',
  maxVisibleToasts = DEFAULT_MAX,
}: ToastProviderProps): JSX.Element {
  const queue = useMemo(
    () => new UNSTABLE_ToastQueue<ToastContentData>({ maxVisibleToasts }),
    [maxVisibleToasts],
  );
  const value = useMemo(() => ({ queue, placement }), [queue, placement]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion queue={queue} placement={placement} />
    </ToastContext.Provider>
  );
}

export type UseToastReturn = {
  /** Enqueues a toast; returns its id. Auto-dismisses after `durationMs` (default 4000ms; pass 0 to disable). */
  add: (content: ToastContentData & { durationMs?: number }) => string;
  /** Dismisses a toast by id ahead of its timeout. */
  dismiss: (id: string) => void;
};

/** Push toasts into the nearest `ToastProvider`'s queue. Throws when rendered outside one. */
export function useToast(): UseToastReturn {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    add: ({ durationMs = DEFAULT_DURATION, ...content }) =>
      ctx.queue.add(content, {
        timeout: durationMs === 0 ? undefined : durationMs,
      }),
    dismiss: (id) => ctx.queue.close(id),
  };
}

export { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';
