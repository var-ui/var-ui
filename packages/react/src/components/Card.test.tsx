import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { Card, ClickableCard } from './Card';

describe('Badge', () => {
  it('applies the tone attr', () => {
    render(<Badge tone="success">Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge.className).toContain('var-ui-badge');
    expect(badge.getAttribute('data-tone')).toBe('success');
  });
});

describe('Card', () => {
  it('renders title and body content', () => {
    render(<Card title="Usage">Details</Card>);
    expect(screen.getByText('Usage').className).toContain('var-ui-card__title');
    expect(screen.getByText('Details')).toBeTruthy();
  });
});

describe('ClickableCard', () => {
  it('renders a link with title, description, and hint', () => {
    render(<ClickableCard href="/docs" title="Docs" description="Read them" hint="5 min" />);
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link.className).toContain('var-ui-card__linkRoot');
    expect(screen.getByText('Read them')).toBeTruthy();
  });
});
