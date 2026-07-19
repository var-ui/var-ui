import { alert } from './components/alert';
import { appShell } from './components/appShell';
import { aspectRatio } from './components/aspectRatio';
import { avatar, avatarGroup } from './components/avatar';
import { badge } from './components/badge';
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
import { codeBlock } from './components/codeBlock';
import { commandPalette } from './components/commandPalette';
import { dateInput } from './components/dateInput';
import { dateRangeInput } from './components/dateRangeInput';
import { dateTimeInput } from './components/dateTimeInput';
import { descriptionList } from './components/descriptionList';
import { dialog } from './components/dialog';
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
import { menu } from './components/menu';
import { mobileNav } from './components/mobileNav';
import { multiSelector } from './components/multiSelector';
import { numberInput } from './components/numberInput';
import { outline } from './components/outline';
import { overflowList } from './components/overflowList';
import { overlay } from './components/overlay';
import { pagination } from './components/pagination';
import { popover } from './components/popover';
import { progressBar } from './components/progressBar';
import { proseContent } from './components/proseContent';
import { radio } from './components/radio';
import { resizeHandle } from './components/resizeHandle';
import { section } from './components/section';
import { segmentedControl } from './components/segmentedControl';
import { select } from './components/select';
import { sideNav } from './components/sideNav';
import { tabList } from './components/tabList';
import { topNav } from './components/topNav';
import { skeleton } from './components/skeleton';
import { slider } from './components/slider';
import { spinner } from './components/spinner';
import { stack } from './components/stack';
import { statusDot } from './components/statusDot';
import { steps } from './components/steps';
import { switchStyles } from './components/switch';
import { table } from './components/table';
import { tabs } from './components/tabs';
import { textAreaField } from './components/textAreaField';
import { textField } from './components/textField';
import { thumbnail } from './components/thumbnail';
import { timeInput } from './components/timeInput';
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
  commandPalette,
  dateInput,
  dateRangeInput,
  dateTimeInput,
  descriptionList,
  dialog,
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
  menu,
  mobileNav,
  multiSelector,
  numberInput,
  outline,
  overflowList,
  overlay,
  pagination,
  popover,
  progressBar,
  proseContent,
  radio,
  resizeHandle,
  section,
  segmentedControl,
  select,
  sideNav,
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
  toast,
  toggleButton,
  tokenizer,
  toolbar,
  tree,
  tooltip,
  typeahead,
} as const;

export type ThemeableComponentName = keyof typeof themeableComponents;
