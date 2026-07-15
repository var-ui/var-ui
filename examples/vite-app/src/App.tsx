import { useState } from 'react';
import { ChatDemo } from './ChatDemo';
import { kbd, skeleton, statusDot, SURFACE_ATTRIBUTE } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Button,
  Card,
  Carousel,
  ClickableCard,
  DesignSystemProvider,
  Dialog,
  Divider,
  EmptyState,
  Field,
  Grid,
  Heading,
  HStack,
  Icon,
  IconProvider,
  LayerProvider,
  ProgressBar,
  Section,
  Select,
  Spinner,
  Stack,
  Text,
  TextField,
  Thumbnail,
  Timestamp,
  ToastProvider,
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

function FormsSection() {
  return (
    <Section title="Forms">
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

function OverlaysSection() {
  return (
    <Section title="Overlays">
      <ToastDemo />
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
