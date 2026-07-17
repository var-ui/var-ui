import type { FocusEvent, JSX, MouseEvent, ReactElement, ReactNode } from 'react';
import { cloneElement, useCallback, useRef, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  Heading,
  Popover as AriaPopover,
  type Placement,
} from 'react-aria-components';
import { hoverCard } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';
import { recipeProps } from './utils';

export type HoverCardProps = {
  /** Single focusable trigger element (e.g. a link or avatar). */
  trigger: ReactElement;
  /** Optional heading shown at the top of the card. */
  title?: ReactNode;
  /** Rich preview content — may contain interactive elements such as links. */
  children: ReactNode;
  /** Delay before the card opens on hover/focus, in milliseconds. @default 700 */
  openDelay?: number;
  /** Delay before the card closes after the pointer/focus leaves, in milliseconds. @default 300 */
  closeDelay?: number;
  /** Preferred placement relative to the trigger. @default top */
  placement?: Placement;
  /**
   * Element the card portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

type HoverCardSlot = 'root' | 'title' | 'content';
type HoverCardRecipeFn = () => Record<HoverCardSlot, string>;
// `hoverCard` resolves to `styles`'s dimensioned-variant overload at the type level (returns
// `string`) instead of its slot overload, even though it returns a per-slot class map at runtime —
// see packages/core/src/components/hoverCard.ts. Recast until that recipe's overload resolution is
// fixed upstream.
const hoverCardSlots = hoverCard as unknown as HoverCardRecipeFn;

function callHandler<E>(handler: ((event: E) => void) | undefined, event: E): void {
  handler?.(event);
}

/**
 * Non-modal rich preview shown on hover or focus, with independent open/close delays. Unlike
 * `Popover`, it does not trap focus — the trigger and panel behave like a tooltip that happens to
 * host interactive content (e.g. links).
 */
export function HoverCard({
  trigger,
  title,
  children,
  openDelay = 700,
  closeDelay = 300,
  placement = 'top',
  portalContainer,
}: HoverCardProps): JSX.Element {
  const hc = hoverCardSlots();
  const { style: layerStyle } = useLayer();
  const [isOpen, setIsOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
      setIsOpen(true);
    }, openDelay);
  }, [cancelCloseTimer, cancelOpenTimer, openDelay]);

  const scheduleClose = useCallback(() => {
    cancelOpenTimer();
    cancelCloseTimer();
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  }, [cancelCloseTimer, cancelOpenTimer, closeDelay]);

  const triggerElement = cloneElement(trigger, {
    onMouseEnter: (event: MouseEvent) => {
      callHandler(trigger.props.onMouseEnter, event);
      scheduleOpen();
    },
    onMouseLeave: (event: MouseEvent) => {
      callHandler(trigger.props.onMouseLeave, event);
      scheduleClose();
    },
    onFocus: (event: FocusEvent) => {
      callHandler(trigger.props.onFocus, event);
      scheduleOpen();
    },
    onBlur: (event: FocusEvent) => {
      callHandler(trigger.props.onBlur, event);
      scheduleClose();
    },
  });

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      {triggerElement}
      <AriaPopover
        {...recipeProps(hc.root)}
        placement={placement}
        style={layerStyle}
        isNonModal
        UNSTABLE_portalContainer={portalContainer}
        onMouseEnter={cancelCloseTimer}
        onMouseLeave={scheduleClose}
      >
        <Dialog {...recipeProps(hc.content)}>
          {/*
           * `onFocus`/`onBlur` aren't part of RAC's `Dialog`/`Popover` DOM prop allowlist (they're
           * only exposed on focusable elements), so a plain wrapper div carries the panel's
           * hover/focus retention logic. `Heading[slot="title"]` still wires up via React context
           * regardless of this extra nesting.
           */}
          <div
            onMouseEnter={cancelCloseTimer}
            onMouseLeave={scheduleClose}
            onFocus={cancelCloseTimer}
            onBlur={scheduleClose}
          >
            {title ? (
              <Heading slot="title" {...recipeProps(hc.title)}>
                {title}
              </Heading>
            ) : null}
            {children}
          </div>
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
