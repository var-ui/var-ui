import type { ComponentVarValues, OverrideConfigFor } from 'typestyles';
import { alert } from './components/alert';
import { appShell } from './components/appShell';
import { aspectRatio } from './components/aspectRatio';
import { avatar, avatarGroup } from './components/avatar';
import { badge } from './components/badge';
import { chip } from './components/chip';
import { chipGroup } from './components/chipGroup';
import { banner } from './components/banner';
import { breadcrumbs } from './components/breadcrumbs';
import { button, linkButton } from './components/button';
import { buttonGroup } from './components/buttonGroup';
import { calendar } from './components/calendar';
import { card } from './components/card';
import { carousel } from './components/carousel';
import { center } from './components/center';
import { chatComposer } from './components/chat/chatComposer';
import { chatLayout } from './components/chat/chatLayout';
import { chatMessage } from './components/chat/chatMessage';
import { chatMessageBubble } from './components/chat/chatMessageBubble';
import { chatMessageList } from './components/chat/chatMessageList';
import { chatSystemMessage } from './components/chat/chatSystemMessage';
import { chatToolCalls } from './components/chat/chatToolCalls';
import { checkbox } from './components/checkbox';
import { codeBlock, codeBlockVarDefinitions } from './components/codeBlock';
import { accordionGroup } from './components/accordionGroup';
import { collapsible } from './components/collapsible';
import { colorField } from './components/colorField';
import { colorPicker, colorSwatch } from './components/colorPicker';
import { combobox } from './components/combobox';
import { commandPalette } from './components/commandPalette';
import { copyButton } from './components/copyButton';
import { dateInput } from './components/dateInput';
import { dateRangeInput } from './components/dateRangeInput';
import { dateTimeInput } from './components/dateTimeInput';
import { descriptionList } from './components/descriptionList';
import { dialog } from './components/dialog';
import { drawer } from './components/drawer';
import { divider } from './components/divider';
import { emptyState } from './components/emptyState';
import { field } from './components/field';
import { fileInput } from './components/fileInput';
import { fileTree } from './components/fileTree';
import { grid } from './components/grid';
import { hoverCard } from './components/hoverCard';
import { icon } from './components/icon';
import { inputGroup } from './components/inputGroup';
import { kbd } from './components/kbd';
import { link } from './components/link';
import { list } from './components/list';
import { loadingOverlay } from './components/loadingOverlay';
import {
  layout,
  layoutContent,
  layoutFooter,
  layoutHeader,
  layoutPanel,
  layoutPanelVarDefinitions,
} from './components/layout';
import { menu, menuVarDefinitions } from './components/menu';
import { mobileNav } from './components/mobileNav';
import { multiSelector } from './components/multiSelector';
import { numberInput } from './components/numberInput';
import { outline } from './components/outline';
import { overflowList } from './components/overflowList';
import { overlay } from './components/overlay';
import { pagination } from './components/pagination';
import { passwordField } from './components/passwordField';
import { pinInput } from './components/pinInput';
import { popover } from './components/popover';
import { progressBar } from './components/progressBar';
import { proseContent } from './components/proseContent';
import { radio } from './components/radio';
import { resizeHandle } from './components/resizeHandle';
import { scrollArea } from './components/scrollArea';
import { section } from './components/section';
import { searchInput } from './components/searchInput';
import { segmentedControl, segmentedControlVarDefinitions } from './components/segmentedControl';
import { select } from './components/select';
import { sideNav, sideNavVarDefinitions } from './components/sideNav';
import { simpleGrid } from './components/simpleGrid';
import { tabList } from './components/tabList';
import { topNav, topNavVarDefinitions } from './components/topNav';
import { skeleton } from './components/skeleton';
import { slider } from './components/slider';
import { spinner } from './components/spinner';
import { stack } from './components/stack';
import { statusDot } from './components/statusDot';
import { steps } from './components/steps';
import { switchStyles } from './components/switch';
import { table } from './components/table';
import { tabs, tabsVarDefinitions } from './components/tabs';
import { textAreaField } from './components/textAreaField';
import { textField } from './components/textField';
import { thumbnail } from './components/thumbnail';
import { timeInput } from './components/timeInput';
import { toc, tocVarDefinitions } from './components/toc';
import { timeline } from './components/timeline';
import { toast } from './components/toast';
import { toggleButton } from './components/toggleButton';
import { tokenizer } from './components/tokenizer';
import { toolbar } from './components/toolbar';
import { tree } from './components/tree';
import { tooltip } from './components/tooltip';
import { typeahead } from './components/typeahead';
import { heading, textBlock } from './components/typography';

/**
 * Public recipes available to `createDesignTheme({ components })`.
 * Add one entry when publishing a new themeable recipe (registry completeness test enforces this).
 */
export const themeableComponents = {
  alert,
  appShell,
  aspectRatio,
  avatar,
  avatarGroup,
  badge,
  chip,
  chipGroup,
  banner,
  breadcrumbs,
  button,
  buttonGroup,
  calendar,
  card,
  carousel,
  center,
  chatComposer,
  chatLayout,
  chatMessage,
  chatMessageBubble,
  chatMessageList,
  chatSystemMessage,
  chatToolCalls,
  checkbox,
  codeBlock,
  accordionGroup,
  collapsible,
  colorField,
  colorPicker,
  colorSwatch,
  combobox,
  commandPalette,
  copyButton,
  dateInput,
  dateRangeInput,
  dateTimeInput,
  descriptionList,
  dialog,
  drawer,
  divider,
  emptyState,
  field,
  fileInput,
  fileTree,
  grid,
  heading,
  hoverCard,
  icon,
  inputGroup,
  kbd,
  link,
  linkButton,
  list,
  loadingOverlay,
  layout,
  layoutContent,
  layoutFooter,
  layoutHeader,
  layoutPanel,
  menu,
  mobileNav,
  multiSelector,
  numberInput,
  outline,
  overflowList,
  overlay,
  pagination,
  passwordField,
  pinInput,
  popover,
  progressBar,
  proseContent,
  radio,
  resizeHandle,
  scrollArea,
  searchInput,
  section,
  segmentedControl,
  select,
  sideNav,
  simpleGrid,
  tabList,
  topNav,
  skeleton,
  slider,
  spinner,
  stack,
  statusDot,
  steps,
  switchStyles,
  table,
  tabs,
  textAreaField,
  textBlock,
  textField,
  thumbnail,
  timeInput,
  timeline,
  toc,
  toast,
  toggleButton,
  tokenizer,
  toolbar,
  tree,
  tooltip,
  typeahead,
} as const;

export type ThemeableComponentName = keyof typeof themeableComponents;

/** Recipes with exported `*VarDefinitions` for typed `vars` in theme overrides. */
type ThemeComponentVarDefinitions = {
  codeBlock: typeof codeBlockVarDefinitions;
  menu: typeof menuVarDefinitions;
  layoutPanel: typeof layoutPanelVarDefinitions;
  segmentedControl: typeof segmentedControlVarDefinitions;
  sideNav: typeof sideNavVarDefinitions;
  tabs: typeof tabsVarDefinitions;
  toc: typeof tocVarDefinitions;
  topNav: typeof topNavVarDefinitions;
};

export type { OverrideConfigFor };

/** Override config for one registry entry in {@link themeableComponents}. */
export type ThemeComponentOverrideFor<K extends ThemeableComponentName> =
  K extends keyof ThemeComponentVarDefinitions
    ? Omit<OverrideConfigFor<(typeof themeableComponents)[K]>, 'vars'> & {
        vars?: Partial<ComponentVarValues<ThemeComponentVarDefinitions[K]>>;
      }
    : OverrideConfigFor<(typeof themeableComponents)[K]>;

/** Union of all themeable recipe override shapes (escape hatch / docs). */
export type ThemeComponentOverride = {
  [K in ThemeableComponentName]: ThemeComponentOverrideFor<K>;
}[ThemeableComponentName];
