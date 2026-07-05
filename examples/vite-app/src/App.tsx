import { card, SURFACE_ATTRIBUTE } from '@var-ui/core';
import { Alert, Button, DesignSystemProvider } from '@var-ui/react';

export function App() {
  const c = card();

  return (
    <DesignSystemProvider defaultTheme="light">
      <main style={{ display: 'grid', gap: '1.5rem', padding: '2rem', maxWidth: '40rem' }}>
        <h1 style={{ margin: 0 }}>var-ui</h1>
        <p style={{ margin: 0 }}>Example Vite app consuming @var-ui/react.</p>
        <Button intent="primary">Get started</Button>

        <section {...{ [SURFACE_ATTRIBUTE]: 'dark' }} className={c.root}>
          <h2 className={c.title}>Fixed dark surface</h2>
          <p className={c.body}>
            This card uses the theme&apos;s dark token face while the page stays in light mode.
          </p>
          <Alert variant="info" appearance="subtle" title="Always-dark toast">
            Mark subtrees with <code>{SURFACE_ATTRIBUTE}=&quot;dark&quot;</code> for fixed-tone
            chrome.
          </Alert>
        </section>
      </main>
    </DesignSystemProvider>
  );
}
