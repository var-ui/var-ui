import type { JSX, ReactElement, ReactNode } from 'react';
import type { Placement } from 'react-aria-components';
import { Tooltip } from './Tooltip';

export type SimpleTooltipProps = {
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

/**
 * Assembled tooltip — previous default `Tooltip` export. Prefer compound `Tooltip` parts for custom chrome.
 */
export function SimpleTooltip({
  content,
  children,
  delay = 500,
  placement = 'top',
  portalContainer,
}: SimpleTooltipProps): JSX.Element {
  return (
    <Tooltip.Root delay={delay} portalContainer={portalContainer}>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Tooltip.Popup placement={placement} portalContainer={portalContainer}>
        {content}
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}
