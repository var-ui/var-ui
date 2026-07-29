import type { CSSProperties, JSX, ReactElement, ReactNode } from 'react';
import { createContext, isValidElement, useContext, useMemo } from 'react';
import {
  designTokens as t,
  layout,
  layoutContent,
  layoutFooter,
  layoutHeader,
  layoutPanel,
  type LayoutPadding,
} from '@var-ui/core';
import type { UseResizableResult } from '../hooks';
import { recipeProps } from './utils';

type LayoutPaddingVariant = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8';

/** `layout()`'s padding variant keys are strings — recipe callers must map the numeric prop. */
function toLayoutPaddingVariant(
  padding: LayoutPadding | undefined,
): LayoutPaddingVariant | undefined {
  return padding == null ? undefined : (String(padding) as LayoutPaddingVariant);
}

/** `layoutContent()`/`layoutPanel()` only support seamless (`inherit`, the default) or `0`. */
function toZonePaddingVariant(padding: LayoutPadding | undefined): 'inherit' | '0' {
  return padding === 0 ? '0' : 'inherit';
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/** Reads `hasDivider` off a not-yet-rendered child element, without executing it. */
function elementHasDivider(node: ReactNode, fallback: boolean): boolean {
  if (isValidElement(node)) {
    const props = (node as ReactElement<{ hasDivider?: boolean }>).props;
    if (props.hasDivider != null) return props.hasDivider;
  }
  return fallback;
}

type LayoutArea = 'header' | 'footer' | 'start' | 'end' | 'content';

const LayoutAreaContext = createContext<LayoutArea | null>(null);

type LayoutSlotsContextValue = {
  hasHeader: boolean;
  hasFooter: boolean;
  hasStart: boolean;
  hasEnd: boolean;
  defaultHasDividers: boolean;
};

const LayoutSlotsContext = createContext<LayoutSlotsContextValue>({
  hasHeader: false,
  hasFooter: false,
  hasStart: false,
  hasEnd: false,
  defaultHasDividers: false,
});

/** Inherited divider default consumed by `LayoutHeader`/`LayoutFooter` when `hasDivider` is unset. */
const LayoutDividerContext = createContext<boolean>(false);

export type LayoutProps = {
  /** Top chrome band, usually a `LayoutHeader`. */
  header?: ReactNode;
  /** Left/start rail, usually a `LayoutPanel`. */
  start?: ReactNode;
  /** Main zone; wins over `children` when both are set. */
  content?: ReactNode;
  /** Main zone shorthand — used when `content` is omitted. */
  children?: ReactNode;
  /** Right/end rail, usually a `LayoutPanel`. */
  end?: ReactNode;
  /** Bottom chrome band, usually a `LayoutFooter`. */
  footer?: ReactNode;
  /** @default 'fill' */
  height?: 'fill' | 'auto';
  /** Constrains header/content/footer inner wrappers via `margin-inline: auto`. */
  contentWidth?: number;
  /** Outer/inner spacing step for all zones. @default 4 */
  padding?: LayoutPadding;
  /** Divider default inherited by `LayoutHeader`/`LayoutFooter` when they don't set `hasDivider`. @default false */
  defaultHasDividers?: boolean;
  className?: string;
};

/**
 * Multi-pane page shell: header/footer bands and a horizontal middle row for
 * start/content/end zones. Pairs with `LayoutHeader`, `LayoutFooter`,
 * `LayoutContent`, and `LayoutPanel` for edge-aware padding and dividers.
 *
 * ```tsx
 * <Layout
 *   header={<LayoutHeader>Toolbar</LayoutHeader>}
 *   content={<LayoutContent padding={0}><Table /></LayoutContent>}
 *   end={<LayoutPanel hasDivider padding={0}>Inspector</LayoutPanel>}
 * />
 * ```
 */
export function Layout({
  header,
  start,
  content,
  children,
  end,
  footer,
  height = 'fill',
  contentWidth,
  padding,
  defaultHasDividers = false,
  className,
}: LayoutProps): JSX.Element {
  const paddingVariant = toLayoutPaddingVariant(padding);
  const l = layout(paddingVariant == null ? { height } : { height, padding: paddingVariant });
  const contentNode = content ?? children;

  const hasHeader = header != null;
  const hasFooter = footer != null;
  const hasStart = start != null;
  const hasEnd = end != null;

  const slots = useMemo<LayoutSlotsContextValue>(
    () => ({ hasHeader, hasFooter, hasStart, hasEnd, defaultHasDividers }),
    [hasHeader, hasFooter, hasStart, hasEnd, defaultHasDividers],
  );

  const rootStyle: CSSProperties | undefined =
    contentWidth != null
      ? ({ '--var-ui-layout-content-width': `${contentWidth}px` } as CSSProperties)
      : undefined;

  const headerHasDivider = elementHasDivider(header, defaultHasDividers);
  const footerHasDivider = elementHasDivider(footer, defaultHasDividers);

  return (
    <LayoutSlotsContext.Provider value={slots}>
      <LayoutDividerContext.Provider value={defaultHasDividers}>
        <div
          {...recipeProps(l.root, className)}
          style={rootStyle}
          data-has-header={hasHeader ? '' : undefined}
          data-has-footer={hasFooter ? '' : undefined}
          data-has-start={hasStart ? '' : undefined}
          data-has-end={hasEnd ? '' : undefined}
          data-divider-header={headerHasDivider ? '' : undefined}
          data-divider-footer={footerHasDivider ? '' : undefined}
        >
          <div {...recipeProps(l.outer)}>
            <div {...recipeProps(l.inner)}>
              {hasHeader ? (
                <LayoutAreaContext.Provider value="header">{header}</LayoutAreaContext.Provider>
              ) : null}
              <div {...recipeProps(l.middle)}>
                {hasStart ? (
                  <LayoutAreaContext.Provider value="start">{start}</LayoutAreaContext.Provider>
                ) : null}
                <LayoutAreaContext.Provider value="content">
                  {contentNode}
                </LayoutAreaContext.Provider>
                {hasEnd ? (
                  <LayoutAreaContext.Provider value="end">{end}</LayoutAreaContext.Provider>
                ) : null}
              </div>
              {hasFooter ? (
                <LayoutAreaContext.Provider value="footer">{footer}</LayoutAreaContext.Provider>
              ) : null}
            </div>
          </div>
        </div>
      </LayoutDividerContext.Provider>
    </LayoutSlotsContext.Provider>
  );
}

/** Scoped override of the layout padding CSS vars consumed by zone recipes. */
function zoneOverrideStyle(
  height: number | string | undefined,
  padding: LayoutPadding | undefined,
): CSSProperties | undefined {
  const heightValue = toCssSize(height);
  if (heightValue == null && padding == null) return undefined;
  const paddingVars =
    padding == null
      ? undefined
      : (() => {
          const value = t.space[padding].var;
          return {
            '--var-ui-layout-padding-outer-x': value,
            '--var-ui-layout-padding-outer-y': value,
            '--var-ui-layout-padding-inner-x': value,
            '--var-ui-layout-padding-inner-y': value,
          };
        })();
  return {
    ...(heightValue != null ? { height: heightValue } : {}),
    ...paddingVars,
  } as CSSProperties;
}

export type LayoutHeaderProps = {
  /** Overrides the inherited `LayoutDividerContext` default. */
  hasDivider?: boolean;
  /** Raw CSS height override (number treated as px). */
  height?: number | string;
  /** Overrides the inherited outer/inner padding CSS vars for this zone only. */
  padding?: LayoutPadding;
  className?: string;
  children?: ReactNode;
};

/**
 * Top chrome band for `Layout`. Divider defaults from `LayoutDividerContext`
 * (set by `Layout.defaultHasDividers`) unless `hasDivider` is set explicitly.
 */
export function LayoutHeader({
  hasDivider,
  height,
  padding,
  className,
  children,
}: LayoutHeaderProps): JSX.Element {
  const s = layoutHeader();
  const inheritedDivider = useContext(LayoutDividerContext);
  const effectiveHasDivider = hasDivider ?? inheritedDivider;
  const style = zoneOverrideStyle(height, padding);

  return (
    <LayoutAreaContext.Provider value="header">
      <div
        {...recipeProps(s.header, className)}
        style={style}
        data-divider={effectiveHasDivider ? '' : undefined}
      >
        <div {...recipeProps(s.headerInner)}>{children}</div>
      </div>
    </LayoutAreaContext.Provider>
  );
}

export type LayoutFooterProps = {
  /** Overrides the inherited `LayoutDividerContext` default. */
  hasDivider?: boolean;
  /** Raw CSS height override (number treated as px). */
  height?: number | string;
  /** Overrides the inherited outer/inner padding CSS vars for this zone only. */
  padding?: LayoutPadding;
  className?: string;
  children?: ReactNode;
};

/**
 * Bottom chrome band for `Layout`. Divider defaults from `LayoutDividerContext`
 * (set by `Layout.defaultHasDividers`) unless `hasDivider` is set explicitly.
 */
export function LayoutFooter({
  hasDivider,
  height,
  padding,
  className,
  children,
}: LayoutFooterProps): JSX.Element {
  const s = layoutFooter();
  const inheritedDivider = useContext(LayoutDividerContext);
  const effectiveHasDivider = hasDivider ?? inheritedDivider;
  const style = zoneOverrideStyle(height, padding);

  return (
    <LayoutAreaContext.Provider value="footer">
      <div
        {...recipeProps(s.footer, className)}
        style={style}
        data-divider={effectiveHasDivider ? '' : undefined}
      >
        <div {...recipeProps(s.footerInner)}>{children}</div>
      </div>
    </LayoutAreaContext.Provider>
  );
}

export type LayoutContentProps = {
  /** Only `0` (seamless) is distinct from the inherited default. */
  padding?: LayoutPadding;
  /** @default true */
  isScrollable?: boolean;
  role?: string;
  /** Accessible name; paired with `role="region"` by default when set. */
  label?: string;
  className?: string;
  children?: ReactNode;
};

/** Flex-1 main column for `Layout`. Edge-aware padding reads `data-has-*` from the `Layout` root. */
export function LayoutContent({
  padding,
  isScrollable = true,
  role,
  label,
  className,
  children,
}: LayoutContentProps): JSX.Element {
  const s = layoutContent({ isScrollable, padding: toZonePaddingVariant(padding) });
  const resolvedRole = role ?? (label != null ? 'region' : undefined);

  return (
    <LayoutAreaContext.Provider value="content">
      <div {...recipeProps(s.content, className)} role={resolvedRole} aria-label={label}>
        {children}
      </div>
    </LayoutAreaContext.Provider>
  );
}

export type LayoutPanelProps = {
  /** Ignored when `resizable` is provided — `resizable.width` wins. */
  width?: number | string;
  /** @default false */
  hasDivider?: boolean;
  /** @default true */
  isScrollable?: boolean;
  /** Only `0` (seamless) is distinct from the inherited default. */
  padding?: LayoutPadding;
  /** Binds `useResizable()`'s result — reads `width` and ignores the `width` prop. */
  resizable?: UseResizableResult;
  role?: string;
  /** Accessible name; paired with `role="region"` by default when set. */
  label?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Fixed-width side panel for `Layout` start/end slots. `data-side` is read
 * from the nearest `LayoutAreaContext` set by `Layout`. No responsive
 * overlay/hidden behavior yet — see `LayoutPanel.responsive` (Task 4).
 */
export function LayoutPanel({
  width,
  hasDivider = false,
  isScrollable = true,
  padding,
  resizable,
  role,
  label,
  className,
  children,
}: LayoutPanelProps): JSX.Element {
  const area = useContext(LayoutAreaContext);
  const dataSide = area === 'start' || area === 'end' ? area : undefined;
  const s = layoutPanel({ isScrollable, hasDivider, padding: toZonePaddingVariant(padding) });
  const resolvedRole = role ?? (label != null ? 'region' : undefined);

  const effectiveWidth = resizable?.width ?? width;
  const style: CSSProperties | undefined =
    effectiveWidth != null ? { width: toCssSize(effectiveWidth) } : undefined;

  return (
    <div
      {...recipeProps(s.panel, className)}
      data-side={dataSide}
      style={style}
      role={resolvedRole}
      aria-label={label}
    >
      {children}
    </div>
  );
}
