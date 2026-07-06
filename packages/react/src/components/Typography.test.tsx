import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Heading, Text } from './Typography';

describe('Typography', () => {
  it('Heading renders the requested level with a size class', () => {
    render(
      <Heading level={3} size="lg">
        Title
      </Heading>,
    );
    const h = screen.getByRole('heading', { level: 3, name: 'Title' });
    expect(h.className).toContain('example-ds-heading-size-lg');
  });

  it('Text renders the requested element with tone class', () => {
    render(
      <Text as="span" tone="secondary">
        hint
      </Text>,
    );
    const el = screen.getByText('hint');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toContain('example-ds-text-block-tone-secondary');
  });
});
