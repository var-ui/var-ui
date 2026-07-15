import type { JSX, ReactElement, ReactNode } from 'react';
import {
  Dialog,
  DialogTrigger,
  Heading,
  Popover as AriaPopover,
  type DialogTriggerProps,
  type Placement,
} from 'react-aria-components';
import { popover } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';

export type PopoverProps = Omit<DialogTriggerProps, 'children'> & {
  /** Single focusable trigger element. */
  trigger: ReactElement;
  /** Optional heading shown at the top of the popover. */
  title?: ReactNode;
  /** Popover body content. */
  children: ReactNode;
  /** Preferred placement relative to the trigger. @default bottom */
  placement?: Placement;
  /**
   * Element the popover portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

type PopoverSlot = 'root' | 'title' | 'content';
type PopoverRecipeFn = () => Record<PopoverSlot, string>;
// `popover` resolves to `styles`'s dimensioned-variant overload at the type level (returns `string`)
// instead of its slot overload, even though it returns a per-slot class map at runtime — see
// packages/core/src/components/popover.ts. Recast until that recipe's overload resolution is fixed upstream.
const popoverSlots = popover as unknown as PopoverRecipeFn;

export function Popover({
  trigger,
  title,
  children,
  placement = 'bottom',
  portalContainer,
  ...triggerProps
}: PopoverProps): JSX.Element {
  const p = popoverSlots();
  const { style: layerStyle } = useLayer();
  return (
    <DialogTrigger {...triggerProps}>
      {trigger}
      <AriaPopover
        className={p.root}
        placement={placement}
        style={layerStyle}
        UNSTABLE_portalContainer={portalContainer}
      >
        <Dialog className={p.content}>
          {title ? (
            <Heading slot="title" className={p.title}>
              {title}
            </Heading>
          ) : null}
          {children}
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
