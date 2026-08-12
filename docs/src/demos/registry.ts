import type { DemoEntry, DemoId, DemoSnippets } from './types';
import { snippets as alertDefaultSnippets } from './alert/default/snippets';
import { snippets as aspectRatioDefaultSnippets } from './aspect-ratio/default/snippets';
import { snippets as avatarDefaultSnippets } from './avatar/default/snippets';
import { snippets as badgeDefaultSnippets } from './badge/default/snippets';
import { snippets as bannerDefaultSnippets } from './banner/default/snippets';
import { snippets as buttonDefaultSnippets } from './button/default/snippets';
import { snippets as buttonDisabledSnippets } from './button/disabled/snippets';
import { snippets as buttonVariantsSnippets } from './button/variants/snippets';
import { snippets as cardDefaultSnippets } from './card/default/snippets';
import { snippets as carouselDefaultSnippets } from './carousel/default/snippets';
import { snippets as centerDefaultSnippets } from './center/default/snippets';
import { snippets as clickableCardDefaultSnippets } from './clickable-card/default/snippets';
import { snippets as codeBlockDefaultSnippets } from './code-block/default/snippets';
import { snippets as dividerDefaultSnippets } from './divider/default/snippets';
import { snippets as emptyStateDefaultSnippets } from './empty-state/default/snippets';
import { snippets as gridDefaultSnippets } from './grid/default/snippets';
import { snippets as headingDefaultSnippets } from './heading/default/snippets';
import { snippets as linkDefaultSnippets } from './link/default/snippets';
import { snippets as progressBarDefaultSnippets } from './progress-bar/default/snippets';
import { snippets as sectionDefaultSnippets } from './section/default/snippets';
import { snippets as spinnerDefaultSnippets } from './spinner/default/snippets';
import { snippets as stackDefaultSnippets } from './stack/default/snippets';
import { snippets as textDefaultSnippets } from './text/default/snippets';
import { snippets as thumbnailDefaultSnippets } from './thumbnail/default/snippets';
import { snippets as timestampDefaultSnippets } from './timestamp/default/snippets';
import { snippets as fieldDefaultSnippets } from './field/default/snippets';
import { snippets as textFieldDefaultSnippets } from './text-field/default/snippets';
import { snippets as textAreaFieldDefaultSnippets } from './text-area-field/default/snippets';
import { snippets as checkboxDefaultSnippets } from './checkbox/default/snippets';
import { snippets as radioGroupDefaultSnippets } from './radio-group/default/snippets';
import { snippets as switchDefaultSnippets } from './switch/default/snippets';
import { snippets as sliderDefaultSnippets } from './slider/default/snippets';
import { snippets as pinInputDefaultSnippets } from './pin-input/default/snippets';
import { snippets as selectDefaultSnippets } from './select/default/snippets';
import { snippets as selectOptionsSnippets } from './select/options/snippets';
import { snippets as comboboxDefaultSnippets } from './combobox/default/snippets';
import { snippets as comboboxFieldSnippets } from './combobox/field/snippets';
import { snippets as typeaheadDefaultSnippets } from './typeahead/default/snippets';
import { snippets as typeaheadFieldSnippets } from './typeahead/field/snippets';
import { snippets as tabsDefaultSnippets } from './tabs/default/snippets';
import { snippets as dialogDefaultSnippets } from './dialog/default/snippets';
import { snippets as layoutDefaultSnippets } from './layout/default/snippets';
import { snippets as chipDefaultSnippets } from './chip/default/snippets';
import { snippets as timelineDefaultSnippets } from './timeline/default/snippets';
import { snippets as toastDefaultSnippets } from './toast/default/snippets';
import { snippets as accordionDefaultSnippets } from './accordion/default/snippets';
import { snippets as collapsibleDefaultSnippets } from './collapsible/default/snippets';
import { snippets as chatLayoutDefaultSnippets } from './chat-layout/default/snippets';
import { snippets as chatMessageListDefaultSnippets } from './chat-message-list/default/snippets';
import { snippets as chatMessageDefaultSnippets } from './chat-message/default/snippets';
import { snippets as chatMessageBubbleDefaultSnippets } from './chat-message-bubble/default/snippets';
import { snippets as chatMessageMetadataDefaultSnippets } from './chat-message-metadata/default/snippets';
import { snippets as chatComposerDefaultSnippets } from './chat-composer/default/snippets';
import { snippets as chatSendButtonDefaultSnippets } from './chat-send-button/default/snippets';
import { snippets as chatSystemMessageDefaultSnippets } from './chat-system-message/default/snippets';
import { snippets as chatToolCallsDefaultSnippets } from './chat-tool-calls/default/snippets';
import { snippets as kbdDefaultSnippets } from './kbd/default/snippets';
import { snippets as skeletonDefaultSnippets } from './skeleton/default/snippets';
import { snippets as statusDotDefaultSnippets } from './status-dot/default/snippets';
import { snippets as stepsDefaultSnippets } from './steps/default/snippets';
import { snippets as loadingOverlayDefaultSnippets } from './loading-overlay/default/snippets';
import { snippets as listDefaultSnippets } from './list/default/snippets';
import { snippets as descriptionListDefaultSnippets } from './description-list/default/snippets';
import { snippets as outlineDefaultSnippets } from './outline/default/snippets';
import { snippets as tocDefaultSnippets } from './toc/default/snippets';
import { snippets as breadcrumbsDefaultSnippets } from './breadcrumbs/default/snippets';
import { snippets as appShellDefaultSnippets } from './app-shell/default/snippets';
import { snippets as simpleGridDefaultSnippets } from './simple-grid/default/snippets';
import { snippets as scrollAreaDefaultSnippets } from './scroll-area/default/snippets';
import { snippets as overflowListDefaultSnippets } from './overflow-list/default/snippets';
import { snippets as resizeHandleDefaultSnippets } from './resize-handle/default/snippets';
import { snippets as paginationDefaultSnippets } from './pagination/default/snippets';
import { snippets as sideNavDefaultSnippets } from './side-nav/default/snippets';
import { snippets as topNavDefaultSnippets } from './top-nav/default/snippets';
import { snippets as topNavMegaMenuDefaultSnippets } from './top-nav-mega-menu/default/snippets';
import { snippets as mobileNavDefaultSnippets } from './mobile-nav/default/snippets';
import { snippets as tabListDefaultSnippets } from './tab-list/default/snippets';
import { snippets as alertDialogDefaultSnippets } from './alert-dialog/default/snippets';
import { snippets as alertDialogConfirmSnippets } from './alert-dialog/confirm/snippets';
import { snippets as drawerDefaultSnippets } from './drawer/default/snippets';
import { snippets as drawerPlacementSnippets } from './drawer/placement/snippets';
import { snippets as tooltipDefaultSnippets } from './tooltip/default/snippets';
import { snippets as tooltipPlacementSnippets } from './tooltip/placement/snippets';
import { snippets as popoverDefaultSnippets } from './popover/default/snippets';
import { snippets as popoverActionsSnippets } from './popover/actions/snippets';
import { snippets as hoverCardDefaultSnippets } from './hover-card/default/snippets';
import { snippets as hoverCardRichSnippets } from './hover-card/rich/snippets';
import { snippets as commandPaletteDefaultSnippets } from './command-palette/default/snippets';
import { snippets as commandPaletteGroupedSnippets } from './command-palette/grouped/snippets';
import { snippets as iconButtonDefaultSnippets } from './icon-button/default/snippets';
import { snippets as iconButtonSizesSnippets } from './icon-button/sizes/snippets';
import { snippets as buttonGroupDefaultSnippets } from './button-group/default/snippets';
import { snippets as buttonGroupIconsSnippets } from './button-group/icons/snippets';
import { snippets as copyButtonDefaultSnippets } from './copy-button/default/snippets';
import { snippets as copyButtonLabelsSnippets } from './copy-button/labels/snippets';
import { snippets as toggleButtonDefaultSnippets } from './toggle-button/default/snippets';
import { snippets as toggleButtonPressedSnippets } from './toggle-button/pressed/snippets';
import { snippets as segmentedControlDefaultSnippets } from './segmented-control/default/snippets';
import { snippets as segmentedControlControlledSnippets } from './segmented-control/controlled/snippets';
import { snippets as colorModeToggleDefaultSnippets } from './color-mode-toggle/default/snippets';
import { snippets as colorModeToggleAppearanceSnippets } from './color-mode-toggle/appearance/snippets';
import { snippets as dropdownMenuDefaultSnippets } from './dropdown-menu/default/snippets';
import { snippets as dropdownMenuSectionsSnippets } from './dropdown-menu/sections/snippets';
import { snippets as contextMenuDefaultSnippets } from './context-menu/default/snippets';
import { snippets as contextMenuSectionsSnippets } from './context-menu/sections/snippets';
import { snippets as moreMenuDefaultSnippets } from './more-menu/default/snippets';
import { snippets as moreMenuOverflowSnippets } from './more-menu/overflow/snippets';
import { snippets as toolbarDefaultSnippets } from './toolbar/default/snippets';
import { snippets as toolbarSlotsSnippets } from './toolbar/slots/snippets';
import { snippets as numberInputDefaultSnippets } from './number-input/default/snippets';
import { snippets as numberInputBoundsSnippets } from './number-input/bounds/snippets';
import { snippets as passwordInputDefaultSnippets } from './password-input/default/snippets';
import { snippets as passwordInputErrorSnippets } from './password-input/error/snippets';
import { snippets as searchInputDefaultSnippets } from './search-input/default/snippets';
import { snippets as searchInputControlledSnippets } from './search-input/controlled/snippets';
import { snippets as fileInputDefaultSnippets } from './file-input/default/snippets';
import { snippets as fileInputMultipleSnippets } from './file-input/multiple/snippets';
import { snippets as inputGroupDefaultSnippets } from './input-group/default/snippets';
import { snippets as inputGroupAddonsSnippets } from './input-group/addons/snippets';
import { snippets as checkboxGroupDefaultSnippets } from './checkbox-group/default/snippets';
import { snippets as checkboxGroupDefaultsSnippets } from './checkbox-group/defaults/snippets';
import { snippets as calendarDefaultSnippets } from './calendar/default/snippets';
import { snippets as dateInputDefaultSnippets } from './date-input/default/snippets';
import { snippets as dateRangeInputDefaultSnippets } from './date-range-input/default/snippets';
import { snippets as dateTimeInputDefaultSnippets } from './date-time-input/default/snippets';
import { snippets as timeInputDefaultSnippets } from './time-input/default/snippets';
import { snippets as tokenizerDefaultSnippets } from './tokenizer/default/snippets';
import { snippets as multiSelectorDefaultSnippets } from './multi-selector/default/snippets';
import { snippets as colorInputDefaultSnippets } from './color-input/default/snippets';
import { snippets as colorPickerDefaultSnippets } from './color-picker/default/snippets';
import { snippets as tableDefaultSnippets } from './table/default/snippets';
import { snippets as treeDefaultSnippets } from './tree/default/snippets';
import { snippets as fileTreeDefaultSnippets } from './file-tree/default/snippets';

export type { DemoEntry, DemoId, DemoSnippets };

export const DEMO_IDS = [
  'button.default',
  'button.variants',
  'button.disabled',
  'stack.default',
  'grid.default',
  'center.default',
  'section.default',
  'divider.default',
  'aspect-ratio.default',
  'heading.default',
  'text.default',
  'link.default',
  'code-block.default',
  'alert.default',
  'banner.default',
  'badge.default',
  'spinner.default',
  'progress-bar.default',
  'empty-state.default',
  'avatar.default',
  'card.default',
  'clickable-card.default',
  'carousel.default',
  'thumbnail.default',
  'timestamp.default',
  'field.default',
  'text-field.default',
  'text-area-field.default',
  'checkbox.default',
  'radio-group.default',
  'switch.default',
  'slider.default',
  'pin-input.default',
  'select.default',
  'select.options',
  'combobox.default',
  'combobox.field',
  'typeahead.default',
  'typeahead.field',
  'tabs.default',
  'dialog.default',
  'layout.default',
  'chip.default',
  'timeline.default',
  'toast.default',
  'accordion.default',
  'collapsible.default',
  'chat-layout.default',
  'chat-message-list.default',
  'chat-message.default',
  'chat-message-bubble.default',
  'chat-message-metadata.default',
  'chat-composer.default',
  'chat-send-button.default',
  'chat-system-message.default',
  'chat-tool-calls.default',
  'kbd.default',
  'skeleton.default',
  'status-dot.default',
  'steps.default',
  'loading-overlay.default',
  'list.default',
  'description-list.default',
  'outline.default',
  'toc.default',
  'breadcrumbs.default',
  'app-shell.default',
  'simple-grid.default',
  'scroll-area.default',
  'overflow-list.default',
  'resize-handle.default',
  'pagination.default',
  'side-nav.default',
  'top-nav.default',
  'top-nav-mega-menu.default',
  'mobile-nav.default',
  'tab-list.default',
  'alert-dialog.default',
  'alert-dialog.confirm',
  'drawer.default',
  'drawer.placement',
  'tooltip.default',
  'tooltip.placement',
  'popover.default',
  'popover.actions',
  'hover-card.default',
  'hover-card.rich',
  'command-palette.default',
  'command-palette.grouped',
  'icon-button.default',
  'icon-button.sizes',
  'button-group.default',
  'button-group.icons',
  'copy-button.default',
  'copy-button.labels',
  'toggle-button.default',
  'toggle-button.pressed',
  'segmented-control.default',
  'segmented-control.controlled',
  'color-mode-toggle.default',
  'color-mode-toggle.appearance',
  'dropdown-menu.default',
  'dropdown-menu.sections',
  'context-menu.default',
  'context-menu.sections',
  'more-menu.default',
  'more-menu.overflow',
  'toolbar.default',
  'toolbar.slots',
  'number-input.default',
  'number-input.bounds',
  'password-input.default',
  'password-input.error',
  'search-input.default',
  'search-input.controlled',
  'file-input.default',
  'file-input.multiple',
  'input-group.default',
  'input-group.addons',
  'checkbox-group.default',
  'checkbox-group.defaults',
  'calendar.default',
  'date-input.default',
  'date-range-input.default',
  'date-time-input.default',
  'time-input.default',
  'tokenizer.default',
  'multi-selector.default',
  'color-input.default',
  'color-picker.default',
  'table.default',
  'tree.default',
  'file-tree.default',
] as const satisfies readonly DemoId[];

export const demoSnippets: Record<DemoId, DemoSnippets> = {
  'button.default': buttonDefaultSnippets,
  'button.variants': buttonVariantsSnippets,
  'button.disabled': buttonDisabledSnippets,
  'stack.default': stackDefaultSnippets,
  'grid.default': gridDefaultSnippets,
  'center.default': centerDefaultSnippets,
  'section.default': sectionDefaultSnippets,
  'divider.default': dividerDefaultSnippets,
  'aspect-ratio.default': aspectRatioDefaultSnippets,
  'heading.default': headingDefaultSnippets,
  'text.default': textDefaultSnippets,
  'link.default': linkDefaultSnippets,
  'code-block.default': codeBlockDefaultSnippets,
  'alert.default': alertDefaultSnippets,
  'banner.default': bannerDefaultSnippets,
  'badge.default': badgeDefaultSnippets,
  'spinner.default': spinnerDefaultSnippets,
  'progress-bar.default': progressBarDefaultSnippets,
  'empty-state.default': emptyStateDefaultSnippets,
  'avatar.default': avatarDefaultSnippets,
  'card.default': cardDefaultSnippets,
  'clickable-card.default': clickableCardDefaultSnippets,
  'carousel.default': carouselDefaultSnippets,
  'thumbnail.default': thumbnailDefaultSnippets,
  'timestamp.default': timestampDefaultSnippets,
  'field.default': fieldDefaultSnippets,
  'text-field.default': textFieldDefaultSnippets,
  'text-area-field.default': textAreaFieldDefaultSnippets,
  'checkbox.default': checkboxDefaultSnippets,
  'radio-group.default': radioGroupDefaultSnippets,
  'switch.default': switchDefaultSnippets,
  'slider.default': sliderDefaultSnippets,
  'pin-input.default': pinInputDefaultSnippets,
  'select.default': selectDefaultSnippets,
  'select.options': selectOptionsSnippets,
  'combobox.default': comboboxDefaultSnippets,
  'combobox.field': comboboxFieldSnippets,
  'typeahead.default': typeaheadDefaultSnippets,
  'typeahead.field': typeaheadFieldSnippets,
  'tabs.default': tabsDefaultSnippets,
  'dialog.default': dialogDefaultSnippets,
  'layout.default': layoutDefaultSnippets,
  'chip.default': chipDefaultSnippets,
  'timeline.default': timelineDefaultSnippets,
  'toast.default': toastDefaultSnippets,
  'accordion.default': accordionDefaultSnippets,
  'collapsible.default': collapsibleDefaultSnippets,
  'chat-layout.default': chatLayoutDefaultSnippets,
  'chat-message-list.default': chatMessageListDefaultSnippets,
  'chat-message.default': chatMessageDefaultSnippets,
  'chat-message-bubble.default': chatMessageBubbleDefaultSnippets,
  'chat-message-metadata.default': chatMessageMetadataDefaultSnippets,
  'chat-composer.default': chatComposerDefaultSnippets,
  'chat-send-button.default': chatSendButtonDefaultSnippets,
  'chat-system-message.default': chatSystemMessageDefaultSnippets,
  'chat-tool-calls.default': chatToolCallsDefaultSnippets,
  'kbd.default': kbdDefaultSnippets,
  'skeleton.default': skeletonDefaultSnippets,
  'status-dot.default': statusDotDefaultSnippets,
  'steps.default': stepsDefaultSnippets,
  'loading-overlay.default': loadingOverlayDefaultSnippets,
  'list.default': listDefaultSnippets,
  'description-list.default': descriptionListDefaultSnippets,
  'outline.default': outlineDefaultSnippets,
  'toc.default': tocDefaultSnippets,
  'breadcrumbs.default': breadcrumbsDefaultSnippets,
  'app-shell.default': appShellDefaultSnippets,
  'simple-grid.default': simpleGridDefaultSnippets,
  'scroll-area.default': scrollAreaDefaultSnippets,
  'overflow-list.default': overflowListDefaultSnippets,
  'resize-handle.default': resizeHandleDefaultSnippets,
  'pagination.default': paginationDefaultSnippets,
  'side-nav.default': sideNavDefaultSnippets,
  'top-nav.default': topNavDefaultSnippets,
  'top-nav-mega-menu.default': topNavMegaMenuDefaultSnippets,
  'mobile-nav.default': mobileNavDefaultSnippets,
  'tab-list.default': tabListDefaultSnippets,
  'alert-dialog.default': alertDialogDefaultSnippets,
  'alert-dialog.confirm': alertDialogConfirmSnippets,
  'drawer.default': drawerDefaultSnippets,
  'drawer.placement': drawerPlacementSnippets,
  'tooltip.default': tooltipDefaultSnippets,
  'tooltip.placement': tooltipPlacementSnippets,
  'popover.default': popoverDefaultSnippets,
  'popover.actions': popoverActionsSnippets,
  'hover-card.default': hoverCardDefaultSnippets,
  'hover-card.rich': hoverCardRichSnippets,
  'command-palette.default': commandPaletteDefaultSnippets,
  'command-palette.grouped': commandPaletteGroupedSnippets,
  'icon-button.default': iconButtonDefaultSnippets,
  'icon-button.sizes': iconButtonSizesSnippets,
  'button-group.default': buttonGroupDefaultSnippets,
  'button-group.icons': buttonGroupIconsSnippets,
  'copy-button.default': copyButtonDefaultSnippets,
  'copy-button.labels': copyButtonLabelsSnippets,
  'toggle-button.default': toggleButtonDefaultSnippets,
  'toggle-button.pressed': toggleButtonPressedSnippets,
  'segmented-control.default': segmentedControlDefaultSnippets,
  'segmented-control.controlled': segmentedControlControlledSnippets,
  'color-mode-toggle.default': colorModeToggleDefaultSnippets,
  'color-mode-toggle.appearance': colorModeToggleAppearanceSnippets,
  'dropdown-menu.default': dropdownMenuDefaultSnippets,
  'dropdown-menu.sections': dropdownMenuSectionsSnippets,
  'context-menu.default': contextMenuDefaultSnippets,
  'context-menu.sections': contextMenuSectionsSnippets,
  'more-menu.default': moreMenuDefaultSnippets,
  'more-menu.overflow': moreMenuOverflowSnippets,
  'toolbar.default': toolbarDefaultSnippets,
  'toolbar.slots': toolbarSlotsSnippets,
  'number-input.default': numberInputDefaultSnippets,
  'number-input.bounds': numberInputBoundsSnippets,
  'password-input.default': passwordInputDefaultSnippets,
  'password-input.error': passwordInputErrorSnippets,
  'search-input.default': searchInputDefaultSnippets,
  'search-input.controlled': searchInputControlledSnippets,
  'file-input.default': fileInputDefaultSnippets,
  'file-input.multiple': fileInputMultipleSnippets,
  'input-group.default': inputGroupDefaultSnippets,
  'input-group.addons': inputGroupAddonsSnippets,
  'checkbox-group.default': checkboxGroupDefaultSnippets,
  'checkbox-group.defaults': checkboxGroupDefaultsSnippets,
  'calendar.default': calendarDefaultSnippets,
  'date-input.default': dateInputDefaultSnippets,
  'date-range-input.default': dateRangeInputDefaultSnippets,
  'date-time-input.default': dateTimeInputDefaultSnippets,
  'time-input.default': timeInputDefaultSnippets,
  'tokenizer.default': tokenizerDefaultSnippets,
  'multi-selector.default': multiSelectorDefaultSnippets,
  'color-input.default': colorInputDefaultSnippets,
  'color-picker.default': colorPickerDefaultSnippets,
  'table.default': tableDefaultSnippets,
  'tree.default': treeDefaultSnippets,
  'file-tree.default': fileTreeDefaultSnippets,
};

export const reactDemoLoaders: Record<DemoId, DemoEntry['react']> = {
  'button.default': () => import('./button/default/react'),
  'button.variants': () => import('./button/variants/react'),
  'button.disabled': () => import('./button/disabled/react'),
  'stack.default': () => import('./stack/default/react'),
  'grid.default': () => import('./grid/default/react'),
  'center.default': () => import('./center/default/react'),
  'section.default': () => import('./section/default/react'),
  'divider.default': () => import('./divider/default/react'),
  'aspect-ratio.default': () => import('./aspect-ratio/default/react'),
  'heading.default': () => import('./heading/default/react'),
  'text.default': () => import('./text/default/react'),
  'link.default': () => import('./link/default/react'),
  'code-block.default': () => import('./code-block/default/react'),
  'alert.default': () => import('./alert/default/react'),
  'banner.default': () => import('./banner/default/react'),
  'badge.default': () => import('./badge/default/react'),
  'spinner.default': () => import('./spinner/default/react'),
  'progress-bar.default': () => import('./progress-bar/default/react'),
  'empty-state.default': () => import('./empty-state/default/react'),
  'avatar.default': () => import('./avatar/default/react'),
  'card.default': () => import('./card/default/react'),
  'clickable-card.default': () => import('./clickable-card/default/react'),
  'carousel.default': () => import('./carousel/default/react'),
  'thumbnail.default': () => import('./thumbnail/default/react'),
  'timestamp.default': () => import('./timestamp/default/react'),
  'field.default': () => import('./field/default/react'),
  'text-field.default': () => import('./text-field/default/react'),
  'text-area-field.default': () => import('./text-area-field/default/react'),
  'checkbox.default': () => import('./checkbox/default/react'),
  'radio-group.default': () => import('./radio-group/default/react'),
  'switch.default': () => import('./switch/default/react'),
  'slider.default': () => import('./slider/default/react'),
  'pin-input.default': () => import('./pin-input/default/react'),
  'select.default': () => import('./select/default/react'),
  'select.options': () => import('./select/options/react'),
  'combobox.default': () => import('./combobox/default/react'),
  'combobox.field': () => import('./combobox/field/react'),
  'typeahead.default': () => import('./typeahead/default/react'),
  'typeahead.field': () => import('./typeahead/field/react'),
  'tabs.default': () => import('./tabs/default/react'),
  'dialog.default': () => import('./dialog/default/react'),
  'layout.default': () => import('./layout/default/react'),
  'chip.default': () => import('./chip/default/react'),
  'timeline.default': () => import('./timeline/default/react'),
  'toast.default': () => import('./toast/default/react'),
  'accordion.default': () => import('./accordion/default/react'),
  'collapsible.default': () => import('./collapsible/default/react'),
  'chat-layout.default': () => import('./chat-layout/default/react'),
  'chat-message-list.default': () => import('./chat-message-list/default/react'),
  'chat-message.default': () => import('./chat-message/default/react'),
  'chat-message-bubble.default': () => import('./chat-message-bubble/default/react'),
  'chat-message-metadata.default': () => import('./chat-message-metadata/default/react'),
  'chat-composer.default': () => import('./chat-composer/default/react'),
  'chat-send-button.default': () => import('./chat-send-button/default/react'),
  'chat-system-message.default': () => import('./chat-system-message/default/react'),
  'chat-tool-calls.default': () => import('./chat-tool-calls/default/react'),
  'kbd.default': () => import('./kbd/default/react'),
  'skeleton.default': () => import('./skeleton/default/react'),
  'status-dot.default': () => import('./status-dot/default/react'),
  'steps.default': () => import('./steps/default/react'),
  'loading-overlay.default': () => import('./loading-overlay/default/react'),
  'list.default': () => import('./list/default/react'),
  'description-list.default': () => import('./description-list/default/react'),
  'outline.default': () => import('./outline/default/react'),
  'toc.default': () => import('./toc/default/react'),
  'breadcrumbs.default': () => import('./breadcrumbs/default/react'),
  'app-shell.default': () => import('./app-shell/default/react'),
  'simple-grid.default': () => import('./simple-grid/default/react'),
  'scroll-area.default': () => import('./scroll-area/default/react'),
  'overflow-list.default': () => import('./overflow-list/default/react'),
  'resize-handle.default': () => import('./resize-handle/default/react'),
  'pagination.default': () => import('./pagination/default/react'),
  'side-nav.default': () => import('./side-nav/default/react'),
  'top-nav.default': () => import('./top-nav/default/react'),
  'top-nav-mega-menu.default': () => import('./top-nav-mega-menu/default/react'),
  'mobile-nav.default': () => import('./mobile-nav/default/react'),
  'tab-list.default': () => import('./tab-list/default/react'),
  'alert-dialog.default': () => import('./alert-dialog/default/react'),
  'alert-dialog.confirm': () => import('./alert-dialog/confirm/react'),
  'drawer.default': () => import('./drawer/default/react'),
  'drawer.placement': () => import('./drawer/placement/react'),
  'tooltip.default': () => import('./tooltip/default/react'),
  'tooltip.placement': () => import('./tooltip/placement/react'),
  'popover.default': () => import('./popover/default/react'),
  'popover.actions': () => import('./popover/actions/react'),
  'hover-card.default': () => import('./hover-card/default/react'),
  'hover-card.rich': () => import('./hover-card/rich/react'),
  'command-palette.default': () => import('./command-palette/default/react'),
  'command-palette.grouped': () => import('./command-palette/grouped/react'),
  'icon-button.default': () => import('./icon-button/default/react'),
  'icon-button.sizes': () => import('./icon-button/sizes/react'),
  'button-group.default': () => import('./button-group/default/react'),
  'button-group.icons': () => import('./button-group/icons/react'),
  'copy-button.default': () => import('./copy-button/default/react'),
  'copy-button.labels': () => import('./copy-button/labels/react'),
  'toggle-button.default': () => import('./toggle-button/default/react'),
  'toggle-button.pressed': () => import('./toggle-button/pressed/react'),
  'segmented-control.default': () => import('./segmented-control/default/react'),
  'segmented-control.controlled': () => import('./segmented-control/controlled/react'),
  'color-mode-toggle.default': () => import('./color-mode-toggle/default/react'),
  'color-mode-toggle.appearance': () => import('./color-mode-toggle/appearance/react'),
  'dropdown-menu.default': () => import('./dropdown-menu/default/react'),
  'dropdown-menu.sections': () => import('./dropdown-menu/sections/react'),
  'context-menu.default': () => import('./context-menu/default/react'),
  'context-menu.sections': () => import('./context-menu/sections/react'),
  'more-menu.default': () => import('./more-menu/default/react'),
  'more-menu.overflow': () => import('./more-menu/overflow/react'),
  'toolbar.default': () => import('./toolbar/default/react'),
  'toolbar.slots': () => import('./toolbar/slots/react'),
  'number-input.default': () => import('./number-input/default/react'),
  'number-input.bounds': () => import('./number-input/bounds/react'),
  'password-input.default': () => import('./password-input/default/react'),
  'password-input.error': () => import('./password-input/error/react'),
  'search-input.default': () => import('./search-input/default/react'),
  'search-input.controlled': () => import('./search-input/controlled/react'),
  'file-input.default': () => import('./file-input/default/react'),
  'file-input.multiple': () => import('./file-input/multiple/react'),
  'input-group.default': () => import('./input-group/default/react'),
  'input-group.addons': () => import('./input-group/addons/react'),
  'checkbox-group.default': () => import('./checkbox-group/default/react'),
  'checkbox-group.defaults': () => import('./checkbox-group/defaults/react'),
  'calendar.default': () => import('./calendar/default/react'),
  'date-input.default': () => import('./date-input/default/react'),
  'date-range-input.default': () => import('./date-range-input/default/react'),
  'date-time-input.default': () => import('./date-time-input/default/react'),
  'time-input.default': () => import('./time-input/default/react'),
  'tokenizer.default': () => import('./tokenizer/default/react'),
  'multi-selector.default': () => import('./multi-selector/default/react'),
  'color-input.default': () => import('./color-input/default/react'),
  'color-picker.default': () => import('./color-picker/default/react'),
  'table.default': () => import('./table/default/react'),
  'tree.default': () => import('./tree/default/react'),
  'file-tree.default': () => import('./file-tree/default/react'),
};

export const demoRegistry: Record<DemoId, DemoEntry> = {
  'button.default': {
    id: 'button.default',
    snippets: demoSnippets['button.default'],
    react: reactDemoLoaders['button.default'],
  },
  'button.variants': {
    id: 'button.variants',
    snippets: demoSnippets['button.variants'],
    react: reactDemoLoaders['button.variants'],
  },
  'button.disabled': {
    id: 'button.disabled',
    snippets: demoSnippets['button.disabled'],
    react: reactDemoLoaders['button.disabled'],
  },
  'stack.default': {
    id: 'stack.default',
    snippets: demoSnippets['stack.default'],
    react: reactDemoLoaders['stack.default'],
  },
  'grid.default': {
    id: 'grid.default',
    snippets: demoSnippets['grid.default'],
    react: reactDemoLoaders['grid.default'],
  },
  'center.default': {
    id: 'center.default',
    snippets: demoSnippets['center.default'],
    react: reactDemoLoaders['center.default'],
  },
  'section.default': {
    id: 'section.default',
    snippets: demoSnippets['section.default'],
    react: reactDemoLoaders['section.default'],
  },
  'divider.default': {
    id: 'divider.default',
    snippets: demoSnippets['divider.default'],
    react: reactDemoLoaders['divider.default'],
  },
  'aspect-ratio.default': {
    id: 'aspect-ratio.default',
    snippets: demoSnippets['aspect-ratio.default'],
    react: reactDemoLoaders['aspect-ratio.default'],
  },
  'heading.default': {
    id: 'heading.default',
    snippets: demoSnippets['heading.default'],
    react: reactDemoLoaders['heading.default'],
  },
  'text.default': {
    id: 'text.default',
    snippets: demoSnippets['text.default'],
    react: reactDemoLoaders['text.default'],
  },
  'link.default': {
    id: 'link.default',
    snippets: demoSnippets['link.default'],
    react: reactDemoLoaders['link.default'],
  },
  'code-block.default': {
    id: 'code-block.default',
    snippets: demoSnippets['code-block.default'],
    react: reactDemoLoaders['code-block.default'],
  },
  'alert.default': {
    id: 'alert.default',
    snippets: demoSnippets['alert.default'],
    react: reactDemoLoaders['alert.default'],
  },
  'banner.default': {
    id: 'banner.default',
    snippets: demoSnippets['banner.default'],
    react: reactDemoLoaders['banner.default'],
  },
  'badge.default': {
    id: 'badge.default',
    snippets: demoSnippets['badge.default'],
    react: reactDemoLoaders['badge.default'],
  },
  'spinner.default': {
    id: 'spinner.default',
    snippets: demoSnippets['spinner.default'],
    react: reactDemoLoaders['spinner.default'],
  },
  'progress-bar.default': {
    id: 'progress-bar.default',
    snippets: demoSnippets['progress-bar.default'],
    react: reactDemoLoaders['progress-bar.default'],
  },
  'empty-state.default': {
    id: 'empty-state.default',
    snippets: demoSnippets['empty-state.default'],
    react: reactDemoLoaders['empty-state.default'],
  },
  'avatar.default': {
    id: 'avatar.default',
    snippets: demoSnippets['avatar.default'],
    react: reactDemoLoaders['avatar.default'],
  },
  'card.default': {
    id: 'card.default',
    snippets: demoSnippets['card.default'],
    react: reactDemoLoaders['card.default'],
  },
  'clickable-card.default': {
    id: 'clickable-card.default',
    snippets: demoSnippets['clickable-card.default'],
    react: reactDemoLoaders['clickable-card.default'],
  },
  'carousel.default': {
    id: 'carousel.default',
    snippets: demoSnippets['carousel.default'],
    react: reactDemoLoaders['carousel.default'],
  },
  'thumbnail.default': {
    id: 'thumbnail.default',
    snippets: demoSnippets['thumbnail.default'],
    react: reactDemoLoaders['thumbnail.default'],
  },
  'timestamp.default': {
    id: 'timestamp.default',
    snippets: demoSnippets['timestamp.default'],
    react: reactDemoLoaders['timestamp.default'],
  },
  'field.default': {
    id: 'field.default',
    snippets: demoSnippets['field.default'],
    react: reactDemoLoaders['field.default'],
  },
  'text-field.default': {
    id: 'text-field.default',
    snippets: demoSnippets['text-field.default'],
    react: reactDemoLoaders['text-field.default'],
  },
  'text-area-field.default': {
    id: 'text-area-field.default',
    snippets: demoSnippets['text-area-field.default'],
    react: reactDemoLoaders['text-area-field.default'],
  },
  'checkbox.default': {
    id: 'checkbox.default',
    snippets: demoSnippets['checkbox.default'],
    react: reactDemoLoaders['checkbox.default'],
  },
  'radio-group.default': {
    id: 'radio-group.default',
    snippets: demoSnippets['radio-group.default'],
    react: reactDemoLoaders['radio-group.default'],
  },
  'switch.default': {
    id: 'switch.default',
    snippets: demoSnippets['switch.default'],
    react: reactDemoLoaders['switch.default'],
  },
  'slider.default': {
    id: 'slider.default',
    snippets: demoSnippets['slider.default'],
    react: reactDemoLoaders['slider.default'],
  },
  'pin-input.default': {
    id: 'pin-input.default',
    snippets: demoSnippets['pin-input.default'],
    react: reactDemoLoaders['pin-input.default'],
  },
  'select.default': {
    id: 'select.default',
    snippets: demoSnippets['select.default'],
    react: reactDemoLoaders['select.default'],
  },
  'select.options': {
    id: 'select.options',
    snippets: demoSnippets['select.options'],
    react: reactDemoLoaders['select.options'],
  },
  'combobox.default': {
    id: 'combobox.default',
    snippets: demoSnippets['combobox.default'],
    react: reactDemoLoaders['combobox.default'],
  },
  'combobox.field': {
    id: 'combobox.field',
    snippets: demoSnippets['combobox.field'],
    react: reactDemoLoaders['combobox.field'],
  },
  'typeahead.default': {
    id: 'typeahead.default',
    snippets: demoSnippets['typeahead.default'],
    react: reactDemoLoaders['typeahead.default'],
  },
  'typeahead.field': {
    id: 'typeahead.field',
    snippets: demoSnippets['typeahead.field'],
    react: reactDemoLoaders['typeahead.field'],
  },
  'tabs.default': {
    id: 'tabs.default',
    snippets: demoSnippets['tabs.default'],
    react: reactDemoLoaders['tabs.default'],
  },
  'dialog.default': {
    id: 'dialog.default',
    snippets: demoSnippets['dialog.default'],
    react: reactDemoLoaders['dialog.default'],
  },
  'layout.default': {
    id: 'layout.default',
    snippets: demoSnippets['layout.default'],
    react: reactDemoLoaders['layout.default'],
  },
  'chip.default': {
    id: 'chip.default',
    snippets: demoSnippets['chip.default'],
    react: reactDemoLoaders['chip.default'],
  },
  'timeline.default': {
    id: 'timeline.default',
    snippets: demoSnippets['timeline.default'],
    react: reactDemoLoaders['timeline.default'],
  },
  'toast.default': {
    id: 'toast.default',
    snippets: demoSnippets['toast.default'],
    react: reactDemoLoaders['toast.default'],
  },
  'accordion.default': {
    id: 'accordion.default',
    snippets: demoSnippets['accordion.default'],
    react: reactDemoLoaders['accordion.default'],
  },
  'collapsible.default': {
    id: 'collapsible.default',
    snippets: demoSnippets['collapsible.default'],
    react: reactDemoLoaders['collapsible.default'],
  },
  'chat-layout.default': {
    id: 'chat-layout.default',
    snippets: demoSnippets['chat-layout.default'],
    react: reactDemoLoaders['chat-layout.default'],
  },
  'chat-message-list.default': {
    id: 'chat-message-list.default',
    snippets: demoSnippets['chat-message-list.default'],
    react: reactDemoLoaders['chat-message-list.default'],
  },
  'chat-message.default': {
    id: 'chat-message.default',
    snippets: demoSnippets['chat-message.default'],
    react: reactDemoLoaders['chat-message.default'],
  },
  'chat-message-bubble.default': {
    id: 'chat-message-bubble.default',
    snippets: demoSnippets['chat-message-bubble.default'],
    react: reactDemoLoaders['chat-message-bubble.default'],
  },
  'chat-message-metadata.default': {
    id: 'chat-message-metadata.default',
    snippets: demoSnippets['chat-message-metadata.default'],
    react: reactDemoLoaders['chat-message-metadata.default'],
  },
  'chat-composer.default': {
    id: 'chat-composer.default',
    snippets: demoSnippets['chat-composer.default'],
    react: reactDemoLoaders['chat-composer.default'],
  },
  'chat-send-button.default': {
    id: 'chat-send-button.default',
    snippets: demoSnippets['chat-send-button.default'],
    react: reactDemoLoaders['chat-send-button.default'],
  },
  'chat-system-message.default': {
    id: 'chat-system-message.default',
    snippets: demoSnippets['chat-system-message.default'],
    react: reactDemoLoaders['chat-system-message.default'],
  },
  'chat-tool-calls.default': {
    id: 'chat-tool-calls.default',
    snippets: demoSnippets['chat-tool-calls.default'],
    react: reactDemoLoaders['chat-tool-calls.default'],
  },
  'kbd.default': {
    id: 'kbd.default',
    snippets: demoSnippets['kbd.default'],
    react: reactDemoLoaders['kbd.default'],
  },
  'skeleton.default': {
    id: 'skeleton.default',
    snippets: demoSnippets['skeleton.default'],
    react: reactDemoLoaders['skeleton.default'],
  },
  'status-dot.default': {
    id: 'status-dot.default',
    snippets: demoSnippets['status-dot.default'],
    react: reactDemoLoaders['status-dot.default'],
  },
  'steps.default': {
    id: 'steps.default',
    snippets: demoSnippets['steps.default'],
    react: reactDemoLoaders['steps.default'],
  },
  'loading-overlay.default': {
    id: 'loading-overlay.default',
    snippets: demoSnippets['loading-overlay.default'],
    react: reactDemoLoaders['loading-overlay.default'],
  },
  'list.default': {
    id: 'list.default',
    snippets: demoSnippets['list.default'],
    react: reactDemoLoaders['list.default'],
  },
  'description-list.default': {
    id: 'description-list.default',
    snippets: demoSnippets['description-list.default'],
    react: reactDemoLoaders['description-list.default'],
  },
  'outline.default': {
    id: 'outline.default',
    snippets: demoSnippets['outline.default'],
    react: reactDemoLoaders['outline.default'],
  },
  'toc.default': {
    id: 'toc.default',
    snippets: demoSnippets['toc.default'],
    react: reactDemoLoaders['toc.default'],
  },
  'breadcrumbs.default': {
    id: 'breadcrumbs.default',
    snippets: demoSnippets['breadcrumbs.default'],
    react: reactDemoLoaders['breadcrumbs.default'],
  },
  'app-shell.default': {
    id: 'app-shell.default',
    snippets: demoSnippets['app-shell.default'],
    react: reactDemoLoaders['app-shell.default'],
  },
  'simple-grid.default': {
    id: 'simple-grid.default',
    snippets: demoSnippets['simple-grid.default'],
    react: reactDemoLoaders['simple-grid.default'],
  },
  'scroll-area.default': {
    id: 'scroll-area.default',
    snippets: demoSnippets['scroll-area.default'],
    react: reactDemoLoaders['scroll-area.default'],
  },
  'overflow-list.default': {
    id: 'overflow-list.default',
    snippets: demoSnippets['overflow-list.default'],
    react: reactDemoLoaders['overflow-list.default'],
  },
  'resize-handle.default': {
    id: 'resize-handle.default',
    snippets: demoSnippets['resize-handle.default'],
    react: reactDemoLoaders['resize-handle.default'],
  },
  'pagination.default': {
    id: 'pagination.default',
    snippets: demoSnippets['pagination.default'],
    react: reactDemoLoaders['pagination.default'],
  },
  'side-nav.default': {
    id: 'side-nav.default',
    snippets: demoSnippets['side-nav.default'],
    react: reactDemoLoaders['side-nav.default'],
  },
  'top-nav.default': {
    id: 'top-nav.default',
    snippets: demoSnippets['top-nav.default'],
    react: reactDemoLoaders['top-nav.default'],
  },
  'top-nav-mega-menu.default': {
    id: 'top-nav-mega-menu.default',
    snippets: demoSnippets['top-nav-mega-menu.default'],
    react: reactDemoLoaders['top-nav-mega-menu.default'],
  },
  'mobile-nav.default': {
    id: 'mobile-nav.default',
    snippets: demoSnippets['mobile-nav.default'],
    react: reactDemoLoaders['mobile-nav.default'],
  },
  'tab-list.default': {
    id: 'tab-list.default',
    snippets: demoSnippets['tab-list.default'],
    react: reactDemoLoaders['tab-list.default'],
  },
  'alert-dialog.default': {
    id: 'alert-dialog.default',
    snippets: demoSnippets['alert-dialog.default'],
    react: reactDemoLoaders['alert-dialog.default'],
  },
  'alert-dialog.confirm': {
    id: 'alert-dialog.confirm',
    snippets: demoSnippets['alert-dialog.confirm'],
    react: reactDemoLoaders['alert-dialog.confirm'],
  },
  'drawer.default': {
    id: 'drawer.default',
    snippets: demoSnippets['drawer.default'],
    react: reactDemoLoaders['drawer.default'],
  },
  'drawer.placement': {
    id: 'drawer.placement',
    snippets: demoSnippets['drawer.placement'],
    react: reactDemoLoaders['drawer.placement'],
  },
  'tooltip.default': {
    id: 'tooltip.default',
    snippets: demoSnippets['tooltip.default'],
    react: reactDemoLoaders['tooltip.default'],
  },
  'tooltip.placement': {
    id: 'tooltip.placement',
    snippets: demoSnippets['tooltip.placement'],
    react: reactDemoLoaders['tooltip.placement'],
  },
  'popover.default': {
    id: 'popover.default',
    snippets: demoSnippets['popover.default'],
    react: reactDemoLoaders['popover.default'],
  },
  'popover.actions': {
    id: 'popover.actions',
    snippets: demoSnippets['popover.actions'],
    react: reactDemoLoaders['popover.actions'],
  },
  'hover-card.default': {
    id: 'hover-card.default',
    snippets: demoSnippets['hover-card.default'],
    react: reactDemoLoaders['hover-card.default'],
  },
  'hover-card.rich': {
    id: 'hover-card.rich',
    snippets: demoSnippets['hover-card.rich'],
    react: reactDemoLoaders['hover-card.rich'],
  },
  'command-palette.default': {
    id: 'command-palette.default',
    snippets: demoSnippets['command-palette.default'],
    react: reactDemoLoaders['command-palette.default'],
  },
  'command-palette.grouped': {
    id: 'command-palette.grouped',
    snippets: demoSnippets['command-palette.grouped'],
    react: reactDemoLoaders['command-palette.grouped'],
  },
  'icon-button.default': {
    id: 'icon-button.default',
    snippets: demoSnippets['icon-button.default'],
    react: reactDemoLoaders['icon-button.default'],
  },
  'icon-button.sizes': {
    id: 'icon-button.sizes',
    snippets: demoSnippets['icon-button.sizes'],
    react: reactDemoLoaders['icon-button.sizes'],
  },
  'button-group.default': {
    id: 'button-group.default',
    snippets: demoSnippets['button-group.default'],
    react: reactDemoLoaders['button-group.default'],
  },
  'button-group.icons': {
    id: 'button-group.icons',
    snippets: demoSnippets['button-group.icons'],
    react: reactDemoLoaders['button-group.icons'],
  },
  'copy-button.default': {
    id: 'copy-button.default',
    snippets: demoSnippets['copy-button.default'],
    react: reactDemoLoaders['copy-button.default'],
  },
  'copy-button.labels': {
    id: 'copy-button.labels',
    snippets: demoSnippets['copy-button.labels'],
    react: reactDemoLoaders['copy-button.labels'],
  },
  'toggle-button.default': {
    id: 'toggle-button.default',
    snippets: demoSnippets['toggle-button.default'],
    react: reactDemoLoaders['toggle-button.default'],
  },
  'toggle-button.pressed': {
    id: 'toggle-button.pressed',
    snippets: demoSnippets['toggle-button.pressed'],
    react: reactDemoLoaders['toggle-button.pressed'],
  },
  'segmented-control.default': {
    id: 'segmented-control.default',
    snippets: demoSnippets['segmented-control.default'],
    react: reactDemoLoaders['segmented-control.default'],
  },
  'segmented-control.controlled': {
    id: 'segmented-control.controlled',
    snippets: demoSnippets['segmented-control.controlled'],
    react: reactDemoLoaders['segmented-control.controlled'],
  },
  'color-mode-toggle.default': {
    id: 'color-mode-toggle.default',
    snippets: demoSnippets['color-mode-toggle.default'],
    react: reactDemoLoaders['color-mode-toggle.default'],
  },
  'color-mode-toggle.appearance': {
    id: 'color-mode-toggle.appearance',
    snippets: demoSnippets['color-mode-toggle.appearance'],
    react: reactDemoLoaders['color-mode-toggle.appearance'],
  },
  'dropdown-menu.default': {
    id: 'dropdown-menu.default',
    snippets: demoSnippets['dropdown-menu.default'],
    react: reactDemoLoaders['dropdown-menu.default'],
  },
  'dropdown-menu.sections': {
    id: 'dropdown-menu.sections',
    snippets: demoSnippets['dropdown-menu.sections'],
    react: reactDemoLoaders['dropdown-menu.sections'],
  },
  'context-menu.default': {
    id: 'context-menu.default',
    snippets: demoSnippets['context-menu.default'],
    react: reactDemoLoaders['context-menu.default'],
  },
  'context-menu.sections': {
    id: 'context-menu.sections',
    snippets: demoSnippets['context-menu.sections'],
    react: reactDemoLoaders['context-menu.sections'],
  },
  'more-menu.default': {
    id: 'more-menu.default',
    snippets: demoSnippets['more-menu.default'],
    react: reactDemoLoaders['more-menu.default'],
  },
  'more-menu.overflow': {
    id: 'more-menu.overflow',
    snippets: demoSnippets['more-menu.overflow'],
    react: reactDemoLoaders['more-menu.overflow'],
  },
  'toolbar.default': {
    id: 'toolbar.default',
    snippets: demoSnippets['toolbar.default'],
    react: reactDemoLoaders['toolbar.default'],
  },
  'toolbar.slots': {
    id: 'toolbar.slots',
    snippets: demoSnippets['toolbar.slots'],
    react: reactDemoLoaders['toolbar.slots'],
  },
  'number-input.default': {
    id: 'number-input.default',
    snippets: demoSnippets['number-input.default'],
    react: reactDemoLoaders['number-input.default'],
  },
  'number-input.bounds': {
    id: 'number-input.bounds',
    snippets: demoSnippets['number-input.bounds'],
    react: reactDemoLoaders['number-input.bounds'],
  },
  'password-input.default': {
    id: 'password-input.default',
    snippets: demoSnippets['password-input.default'],
    react: reactDemoLoaders['password-input.default'],
  },
  'password-input.error': {
    id: 'password-input.error',
    snippets: demoSnippets['password-input.error'],
    react: reactDemoLoaders['password-input.error'],
  },
  'search-input.default': {
    id: 'search-input.default',
    snippets: demoSnippets['search-input.default'],
    react: reactDemoLoaders['search-input.default'],
  },
  'search-input.controlled': {
    id: 'search-input.controlled',
    snippets: demoSnippets['search-input.controlled'],
    react: reactDemoLoaders['search-input.controlled'],
  },
  'file-input.default': {
    id: 'file-input.default',
    snippets: demoSnippets['file-input.default'],
    react: reactDemoLoaders['file-input.default'],
  },
  'file-input.multiple': {
    id: 'file-input.multiple',
    snippets: demoSnippets['file-input.multiple'],
    react: reactDemoLoaders['file-input.multiple'],
  },
  'input-group.default': {
    id: 'input-group.default',
    snippets: demoSnippets['input-group.default'],
    react: reactDemoLoaders['input-group.default'],
  },
  'input-group.addons': {
    id: 'input-group.addons',
    snippets: demoSnippets['input-group.addons'],
    react: reactDemoLoaders['input-group.addons'],
  },
  'checkbox-group.default': {
    id: 'checkbox-group.default',
    snippets: demoSnippets['checkbox-group.default'],
    react: reactDemoLoaders['checkbox-group.default'],
  },
  'checkbox-group.defaults': {
    id: 'checkbox-group.defaults',
    snippets: demoSnippets['checkbox-group.defaults'],
    react: reactDemoLoaders['checkbox-group.defaults'],
  },
  'calendar.default': {
    id: 'calendar.default',
    snippets: demoSnippets['calendar.default'],
    react: reactDemoLoaders['calendar.default'],
  },
  'date-input.default': {
    id: 'date-input.default',
    snippets: demoSnippets['date-input.default'],
    react: reactDemoLoaders['date-input.default'],
  },
  'date-range-input.default': {
    id: 'date-range-input.default',
    snippets: demoSnippets['date-range-input.default'],
    react: reactDemoLoaders['date-range-input.default'],
  },
  'date-time-input.default': {
    id: 'date-time-input.default',
    snippets: demoSnippets['date-time-input.default'],
    react: reactDemoLoaders['date-time-input.default'],
  },
  'time-input.default': {
    id: 'time-input.default',
    snippets: demoSnippets['time-input.default'],
    react: reactDemoLoaders['time-input.default'],
  },
  'tokenizer.default': {
    id: 'tokenizer.default',
    snippets: demoSnippets['tokenizer.default'],
    react: reactDemoLoaders['tokenizer.default'],
  },
  'multi-selector.default': {
    id: 'multi-selector.default',
    snippets: demoSnippets['multi-selector.default'],
    react: reactDemoLoaders['multi-selector.default'],
  },
  'color-input.default': {
    id: 'color-input.default',
    snippets: demoSnippets['color-input.default'],
    react: reactDemoLoaders['color-input.default'],
  },
  'color-picker.default': {
    id: 'color-picker.default',
    snippets: demoSnippets['color-picker.default'],
    react: reactDemoLoaders['color-picker.default'],
  },
  'table.default': {
    id: 'table.default',
    snippets: demoSnippets['table.default'],
    react: reactDemoLoaders['table.default'],
  },
  'tree.default': {
    id: 'tree.default',
    snippets: demoSnippets['tree.default'],
    react: reactDemoLoaders['tree.default'],
  },
  'file-tree.default': {
    id: 'file-tree.default',
    snippets: demoSnippets['file-tree.default'],
    react: reactDemoLoaders['file-tree.default'],
  },
};

export function assertDemoComplete(entry: DemoEntry): void {
  for (const framework of ['react', 'astro', 'html'] as const) {
    if (!entry.snippets[framework]?.length) {
      throw new Error(`Demo "${entry.id}" missing ${framework} snippet`);
    }
  }
  if (typeof entry.react !== 'function') {
    throw new Error(`Demo "${entry.id}" missing react loader`);
  }
}
