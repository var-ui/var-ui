import type { ComponentType } from 'react';
import type { DemoId } from './types';
import AlertDefault from './alert/default/react';
import AspectRatioDefault from './aspect-ratio/default/react';
import AvatarDefault from './avatar/default/react';
import BadgeDefault from './badge/default/react';
import BannerDefault from './banner/default/react';
import ButtonDefault from './button/default/react';
import ButtonDisabled from './button/disabled/react';
import ButtonVariants from './button/variants/react';
import CardDefault from './card/default/react';
import CarouselDefault from './carousel/default/react';
import CenterDefault from './center/default/react';
import ClickableCardDefault from './clickable-card/default/react';
import CodeBlockDefault from './code-block/default/react';
import DividerDefault from './divider/default/react';
import EmptyStateDefault from './empty-state/default/react';
import GridDefault from './grid/default/react';
import HeadingDefault from './heading/default/react';
import LinkDefault from './link/default/react';
import ProgressBarDefault from './progress-bar/default/react';
import SectionDefault from './section/default/react';
import SpinnerDefault from './spinner/default/react';
import StackDefault from './stack/default/react';
import TextDefault from './text/default/react';
import ThumbnailDefault from './thumbnail/default/react';
import TimestampDefault from './timestamp/default/react';
import FieldDefault from './field/default/react';
import TextFieldDefault from './text-field/default/react';
import TextAreaFieldDefault from './text-area-field/default/react';
import CheckboxDefault from './checkbox/default/react';
import RadioGroupDefault from './radio-group/default/react';
import SwitchDefault from './switch/default/react';
import SliderDefault from './slider/default/react';
import PinInputDefault from './pin-input/default/react';
import SelectDefault from './select/default/react';
import SelectOptions from './select/options/react';
import ComboboxDefault from './combobox/default/react';
import ComboboxField from './combobox/field/react';
import TypeaheadDefault from './typeahead/default/react';
import TypeaheadField from './typeahead/field/react';
import TabsDefault from './tabs/default/react';
import DialogDefault from './dialog/default/react';
import LayoutDefault from './layout/default/react';
import ChipDefault from './chip/default/react';
import TimelineDefault from './timeline/default/react';
import ToastDefault from './toast/default/react';
import AccordionDefault from './accordion/default/react';
import CollapsibleDefault from './collapsible/default/react';
import ChatLayoutDefault from './chat-layout/default/react';
import ChatMessageListDefault from './chat-message-list/default/react';
import ChatMessageDefault from './chat-message/default/react';
import ChatMessageBubbleDefault from './chat-message-bubble/default/react';
import ChatMessageMetadataDefault from './chat-message-metadata/default/react';
import ChatComposerDefault from './chat-composer/default/react';
import ChatSendButtonDefault from './chat-send-button/default/react';
import ChatSystemMessageDefault from './chat-system-message/default/react';
import ChatToolCallsDefault from './chat-tool-calls/default/react';
import KbdDefault from './kbd/default/react';
import SkeletonDefault from './skeleton/default/react';
import StatusDotDefault from './status-dot/default/react';
import StepsDefault from './steps/default/react';
import LoadingOverlayDefault from './loading-overlay/default/react';
import ListDefault from './list/default/react';
import DescriptionListDefault from './description-list/default/react';
import OutlineDefault from './outline/default/react';
import TocDefault from './toc/default/react';
import BreadcrumbsDefault from './breadcrumbs/default/react';
import AppShellDefault from './app-shell/default/react';
import SimpleGridDefault from './simple-grid/default/react';
import ScrollAreaDefault from './scroll-area/default/react';
import OverflowListDefault from './overflow-list/default/react';
import ResizeHandleDefault from './resize-handle/default/react';
import PaginationDefault from './pagination/default/react';
import SideNavDefault from './side-nav/default/react';
import TopNavDefault from './top-nav/default/react';
import TopNavMegaMenuDefault from './top-nav-mega-menu/default/react';
import MobileNavDefault from './mobile-nav/default/react';
import TabListDefault from './tab-list/default/react';
import AlertDialogDefault from './alert-dialog/default/react';
import DrawerDefault from './drawer/default/react';
import TooltipDefault from './tooltip/default/react';
import PopoverDefault from './popover/default/react';
import HoverCardDefault from './hover-card/default/react';
import CommandPaletteDefault from './command-palette/default/react';
import IconButtonDefault from './icon-button/default/react';
import IconButtonSizes from './icon-button/sizes/react';
import ButtonGroupDefault from './button-group/default/react';
import ButtonGroupIcons from './button-group/icons/react';
import CopyButtonDefault from './copy-button/default/react';
import CopyButtonLabels from './copy-button/labels/react';
import ToggleButtonDefault from './toggle-button/default/react';
import ToggleButtonPressed from './toggle-button/pressed/react';
import SegmentedControlDefault from './segmented-control/default/react';
import SegmentedControlControlled from './segmented-control/controlled/react';
import ColorModeToggleDefault from './color-mode-toggle/default/react';
import ColorModeToggleAppearance from './color-mode-toggle/appearance/react';
import DropdownMenuDefault from './dropdown-menu/default/react';
import DropdownMenuSections from './dropdown-menu/sections/react';
import ContextMenuDefault from './context-menu/default/react';
import ContextMenuSections from './context-menu/sections/react';
import MoreMenuDefault from './more-menu/default/react';
import MoreMenuOverflow from './more-menu/overflow/react';
import ToolbarDefault from './toolbar/default/react';
import ToolbarSlots from './toolbar/slots/react';
import NumberInputDefault from './number-input/default/react';
import PasswordInputDefault from './password-input/default/react';
import SearchInputDefault from './search-input/default/react';
import FileInputDefault from './file-input/default/react';
import InputGroupDefault from './input-group/default/react';
import CheckboxGroupDefault from './checkbox-group/default/react';
import CalendarDefault from './calendar/default/react';
import DateInputDefault from './date-input/default/react';
import DateRangeInputDefault from './date-range-input/default/react';
import DateTimeInputDefault from './date-time-input/default/react';
import TimeInputDefault from './time-input/default/react';
import TokenizerDefault from './tokenizer/default/react';
import MultiSelectorDefault from './multi-selector/default/react';
import ColorInputDefault from './color-input/default/react';
import ColorPickerDefault from './color-picker/default/react';
import TableDefault from './table/default/react';
import TreeDefault from './tree/default/react';
import FileTreeDefault from './file-tree/default/react';

/** Static React preview map — DemoReactIsland resolves demos by id (components are not serializable island props). */
export const reactDemoMap = {
  'button.default': ButtonDefault,
  'button.variants': ButtonVariants,
  'button.disabled': ButtonDisabled,
  'stack.default': StackDefault,
  'grid.default': GridDefault,
  'center.default': CenterDefault,
  'section.default': SectionDefault,
  'divider.default': DividerDefault,
  'aspect-ratio.default': AspectRatioDefault,
  'heading.default': HeadingDefault,
  'text.default': TextDefault,
  'link.default': LinkDefault,
  'code-block.default': CodeBlockDefault,
  'alert.default': AlertDefault,
  'banner.default': BannerDefault,
  'badge.default': BadgeDefault,
  'spinner.default': SpinnerDefault,
  'progress-bar.default': ProgressBarDefault,
  'empty-state.default': EmptyStateDefault,
  'avatar.default': AvatarDefault,
  'card.default': CardDefault,
  'clickable-card.default': ClickableCardDefault,
  'carousel.default': CarouselDefault,
  'thumbnail.default': ThumbnailDefault,
  'timestamp.default': TimestampDefault,
  'field.default': FieldDefault,
  'text-field.default': TextFieldDefault,
  'text-area-field.default': TextAreaFieldDefault,
  'checkbox.default': CheckboxDefault,
  'radio-group.default': RadioGroupDefault,
  'switch.default': SwitchDefault,
  'slider.default': SliderDefault,
  'pin-input.default': PinInputDefault,
  'select.default': SelectDefault,
  'select.options': SelectOptions,
  'combobox.default': ComboboxDefault,
  'combobox.field': ComboboxField,
  'typeahead.default': TypeaheadDefault,
  'typeahead.field': TypeaheadField,
  'tabs.default': TabsDefault,
  'dialog.default': DialogDefault,
  'layout.default': LayoutDefault,
  'chip.default': ChipDefault,
  'timeline.default': TimelineDefault,
  'toast.default': ToastDefault,
  'accordion.default': AccordionDefault,
  'collapsible.default': CollapsibleDefault,
  'chat-layout.default': ChatLayoutDefault,
  'chat-message-list.default': ChatMessageListDefault,
  'chat-message.default': ChatMessageDefault,
  'chat-message-bubble.default': ChatMessageBubbleDefault,
  'chat-message-metadata.default': ChatMessageMetadataDefault,
  'chat-composer.default': ChatComposerDefault,
  'chat-send-button.default': ChatSendButtonDefault,
  'chat-system-message.default': ChatSystemMessageDefault,
  'chat-tool-calls.default': ChatToolCallsDefault,
  'kbd.default': KbdDefault,
  'skeleton.default': SkeletonDefault,
  'status-dot.default': StatusDotDefault,
  'steps.default': StepsDefault,
  'loading-overlay.default': LoadingOverlayDefault,
  'list.default': ListDefault,
  'description-list.default': DescriptionListDefault,
  'outline.default': OutlineDefault,
  'toc.default': TocDefault,
  'breadcrumbs.default': BreadcrumbsDefault,
  'app-shell.default': AppShellDefault,
  'simple-grid.default': SimpleGridDefault,
  'scroll-area.default': ScrollAreaDefault,
  'overflow-list.default': OverflowListDefault,
  'resize-handle.default': ResizeHandleDefault,
  'pagination.default': PaginationDefault,
  'side-nav.default': SideNavDefault,
  'top-nav.default': TopNavDefault,
  'top-nav-mega-menu.default': TopNavMegaMenuDefault,
  'mobile-nav.default': MobileNavDefault,
  'tab-list.default': TabListDefault,
  'alert-dialog.default': AlertDialogDefault,
  'drawer.default': DrawerDefault,
  'tooltip.default': TooltipDefault,
  'popover.default': PopoverDefault,
  'hover-card.default': HoverCardDefault,
  'command-palette.default': CommandPaletteDefault,
  'icon-button.default': IconButtonDefault,
  'icon-button.sizes': IconButtonSizes,
  'button-group.default': ButtonGroupDefault,
  'button-group.icons': ButtonGroupIcons,
  'copy-button.default': CopyButtonDefault,
  'copy-button.labels': CopyButtonLabels,
  'toggle-button.default': ToggleButtonDefault,
  'toggle-button.pressed': ToggleButtonPressed,
  'segmented-control.default': SegmentedControlDefault,
  'segmented-control.controlled': SegmentedControlControlled,
  'color-mode-toggle.default': ColorModeToggleDefault,
  'color-mode-toggle.appearance': ColorModeToggleAppearance,
  'dropdown-menu.default': DropdownMenuDefault,
  'dropdown-menu.sections': DropdownMenuSections,
  'context-menu.default': ContextMenuDefault,
  'context-menu.sections': ContextMenuSections,
  'more-menu.default': MoreMenuDefault,
  'more-menu.overflow': MoreMenuOverflow,
  'toolbar.default': ToolbarDefault,
  'toolbar.slots': ToolbarSlots,
  'number-input.default': NumberInputDefault,
  'password-input.default': PasswordInputDefault,
  'search-input.default': SearchInputDefault,
  'file-input.default': FileInputDefault,
  'input-group.default': InputGroupDefault,
  'checkbox-group.default': CheckboxGroupDefault,
  'calendar.default': CalendarDefault,
  'date-input.default': DateInputDefault,
  'date-range-input.default': DateRangeInputDefault,
  'date-time-input.default': DateTimeInputDefault,
  'time-input.default': TimeInputDefault,
  'tokenizer.default': TokenizerDefault,
  'multi-selector.default': MultiSelectorDefault,
  'color-input.default': ColorInputDefault,
  'color-picker.default': ColorPickerDefault,
  'table.default': TableDefault,
  'tree.default': TreeDefault,
  'file-tree.default': FileTreeDefault,
} as const satisfies Record<DemoId, ComponentType>;

export const reactDemoIds = Object.keys(reactDemoMap) as DemoId[];
