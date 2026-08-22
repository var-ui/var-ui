import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Focusable,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type Placement,
} from 'react-aria-components';
import { tooltip } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  useOverlayPresence,
  usePositionerVars,
  type OverlayOpenChangeHandler,
  type UseOverlayPresenceResult,
} from '../overlays';
import { recipeProps } from './utils';

export type TooltipRootProps = {
  children: ReactNode;
  /** Delay before the tooltip opens, in milliseconds. @default 500 */
  delay?: number;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the tooltip portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root tooltip props. */
export type TooltipProps = TooltipRootProps;

export type TooltipTriggerProps = {
  children: ReactElement;
  className?: string;
};

export type TooltipPopupProps = {
  children: ReactNode;
  className?: string;
  /** Preferred placement relative to the trigger. @default top */
  placement?: Placement;
  portalContainer?: Element;
};

type TooltipSlot = 'root';
type TooltipRecipeFn = () => Record<TooltipSlot, string>;
// `tooltip` resolves to `styles`'s dimensioned-variant overload at the type level (returns `string`)
// instead of its slot overload, even though it returns a per-slot class map at runtime — see
// packages/core/src/components/tooltip.ts. Recast until that recipe's overload resolution is fixed upstream.
const tooltipSlots = tooltip as unknown as TooltipRecipeFn;
/** Matches RAC TooltipTrigger's default closeDelay. */
const TOOLTIP_CLOSE_DELAY = 500;

function composeHandler(existing: unknown, ours: (...args: unknown[]) => void) {
  if (typeof existing !== 'function') {
    return ours;
  }
  return (...args: unknown[]) => {
    existing(...args);
    ours(...args);
  };
}

type TooltipContextValue = {
  presence: UseOverlayPresenceResult;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  triggerRef: MutableRefObject<HTMLElement | null>;
  setPopupEl: (element: HTMLDivElement | null) => void;
  setTriggerEl: (element: HTMLElement | null) => void;
  portalContainer?: Element;
  lastEventRef: MutableRefObject<Event | null>;
  handleOpenChange: (next: boolean) => void;
  scheduleOpen: () => void;
  scheduleClose: () => void;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error('Tooltip compound components must be rendered inside <Tooltip>.');
  }
  return ctx;
}

function TooltipRoot({
  children,
  delay = 500,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  portalContainer,
}: TooltipRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = isOpen ?? uncontrolledOpen;
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [, setPopupEl] = useState<HTMLDivElement | null>(null);
  const [, setTriggerEl] = useState<HTMLElement | null>(null);
  const lastEventRef = useRef<Event | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const presence = useOverlayPresence({
    isOpen: requestedOpen,
    getAnimatedElements: () => [popupRef.current],
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      const details = createOverlayChangeDetails({
        reason: inferOverlayCloseReason(lastEventRef.current),
        event: lastEventRef.current,
      });
      onOpenChange?.(next, details);
      lastEventRef.current = null;
      if (details.isCanceled) return;
      if (isOpen === undefined) setRequestedOpen(next);
    },
    [isOpen, onOpenChange],
  );

  const cancelOpenTimer = useCallback(() => {
    if (openTimer.current !== undefined) {
      clearTimeout(openTimer.current);
      openTimer.current = undefined;
    }
  }, []);

  const cancelCloseTimer = useCallback(() => {
    if (closeTimer.current !== undefined) {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    cancelCloseTimer();
    cancelOpenTimer();
    openTimer.current = setTimeout(() => {
      handleOpenChange(true);
    }, delay);
  }, [cancelCloseTimer, cancelOpenTimer, delay, handleOpenChange]);

  const scheduleClose = useCallback(() => {
    cancelOpenTimer();
    cancelCloseTimer();
    closeTimer.current = setTimeout(() => {
      handleOpenChange(false);
    }, TOOLTIP_CLOSE_DELAY);
  }, [cancelCloseTimer, cancelOpenTimer, handleOpenChange]);

  const context = useMemo<TooltipContextValue>(
    () => ({
      presence,
      popupRef,
      triggerRef,
      setPopupEl,
      setTriggerEl,
      portalContainer,
      lastEventRef,
      handleOpenChange,
      scheduleOpen,
      scheduleClose,
    }),
    [handleOpenChange, portalContainer, presence, scheduleClose, scheduleOpen],
  );

  return (
    <TooltipContext.Provider value={context}>
      <AriaTooltipTrigger delay={delay} isOpen={presence.mounted} onOpenChange={handleOpenChange}>
        {children}
      </AriaTooltipTrigger>
    </TooltipContext.Provider>
  );
}

const TooltipTriggerPart = forwardRef(function TooltipTriggerPart(
  { children, className, ...props }: TooltipTriggerProps,
  ref: Ref<HTMLElement>,
) {
  const ctx = useTooltipContext();
  const child = Children.only(children);
  const childProps = child.props as Record<string, unknown>;
  const assignTriggerEl = (node: HTMLElement | null) => {
    ctx.triggerRef.current = node;
    ctx.setTriggerEl(node);
  };
  const triggerProps = props as Record<string, unknown>;
  const merged = mergeOverlayChild(child, {
    ...triggerProps,
    className,
    ref: (node: HTMLElement | null) => {
      assignTriggerEl(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onMouseEnter: composeHandler(childProps.onMouseEnter, ctx.scheduleOpen),
    onMouseLeave: composeHandler(childProps.onMouseLeave, ctx.scheduleClose),
    onFocus: composeHandler(childProps.onFocus, ctx.scheduleOpen),
    onBlur: composeHandler(childProps.onBlur, ctx.scheduleClose),
  });
  // RAC TooltipTrigger injects hover/focus via FocusableProvider context, not cloneElement.
  // Host nodes need Focusable so they register; RAC Button already does.
  if (typeof child.type === 'string') {
    return <Focusable>{merged as ReactElement<{ className?: string }, string>}</Focusable>;
  }
  return merged;
});

function TooltipPopup({
  children,
  className,
  placement = 'top',
  portalContainer,
}: TooltipPopupProps): JSX.Element {
  const ctx = useTooltipContext();
  const tip = tooltipSlots();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: ctx.popupRef,
    triggerRef: ctx.triggerRef,
  });

  return (
    <AriaTooltip
      {...recipeProps(tip.root, className)}
      {...ctx.presence.attrs}
      ref={(node: HTMLDivElement | null) => {
        ctx.popupRef.current = node;
        ctx.setPopupEl(node);
      }}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style } as CSSProperties}
      UNSTABLE_portalContainer={portalContainer ?? ctx.portalContainer}
    >
      {children}
    </AriaTooltip>
  );
}

/**
 * Compound tooltip. `Tooltip` is Root; compose Trigger and Popup.
 *
 * ```tsx
 * <Tooltip.Root delay={500}>
 *   <Tooltip.Trigger>
 *     <button type="button">Info</button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Popup placement="top">More about this field</Tooltip.Popup>
 * </Tooltip.Root>
 * ```
 */
export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Trigger: TooltipTriggerPart,
  Popup: TooltipPopup,
});
