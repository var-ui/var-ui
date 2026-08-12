import { Breadcrumbs } from '@var-ui/react';

export default function Preview() {
  return (
    <Breadcrumbs
      maxItems={3}
      items={[
        { id: 'home', label: 'Home', href: '/' },
        { id: 'products', label: 'Products', href: '/products' },
        { id: 'hardware', label: 'Hardware', href: '/products/hardware' },
        { id: 'laptops', label: 'Laptops', href: '/products/hardware/laptops' },
        { id: 'current', label: 'Pro 16' },
      ]}
    />
  );
}
