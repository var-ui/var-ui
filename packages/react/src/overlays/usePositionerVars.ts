import { useLayoutEffect, useState, type RefObject } from 'react';

// oxlint-disable-next-line typescript/no-redundant-type-constituents -- named sides document the supported placement contract
export type OverlayPlacement = 'top' | 'bottom' | 'left' | 'right' | string;

export type UsePositionerVarsOptions = {
  placement: OverlayPlacement;
  /** Popup/positioner element. */
  popupRef: RefObject<HTMLElement | null>;
  /** Trigger/anchor element. Optional; needed for --var-ui-anchor-width. */
  triggerRef?: RefObject<HTMLElement | null>;
};

export type UsePositionerVarsResult = {
  style: {
    '--var-ui-available-height': string;
    '--var-ui-available-width': string;
    '--var-ui-transform-origin': string;
    '--var-ui-anchor-width'?: string;
  };
};

type PositionerStyle = UsePositionerVarsResult['style'];

function getSide(placement: OverlayPlacement): string {
  return placement.trim().split(/\s+/)[0] ?? '';
}

function getTransformOrigin(placement: OverlayPlacement): string {
  switch (getSide(placement)) {
    case 'top':
      return 'bottom center';
    case 'bottom':
      return 'top center';
    case 'left':
      return 'center right';
    case 'right':
      return 'center left';
    default:
      return 'center';
  }
}

function getStyle(
  placement: OverlayPlacement,
  popup: HTMLElement | null,
  trigger: HTMLElement | null,
  includeAnchorWidth: boolean,
): PositionerStyle {
  const transformOrigin = getTransformOrigin(placement);

  if (!popup || typeof window === 'undefined') {
    const style: PositionerStyle = {
      '--var-ui-available-height': '0px',
      '--var-ui-available-width': '0px',
      '--var-ui-transform-origin': transformOrigin,
    };
    if (includeAnchorWidth) {
      style['--var-ui-anchor-width'] = '0px';
    }
    return style;
  }

  const side = getSide(placement);
  const bounds = popup.getBoundingClientRect();
  const availableHeight =
    side === 'bottom'
      ? window.innerHeight - bounds.top
      : side === 'top'
        ? bounds.bottom
        : window.innerHeight;
  const availableWidth =
    side === 'right'
      ? window.innerWidth - bounds.left
      : side === 'left'
        ? bounds.right
        : window.innerWidth;
  const style: PositionerStyle = {
    '--var-ui-available-height': `${Math.max(0, availableHeight)}px`,
    '--var-ui-available-width': `${Math.max(0, availableWidth)}px`,
    '--var-ui-transform-origin': transformOrigin,
  };

  if (includeAnchorWidth) {
    style['--var-ui-anchor-width'] = trigger
      ? `${Math.max(0, trigger.getBoundingClientRect().width)}px`
      : '0px';
  }

  return style;
}

function stylesEqual(left: PositionerStyle, right: PositionerStyle): boolean {
  return (
    left['--var-ui-available-height'] === right['--var-ui-available-height'] &&
    left['--var-ui-available-width'] === right['--var-ui-available-width'] &&
    left['--var-ui-transform-origin'] === right['--var-ui-transform-origin'] &&
    left['--var-ui-anchor-width'] === right['--var-ui-anchor-width']
  );
}

export function usePositionerVars({
  placement,
  popupRef,
  triggerRef,
}: UsePositionerVarsOptions): UsePositionerVarsResult {
  const [style, setStyle] = useState<PositionerStyle>(() =>
    getStyle(placement, null, null, triggerRef !== undefined),
  );

  useLayoutEffect(() => {
    const update = () => {
      const nextStyle = getStyle(
        placement,
        popupRef.current,
        triggerRef?.current ?? null,
        triggerRef !== undefined,
      );
      setStyle((currentStyle) => (stylesEqual(currentStyle, nextStyle) ? currentStyle : nextStyle));
    };

    update();
    window.addEventListener('resize', update);

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    if (popupRef.current) {
      observer?.observe(popupRef.current);
    }

    return () => {
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  });

  return { style };
}
