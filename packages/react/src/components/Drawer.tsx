import type { CSSProperties, JSX, ReactNode } from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components';
import { drawer, type DrawerVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useScrollLock } from '../hooks';
import { useLayer } from '../layers/LayerProvider';
import { recipeProps } from './utils';

const dialogContentStyle: CSSProperties = { display: 'contents' };

export type { DrawerSize } from '@var-ui/core';

export type DrawerProps = Omit<ModalOverlayProps, 'children'> &
  DrawerVariantProps & {
    /** Panel title rendered in the header when `title` is set. */
    title?: ReactNode;
    /** Drawer body content. */
    children: ReactNode;
    /** Edge the panel slides in from. @default 'end' */
    placement?: 'start' | 'end' | 'bottom';
    /** Custom panel width in px (overrides size width for start/end). */
    width?: number;
    /** Custom panel height in px (overrides size height for bottom). */
    height?: number;
    /** Label for the close button. @default 'Close' */
    closeLabel?: string;
    /** Accessible name when `title` is omitted. @default 'Drawer' */
    label?: string;
    className?: string;
    /**
     * Element the drawer portals into instead of `document.body`. Needed when a subtree renders
     * under a different theme than the page ambient.
     */
    portalContainer?: Element;
  };

/**
 * General-purpose slide-in panel built on RAC Modal — focus trap, Escape, and
 * backdrop dismissal included.
 *
 * ```tsx
 * <Drawer isOpen={open} onOpenChange={setOpen} title="Settings">
 *   <p>Drawer content</p>
 * </Drawer>
 * ```
 */
export function Drawer({
  title,
  children,
  placement = 'end',
  size = 'md',
  width,
  height,
  closeLabel = 'Close',
  label = 'Drawer',
  className,
  portalContainer,
  isOpen = false,
  ...props
}: DrawerProps): JSX.Element {
  const styles = drawer({ size });
  const { style: layerStyle } = useLayer();
  useScrollLock(isOpen);

  const panelStyle = {
    ...(width != null ? ({ '--var-ui-drawer-panelwidth': `${width}px` } as CSSProperties) : {}),
    ...(height != null ? ({ '--var-ui-drawer-panelheight': `${height}px` } as CSSProperties) : {}),
  };

  return (
    <ModalOverlay
      {...props}
      isOpen={isOpen}
      isDismissable
      {...recipeProps(styles.overlay)}
      style={layerStyle}
      UNSTABLE_portalContainer={portalContainer}
    >
      <Modal
        {...recipeProps(styles.panel, className)}
        data-placement={placement}
        style={panelStyle}
      >
        <AriaDialog aria-label={title ? undefined : label} style={dialogContentStyle}>
          {({ close }) => (
            <>
              {title ? (
                <div {...recipeProps(styles.header)}>
                  <Heading slot="title" {...recipeProps(styles.title)}>
                    {title}
                  </Heading>
                  <AriaButton
                    {...recipeProps(styles.closeButton)}
                    aria-label={closeLabel}
                    onPress={close}
                  >
                    <Icon name="close" size="sm" />
                  </AriaButton>
                </div>
              ) : null}
              <div {...recipeProps(styles.body)}>{children}</div>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
