import { useState } from 'react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { ChatDemo } from './ChatDemo';
import { acmeTheme } from './acmeTheme';
import { defaultTheme, kbd, skeleton, statusDot, SURFACE_ATTRIBUTE } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import {
  Alert,
  AlertDialog,
  AppShell,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  Carousel,
  CheckboxGroup,
  ClickableCard,
  CommandPalette,
  DateInput,
  DateRangeInput,
  DateTimeInput,
  DesignSystemProvider,
  Dialog,
  Divider,
  EmptyState,
  HoverCard,
  Field,
  FileInput,
  Grid,
  Heading,
  HStack,
  Icon,
  IconProvider,
  InputGroup,
  InputGroupInput,
  InputGroupText,
  LayerProvider,
  DescriptionList,
  List,
  MobileNav,
  MultiSelector,
  Pagination,
  Popover,
  ProgressBar,
  recipeClassName,
  Section,
  Select,
  SideNav,
  Spinner,
  Stack,
  TabList,
  Text,
  TextField,
  Thumbnail,
  TimeInput,
  Timestamp,
  ToastProvider,
  Tokenizer,
  Toolbar,
  Tooltip,
  TopNav,
  Typeahead,
  useDesignSystemTheme,
  useToast,
} from '@var-ui/react';

const AVATAR_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%236c8"/%3E%3C/svg%3E';

type ShowcasePalette = 'default' | 'acme';

function ThemeToggle() {
  const { theme, toggleTheme } = useDesignSystemTheme();
  return (
    <Button onPress={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</Button>
  );
}

function PaletteSwitcher({
  selected,
  onSelect,
}: {
  selected: ShowcasePalette;
  onSelect: (id: ShowcasePalette) => void;
}) {
  return (
    <HStack gap="xs">
      <Button
        intent={selected === 'default' ? 'primary' : 'secondary'}
        onPress={() => onSelect('default')}
        aria-pressed={selected === 'default'}
      >
        Default
      </Button>
      <Button
        intent={selected === 'acme' ? 'primary' : 'secondary'}
        onPress={() => onSelect('acme')}
        aria-pressed={selected === 'acme'}
      >
        Acme (V7 demo)
      </Button>
    </HStack>
  );
}

function FeedbackSection() {
  const [showBanner, setShowBanner] = useState(true);
  return (
    <Section title="Feedback & status">
      {showBanner ? (
        <Banner
          tone="warning"
          title="Scheduled maintenance"
          onDismiss={() => setShowBanner(false)}
          actions={<Button onPress={() => setShowBanner(false)}>Acknowledge</Button>}
        >
          Sunday 02:00–04:00 UTC.
        </Banner>
      ) : (
        <Button onPress={() => setShowBanner(true)}>Show banner again</Button>
      )}
      <Banner tone="success" appearance="solid">
        Deploy finished in 42s.
      </Banner>
      <Alert variant="info" title="Registry icons">
        Alerts now pull their tone glyph from <code>IconProvider</code> automatically.
      </Alert>
      <HStack gap="lg" wrap>
        <Spinner label="Loading results" />
        <Spinner size="lg" tone="neutral" />
        <HStack gap="xs">
          <span className={recipeClassName(statusDot({ tone: 'success', pulse: 'true' }))} />
          <Text as="span" size="sm">
            Operational
          </Text>
        </HStack>
        <HStack gap="xs">
          <span className={recipeClassName(statusDot({ tone: 'danger' }))} />
          <Text as="span" size="sm" tone="secondary">
            Incident
          </Text>
        </HStack>
      </HStack>
      <ProgressBar label="Uploading assets" value={64} />
      <ProgressBar label="Reindexing" isIndeterminate />
      <Stack gap="xs" aria-hidden style={{ maxWidth: '320px' }}>
        <div className={recipeClassName(skeleton({ shape: 'text' }))} style={{ width: '60%' }} />
        <div className={recipeClassName(skeleton({ shape: 'text' }))} style={{ width: '90%' }} />
        <div className={recipeClassName(skeleton({ shape: 'rect' }))} style={{ height: '48px' }} />
      </Stack>
    </Section>
  );
}

function ContentSection() {
  return (
    <Section title="Content">
      <Heading level={3} size="display">
        Display heading
      </Heading>
      <Heading level={3} size="sm">
        Small heading
      </Heading>
      <Text>
        Body text with a <kbd className={recipeClassName(kbd())}>⌘K</kbd> shortcut hint and a
        relative <Timestamp date={new Date(Date.now() - 5 * 60_000)} /> timestamp.
      </Text>
      <Text tone="secondary" size="sm">
        Secondary small text — published <Timestamp date="2026-01-15T12:00:00Z" format="date" />.
      </Text>
      <Divider />
      <EmptyState
        icon={<Icon name="search" size="lg" />}
        title="No results"
        description="Try a different filter, or clear the search."
        action={<Button intent="primary">Clear filters</Button>}
      />
    </Section>
  );
}

function ContainerSection() {
  const [files, setFiles] = useState(['spec.pdf', 'mock.png']);
  return (
    <Section title="Containers & identity">
      <Grid columns="auto" gap="md">
        <Card title="Static card">Plain content surface.</Card>
        <ClickableCard
          href="#theming"
          title="Theming guide"
          description="Override any token with plain CSS custom properties."
          hint="5 min read"
        />
      </Grid>
      <HStack gap="lg" wrap>
        <Avatar name="Ada Lovelace" status="success" />
        <Avatar src={AVATAR_URL} alt="Generated avatar" size="lg" />
        <AvatarGroup max={3}>
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" />
          <Avatar name="Alan Turing" />
          <Avatar name="Edsger Dijkstra" />
        </AvatarGroup>
        <Badge tone="accent">Beta</Badge>
        <Badge tone="danger">Deprecated</Badge>
      </HStack>
      <HStack gap="md" wrap>
        {files.map((file) => (
          <Stack key={file} gap="xs" align="center">
            <Thumbnail
              src={AVATAR_URL}
              alt={file}
              onDismiss={() => setFiles((current) => current.filter((f) => f !== file))}
            />
            <Text as="span" size="sm" tone="secondary">
              {file}
            </Text>
          </Stack>
        ))}
      </HStack>
      <Carousel label="Featured themes" itemWidth="220px">
        {['Default', 'Forest', 'Rose', 'Amber', 'AI Glow', 'Windows 95'].map((theme) => (
          <Card key={theme} title={theme}>
            Scroll-snap slide.
          </Card>
        ))}
      </Carousel>
    </Section>
  );
}

const FRUIT_OPTIONS = [
  { id: 'apple', label: 'Apple' },
  { id: 'apricot', label: 'Apricot' },
  { id: 'plum', label: 'Plum' },
  { id: 'peach', label: 'Peach' },
  { id: 'pear', label: 'Pear' },
];

function FormsSection() {
  const [notifications, setNotifications] = useState(['email']);
  const [price, setPrice] = useState('49.00');
  const [resume, setResume] = useState<File | null>(null);
  const [reviewers, setReviewers] = useState<typeof FRUIT_OPTIONS>([FRUIT_OPTIONS[0]]);
  const [labels, setLabels] = useState<string[]>(['apricot']);

  return (
    <Section title="Forms">
      <Toolbar
        label="Table actions"
        startContent={
          <>
            <Button size="sm">New</Button>
            <Button size="sm" intent="ghost">
              Import
            </Button>
          </>
        }
        endContent={
          <Button size="sm" intent="ghost">
            Export
          </Button>
        }
      />
      <Grid columns={2} gap="lg">
        <TextField label="Project name" description="Shown on the dashboard." />
        <Select
          label="Fruit"
          options={[
            { id: 'apple', label: 'Apple' },
            { id: 'plum', label: 'Plum' },
          ]}
        />
      </Grid>
      <Field
        label="Custom control"
        description="Any input composes the shared field chrome."
        htmlFor="custom-range"
      >
        <input id="custom-range" type="range" />
      </Field>
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput
          aria-label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <InputGroupText>USD</InputGroupText>
      </InputGroup>
      <CheckboxGroup
        label="Notifications"
        value={notifications}
        onChange={setNotifications}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'push', label: 'Push' },
        ]}
      />
      <FileInput
        label="Resume"
        description="PDF or Word document, up to 5MB."
        value={resume}
        onChange={(files) => setResume(Array.isArray(files) ? (files[0] ?? null) : files)}
        accept=".pdf,.doc,.docx"
        maxSize={5 * 1024 * 1024}
      />
      <Grid columns={2} gap="lg">
        <Typeahead label="Assignee" options={FRUIT_OPTIONS} placeholder="Search people…" />
        <MultiSelector label="Labels" options={FRUIT_OPTIONS} value={labels} onChange={setLabels} />
      </Grid>
      <Tokenizer
        label="Reviewers"
        options={FRUIT_OPTIONS}
        value={reviewers}
        onChange={setReviewers}
        placeholder="Add a reviewer…"
      />
    </Section>
  );
}

function PaginationDemo() {
  const [pagesPage, setPagesPage] = useState(1);
  const [countPage, setCountPage] = useState(2);
  const [compactPage, setCompactPage] = useState(2);
  const [dotsPage, setDotsPage] = useState(1);
  const [sizedPage, setSizedPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Stack gap="md">
      <Pagination page={pagesPage} onChange={setPagesPage} totalPages={12} />
      <Pagination
        page={countPage}
        onChange={setCountPage}
        totalItems={45}
        pageSize={10}
        variant="count"
      />
      <Pagination page={compactPage} onChange={setCompactPage} totalPages={6} variant="compact" />
      <Pagination page={dotsPage} onChange={setDotsPage} totalPages={5} variant="dots" />
      <Pagination
        page={sizedPage}
        onChange={setSizedPage}
        totalItems={230}
        pageSize={pageSize}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={setPageSize}
      />
    </Stack>
  );
}

function SideNavDemo() {
  const [selected, setSelected] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '22rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
      <SideNav
        header={<SideNav.Heading heading="Acme" superheading="Workspace" icon="search" />}
        topContent={
          <Button size="sm" onPress={() => setSelected('dashboard')}>
            New project
          </Button>
        }
        footerIcons={
          <Button aria-label="More options" intent="ghost" size="sm">
            <Icon name="moreHorizontal" />
          </Button>
        }
        collapsible={{ isCollapsed, onCollapsedChange: setIsCollapsed }}
        resizable
      >
        <SideNav.Section title="Main">
          <SideNav.Item
            label="Dashboard"
            icon="search"
            isSelected={selected === 'dashboard'}
            onPress={() => setSelected('dashboard')}
          />
          <SideNav.Item
            label="Projects"
            icon="clock"
            collapsible
            isSelected={selected === 'projects'}
            onPress={() => setSelected('projects')}
          >
            <SideNav.Item
              label="Alpha"
              isSelected={selected === 'alpha'}
              onPress={() => setSelected('alpha')}
            />
            <SideNav.Item
              label="Beta"
              isSelected={selected === 'beta'}
              onPress={() => setSelected('beta')}
            />
          </SideNav.Item>
        </SideNav.Section>
        <SideNav.Section title="Settings" subtitle="Workspace preferences">
          <SideNav.Item
            label="Preferences"
            icon="wrench"
            isSelected={selected === 'preferences'}
            onPress={() => setSelected('preferences')}
          />
        </SideNav.Section>
      </SideNav>
      <div
        style={{
          flex: '1 1 auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <Text weight="semibold">Selected: {selected}</Text>
        <Text size="sm" tone="secondary">
          Drag the handle to resize, or use the footer button to collapse to icons only.
        </Text>
      </div>
    </div>
  );
}

function MobileNavDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('dashboard');

  return (
    <Stack gap="sm">
      <HStack gap="sm" align="center">
        <MobileNav.Toggle isOpen={isOpen} onPress={() => setIsOpen(true)} />
        <Text size="sm" tone="secondary">
          Narrow-viewport drawer — click the hamburger to open.
        </Text>
      </HStack>
      <MobileNav isOpen={isOpen} onOpenChange={setIsOpen} header="Acme" width={280}>
        <SideNav.Section title="Main">
          <SideNav.Item
            label="Dashboard"
            icon="search"
            isSelected={selected === 'dashboard'}
            onPress={() => setSelected('dashboard')}
          />
          <SideNav.Item
            label="Projects"
            icon="clock"
            isSelected={selected === 'projects'}
            onPress={() => setSelected('projects')}
          />
          <SideNav.Item
            label="Settings"
            icon="wrench"
            isSelected={selected === 'settings'}
            onPress={() => setSelected('settings')}
          />
        </SideNav.Section>
      </MobileNav>
    </Stack>
  );
}

function TopNavDemo() {
  const [selected, setSelected] = useState('home');

  return (
    <TopNav
      heading={<TopNav.Heading heading="Acme" icon="search" headingHref="/" />}
      centerContent={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '999px',
            border: '1px solid currentColor',
            opacity: 0.6,
          }}
        >
          <Icon name="search" size="sm" />
          <Text as="span" size="sm" tone="secondary">
            Search…
          </Text>
        </div>
      }
      endContent={<Avatar name="Jamie Rivera" src={AVATAR_URL} size="sm" />}
    >
      <TopNav.Item
        label="Home"
        isSelected={selected === 'home'}
        onPress={() => setSelected('home')}
      />
      <TopNav.Item
        label="Docs"
        isSelected={selected === 'docs'}
        onPress={() => setSelected('docs')}
      />
      <TopNav.Menu
        label="Products"
        items={[
          {
            id: 'analytics',
            title: 'Analytics',
            description: 'Track usage across your org',
            icon: 'clock',
          },
          {
            id: 'billing',
            title: 'Billing',
            description: 'Plans, invoices, and usage',
            icon: 'wrench',
            href: '/billing',
          },
        ]}
      />
      <TopNav.MegaMenu
        label="Solutions"
        items={[
          {
            id: 'startups',
            title: 'For startups',
            description: 'Ship faster with sane defaults',
            icon: 'arrowUp',
          },
          {
            id: 'enterprise',
            title: 'For enterprise',
            description: 'Governance and audit at scale',
            icon: 'stop',
          },
        ]}
        featured={
          <TopNav.MegaMenu.FeaturedCard
            title="What's new"
            description="See the latest release notes and roadmap."
            action={
              <Button size="sm" intent="ghost">
                Read more
              </Button>
            }
          />
        }
      />
    </TopNav>
  );
}

const ADMIN_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'search' },
  { id: 'projects', label: 'Projects', icon: 'clock' },
  { id: 'settings', label: 'Settings', icon: 'wrench' },
] as const;

function AdminShellDemo() {
  const [selected, setSelected] = useState<(typeof ADMIN_NAV_ITEMS)[number]['id']>('overview');

  function renderAdminNavSection() {
    return (
      <SideNav.Section title="Workspace">
        {ADMIN_NAV_ITEMS.map((item) => (
          <SideNav.Item
            key={item.id}
            label={item.label}
            icon={item.icon}
            isSelected={selected === item.id}
            onPress={() => setSelected(item.id)}
          />
        ))}
      </SideNav.Section>
    );
  }

  return (
    <div
      style={{
        height: '32rem',
        display: 'flex',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid rgba(128, 128, 128, 0.3)',
      }}
    >
      <AppShell
        height="auto"
        variant="surface"
        contentPadding={5}
        topNav={
          <TopNav
            heading={<TopNav.Heading heading="Acme Admin" icon="search" />}
            endContent={
              <HStack gap="sm" align="center">
                <MobileNav.Toggle />
                <Avatar name="Jamie Rivera" src={AVATAR_URL} size="sm" />
              </HStack>
            }
          />
        }
        sideNav={
          <SideNav header={<SideNav.Heading heading="Acme Admin" />} collapsible resizable>
            {renderAdminNavSection()}
          </SideNav>
        }
        mobileNav={<MobileNav header="Acme Admin">{renderAdminNavSection()}</MobileNav>}
      >
        <Stack gap="sm">
          <Heading level={2} size="md">
            {ADMIN_NAV_ITEMS.find((item) => item.id === selected)?.label}
          </Heading>
          <Text tone="secondary">
            Shrink this pane below 768px to see the side nav swap for the hamburger-triggered mobile
            drawer — both render the same `SideNav.Section` tree.
          </Text>
        </Stack>
      </AppShell>
    </div>
  );
}

function AdminShellSection() {
  return (
    <Section title="Admin shell (AppShell demo)">
      <Text tone="secondary" size="sm">
        Composes `TopNav` + collapsible/resizable `SideNav` + `MobileNav` + main content via
        `AppShell`. The hamburger toggle and drawer share open state through the provider `AppShell`
        wraps around its slots.
      </Text>
      <AdminShellDemo />
    </Section>
  );
}

function TabListDemo() {
  const [tab, setTab] = useState('overview');

  return (
    <Stack gap="sm">
      <TabList value={tab} onChange={setTab} hasDivider label="Sections">
        <TabList.Tab value="overview" label="Overview" />
        <TabList.Tab value="activity" label="Activity" endContent={<Badge>3</Badge>} />
        <TabList.Tab value="disabled" label="Archived" isDisabled />
        <TabList.Menu
          label="More"
          options={[
            { value: 'settings', label: 'Settings' },
            { value: 'audit', label: 'Audit log' },
          ]}
        />
      </TabList>
      <Text size="sm" tone="secondary">
        Selected: {tab}
      </Text>
    </Stack>
  );
}

function DataDisplaySection() {
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  return (
    <Section title="Data display">
      <Stack gap="md">
        <List density="compact" hasDividers header="Team members">
          <List.Item
            label="Ada Lovelace"
            description="Admin"
            startContent={<Avatar name="Ada Lovelace" size="sm" />}
            endContent={<Badge tone="accent">You</Badge>}
            href="#ada"
          />
          <List.Item
            label="Grace Hopper"
            description="Editor"
            startContent={<Avatar name="Grace Hopper" size="sm" />}
            href="#grace"
          />
        </List>
        <List
          listStyle="disc"
          items={[
            { id: 'docs', label: 'Documentation', href: '#docs' },
            { id: 'changelog', label: 'Changelog', href: '#changelog' },
          ]}
        />
        <List
          hasDividers
          items={[
            { id: 'general', label: 'General settings', description: 'Workspace defaults' },
            {
              id: 'billing',
              label: 'Billing',
              description: 'Plans and invoices',
              isDisabled: true,
            },
            { id: 'notifications', label: 'Notifications', description: 'Email and push' },
          ]}
          onAction={setSelectedSetting}
        />
        {selectedSetting ? (
          <Text size="sm" tone="secondary">
            Selected: {selectedSetting}
          </Text>
        ) : null}
        <DescriptionList
          columns="single"
          labelPosition="start"
          maxItems={4}
          title="Project details"
        >
          <DescriptionList.Item label="Owner">Ada Lovelace</DescriptionList.Item>
          <DescriptionList.Item label="Region">us-west-2</DescriptionList.Item>
          <DescriptionList.Item label="Environment">Production</DescriptionList.Item>
          <DescriptionList.Item label="Created">2024-03-15</DescriptionList.Item>
          <DescriptionList.Item label="Last deploy">2 hours ago</DescriptionList.Item>
        </DescriptionList>
        <DescriptionList
          columns={3}
          items={[
            { id: 'status', label: 'Status', value: 'Active' },
            { id: 'tier', label: 'Tier', value: 'Enterprise' },
            { id: 'users', label: 'Users', value: '128' },
            { id: 'storage', label: 'Storage', value: '42 GB' },
          ]}
        />
      </Stack>
    </Section>
  );
}

function NavigationSection() {
  return (
    <Section title="Navigation">
      <Stack gap="md">
        <TopNavDemo />
        <SideNavDemo />
        <MobileNavDemo />
        <TabListDemo />
        <Breadcrumbs
          label="Short trail"
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'settings', label: 'Settings', href: '/settings' },
            { id: 'profile', label: 'Profile' },
          ]}
        />
        <Breadcrumbs
          label="Deep trail"
          maxItems={4}
          items={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'org', label: 'Acme Corp', href: '/org' },
            { id: 'team', label: 'Platform Team', href: '/org/team' },
            { id: 'project', label: 'var-ui', href: '/org/team/project' },
            { id: 'issue', label: 'Issue #482', href: '/org/team/project/issues/482' },
            { id: 'comment', label: 'Comment' },
          ]}
        />
        <PaginationDemo />
      </Stack>
    </Section>
  );
}

function DatesSection() {
  const [date, setDate] = useState(today(getLocalTimeZone()));

  return (
    <Section title="Dates & time">
      <Calendar aria-label="Appointment date" value={date} onChange={setDate} />
      <Grid columns={2} gap="lg">
        <DateInput label="Start date" />
        <DateRangeInput label="Trip dates" />
      </Grid>
      <Grid columns={2} gap="lg">
        <DateTimeInput label="Meeting starts" />
        <TimeInput label="Reminder time" />
      </Grid>
    </Section>
  );
}

function ChatSection() {
  return (
    <Section title="Chat">
      <ChatDemo />
    </Section>
  );
}

function ToastDemo() {
  const toast = useToast();
  return (
    <HStack gap="sm">
      <Button onPress={() => toast.add({ tone: 'success', title: 'Saved' })}>Success toast</Button>
      <Button
        onPress={() =>
          toast.add({
            tone: 'danger',
            title: 'Failed',
            description: 'Could not save.',
            durationMs: 0,
          })
        }
      >
        Persistent danger
      </Button>
    </HStack>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open command palette</Button>
      {last ? <Text tone="secondary">Last action: {last}</Text> : null}
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        items={[
          { id: 'theme', title: 'Toggle theme', meta: 'Appearance' },
          { id: 'docs', title: 'Open docs', keywords: ['help'] },
        ]}
        onAction={(id) => {
          setLast(id);
          setOpen(false);
        }}
      />
    </>
  );
}

function OverlaysSection() {
  return (
    <Section title="Overlays">
      <Stack gap="md">
        <ToastDemo />
        <HStack gap="md">
          <Tooltip content="Keyboard shortcut hint">
            <Button>Tooltip</Button>
          </Tooltip>
          <Popover trigger={<Button>Popover</Button>} title="Details">
            <Text>Interactive content inside a popover.</Text>
          </Popover>
          <HoverCard trigger={<Button>Hover card</Button>}>
            <Text>Richer preview with a link.</Text>
          </HoverCard>
        </HStack>
        <CommandPaletteDemo />
        <HStack gap="md">
          <AlertDialog
            triggerLabel="Archive item"
            title="Archive this item?"
            description="You can restore it from the archive at any time."
            confirmLabel="Archive"
            onConfirm={() => console.log('archived')}
          />
          <AlertDialog
            triggerLabel="Delete item"
            title="Delete this item?"
            description="This action is permanent and cannot be undone."
            confirmLabel="Delete"
            isDestructive
            onConfirm={() => console.log('deleted')}
          />
        </HStack>
      </Stack>
    </Section>
  );
}

export function App() {
  const [palette, setPalette] = useState<ShowcasePalette>('default');
  const activeTheme = palette === 'acme' ? acmeTheme : defaultTheme;

  return (
    <DesignSystemProvider defaultTheme="light" customTheme={activeTheme}>
      <IconProvider icons={defaultIcons}>
        <ToastProvider>
          <LayerProvider>
            <Stack gap="xl" style={{ padding: '2rem', maxWidth: '56rem', margin: '0 auto' }}>
              <Stack gap="sm">
                <Heading level={1} size="display">
                  var-ui
                </Heading>
                <Text tone="secondary">
                  Component showcase. Switch to <strong>Acme</strong> to preview V7 typed theming —
                  custom brand tokens, pill buttons with glow, and uppercase primary labels — via
                  <code> createDesignTheme({'{ extend, components }'})</code>.
                </Text>
                <Stack gap="xs">
                  <Text as="span" size="sm" tone="secondary">
                    Theme palette
                  </Text>
                  <PaletteSwitcher selected={palette} onSelect={setPalette} />
                </Stack>
                <HStack gap="sm">
                  <ThemeToggle />
                  <Dialog
                    triggerLabel="Open dialog"
                    title="Icon close button"
                    description="The dismiss control now uses the registry close glyph."
                  />
                </HStack>
              </Stack>

              <FeedbackSection />
              <ContentSection />
              <ContainerSection />
              <FormsSection />
              <NavigationSection />
              <DataDisplaySection />
              <AdminShellSection />
              <DatesSection />
              <OverlaysSection />
              <ChatSection />

              <Section {...{ [SURFACE_ATTRIBUTE]: 'dark' }} title="Fixed dark surface">
                <Text>
                  This section keeps the theme&apos;s dark token face while the page stays light.
                </Text>
                <Alert variant="info" appearance="subtle" title="Always-dark chrome">
                  Mark subtrees with <code>{SURFACE_ATTRIBUTE}=&quot;dark&quot;</code>.
                </Alert>
              </Section>
            </Stack>
          </LayerProvider>
        </ToastProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
