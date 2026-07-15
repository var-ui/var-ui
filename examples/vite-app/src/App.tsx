import { useState } from 'react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { ChatDemo } from './ChatDemo';
import { kbd, skeleton, statusDot, SURFACE_ATTRIBUTE } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import {
  Alert,
  AlertDialog,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
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
  MultiSelector,
  Popover,
  ProgressBar,
  Section,
  Select,
  Spinner,
  Stack,
  Text,
  TextField,
  Thumbnail,
  TimeInput,
  Timestamp,
  ToastProvider,
  Tokenizer,
  Toolbar,
  Tooltip,
  Typeahead,
  useDesignSystemTheme,
  useToast,
} from '@var-ui/react';

const AVATAR_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%236c8"/%3E%3C/svg%3E';

function ThemeToggle() {
  const { theme, toggleTheme } = useDesignSystemTheme();
  return (
    <Button onPress={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</Button>
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
          <span className={statusDot({ tone: 'success', pulse: 'true' })} />
          <Text as="span" size="sm">
            Operational
          </Text>
        </HStack>
        <HStack gap="xs">
          <span className={statusDot({ tone: 'danger' })} />
          <Text as="span" size="sm" tone="secondary">
            Incident
          </Text>
        </HStack>
      </HStack>
      <ProgressBar label="Uploading assets" value={64} />
      <ProgressBar label="Reindexing" isIndeterminate />
      <Stack gap="xs" aria-hidden style={{ maxWidth: '320px' }}>
        <div className={skeleton({ shape: 'text' })} style={{ width: '60%' }} />
        <div className={skeleton({ shape: 'text' })} style={{ width: '90%' }} />
        <div className={skeleton({ shape: 'rect' })} style={{ height: '48px' }} />
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
        Body text with a <kbd className={kbd()}>⌘K</kbd> shortcut hint and a relative{' '}
        <Timestamp date={new Date(Date.now() - 5 * 60_000)} /> timestamp.
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
  return (
    <DesignSystemProvider defaultTheme="light">
      <IconProvider icons={defaultIcons}>
        <ToastProvider>
          <LayerProvider>
            <Stack gap="xl" style={{ padding: '2rem', maxWidth: '56rem', margin: '0 auto' }}>
              <Stack gap="sm">
                <Heading level={1} size="display">
                  var-ui
                </Heading>
                <Text tone="secondary">
                  Component showcase for the Phase 0–1 breadth work. Everything below is themed by
                  CSS custom properties — no compiler in sight.
                </Text>
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
