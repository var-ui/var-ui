import type { JSX, ReactElement, ReactNode } from 'react';
import { Tooltip as AriaTooltip, TooltipTrigger, type Placement } from 'react-aria-components';
import { tooltip } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';
import { recipeProps } from './utils';

export type TooltipProps = {
  /** Tooltip body shown on hover or focus. */
  content: ReactNode;
  /** Single focusable trigger element. */
  children: ReactElement;
  /** Delay before the tooltip opens, in milliseconds. @default 500 */
  delay?: number;
  /** Preferred placement relative to the trigger. @default top */
  placement?: Placement;
  /**
   * Element the tooltip portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

type TooltipSlot = 'root';
type TooltipRecipeFn = () => Record<TooltipSlot, string>;
// `tooltip` resolves to `styles`'s dimensioned-variant overload at the type level (returns `string`)
// instead of its slot overload, even though it returns a per-slot class map at runtime — see
// packages/core/src/components/tooltip.ts. Recast until that recipe's overload resolution is fixed upstream.
const tooltipSlots = tooltip as unknown as TooltipRecipeFn;

export function Tooltip({
  content,
  children,
  delay = 500,
  placement = 'top',
  portalContainer,
}: TooltipProps): JSX.Element {
  const { style: layerStyle } = useLayer();
  const tip = tooltipSlots();
  return (
    <TooltipTrigger delay={delay}>
      {children}
      <AriaTooltip
        {...recipeProps(tip.root)}
        placement={placement}
        style={layerStyle}
        UNSTABLE_portalContainer={portalContainer}
      >
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
