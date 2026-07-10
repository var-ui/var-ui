import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { Card, ClickableCard } from './Card';

describe('Badge', () => {
  it('applies the tone class', () => {
    render(<Badge tone="success">Active</Badge>);
    expect(screen.getByText('Active').className).toContain('var-ui-badge-tone-success');
  });
});

describe('Card', () => {
  it('renders title and body content', () => {
    render(<Card title="Usage">Details</Card>);
    expect(screen.getByText('Usage').className).toContain('var-ui-card-title');
    expect(screen.getByText('Details')).toBeTruthy();
  });
});

describe('ClickableCard', () => {
  it('renders a link with title, description, and hint', () => {
    render(<ClickableCard href="/docs" title="Docs" description="Read them" hint="5 min" />);
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link.className).toContain('var-ui-card-linkRoot');
    expect(screen.getByText('Read them')).toBeTruthy();
  });
});
