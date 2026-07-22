const ARROW_STEP = 10;
const ARROW_STEP_LARGE = 50;

export type ResizeHandleOptions = {
  direction?: 'horizontal' | 'vertical';
  getValue: () => number;
  minValue: number;
  maxValue: number;
  onChange: (next: number) => void;
  onCollapse?: () => void;
  getIsCollapsed?: () => boolean;
  'aria-label'?: string;
};

type DragState = { startPos: number; startValue: number };

export function createResizeHandle(root: HTMLElement, options: ResizeHandleOptions): () => void {
  const direction = options.direction ?? 'horizontal';
  const isHorizontal = direction === 'horizontal';

  const clamp = (next: number) => Math.min(Math.max(next, options.minValue), options.maxValue);

  const syncAttrs = () => {
    root.setAttribute('aria-valuenow', String(options.getValue()));
    root.setAttribute('aria-valuemin', String(options.minValue));
    root.setAttribute('aria-valuemax', String(options.maxValue));
    if (options.getIsCollapsed?.()) {
      root.setAttribute('data-collapsed', '');
    } else {
      root.removeAttribute('data-collapsed');
    }
  };

  let dragState: DragState | null = null;

  const handleDragMove = (event: MouseEvent) => {
    if (!dragState) return;
    const pos = isHorizontal ? event.clientX : event.clientY;
    options.onChange(clamp(dragState.startValue + (pos - dragState.startPos)));
    syncAttrs();
  };

  const handleDragEnd = () => {
    dragState = null;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (options.getIsCollapsed?.()) return;
    event.preventDefault();
    dragState = {
      startPos: isHorizontal ? event.clientX : event.clientY,
      startValue: options.getValue(),
    };
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const increaseKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const decreaseKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const step = event.shiftKey ? ARROW_STEP_LARGE : ARROW_STEP;
    switch (event.key) {
      case increaseKey:
        event.preventDefault();
        options.onChange(clamp(options.getValue() + step));
        syncAttrs();
        break;
      case decreaseKey:
        event.preventDefault();
        options.onChange(clamp(options.getValue() - step));
        syncAttrs();
        break;
      case 'Home':
        event.preventDefault();
        options.onChange(options.minValue);
        syncAttrs();
        break;
      case 'End':
        event.preventDefault();
        options.onChange(options.maxValue);
        syncAttrs();
        break;
      case 'Enter':
        if (options.onCollapse) {
          event.preventDefault();
          options.onCollapse();
        }
        break;
      default:
        break;
    }
  };

  const handleDoubleClick = () => {
    options.onCollapse?.();
  };

  root.setAttribute('role', 'separator');
  root.setAttribute('aria-orientation', direction);
  root.setAttribute('tabindex', '0');
  root.setAttribute('data-orientation', direction);
  if (options['aria-label']) {
    root.setAttribute('aria-label', options['aria-label']);
  }
  syncAttrs();

  root.addEventListener('mousedown', handleMouseDown);
  root.addEventListener('keydown', handleKeyDown);
  root.addEventListener('dblclick', handleDoubleClick);

  return () => {
    root.removeEventListener('mousedown', handleMouseDown);
    root.removeEventListener('keydown', handleKeyDown);
    root.removeEventListener('dblclick', handleDoubleClick);
    handleDragEnd();
  };
}
