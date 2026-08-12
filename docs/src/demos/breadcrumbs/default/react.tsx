import { Breadcrumbs } from '@var-ui/react';

export default function Preview() {
  return (
    <Breadcrumbs
      items={[
        { id: 'home', label: 'Home', href: '/' },
        { id: 'docs', label: 'Docs', href: '/docs' },
        { id: 'current', label: 'Breadcrumbs' },
      ]}
    />
  );
}
