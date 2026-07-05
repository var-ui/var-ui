import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from './AspectRatio';
import { Divider } from './Divider';
import { Grid } from './Grid';
import { Section } from './Section';
import { HStack, Stack } from './Stack';

describe('Stack', () => {
  it('applies variant classes for gap and direction', () => {
    const { container } = render(
      <Stack direction="row" gap="lg">
        <span>a</span>
      </Stack>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('example-ds-stack-direction-row');
    expect(el.className).toContain('example-ds-stack-gap-lg');
  });

  it('HStack defaults to row with centered cross axis', () => {
    const { container } = render(<HStack>x</HStack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('example-ds-stack-direction-row');
    expect(el.className).toContain('example-ds-stack-align-center');
  });
});

describe('Grid', () => {
  it('maps numeric columns onto named variants', () => {
    const { container } = render(<Grid columns={3}>x</Grid>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'example-ds-grid-columns-three',
    );
  });
});

describe('Divider', () => {
  it('exposes aria-orientation when vertical', () => {
    render(<Divider orientation="vertical" />);
    const hr = document.querySelector('hr') as HTMLHRElement;
    expect(hr.getAttribute('aria-orientation')).toBe('vertical');
    expect(hr.className).toContain('example-ds-divider-orientation-vertical');
  });
});

describe('Section', () => {
  it('renders a section element with an optional heading', () => {
    render(<Section title="Forms">body</Section>);
    expect(screen.getByRole('heading', { name: 'Forms' }).className).toContain(
      'example-ds-section-title',
    );
  });
});

describe('AspectRatio', () => {
  it('applies an inline aspect-ratio override', () => {
    const { container } = render(<AspectRatio ratio={1}>x</AspectRatio>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.aspectRatio).toBe('1');
  });
});
