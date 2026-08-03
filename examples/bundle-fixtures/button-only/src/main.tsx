import { createRoot } from 'react-dom/client';
import { Button, DesignSystemProvider } from '@var-ui/react';

createRoot(document.getElementById('root')!).render(
  <DesignSystemProvider>
    <Button intent="primary">Save</Button>
  </DesignSystemProvider>,
);
