import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from './AspectRatio';
import { Divider } from './Divider';
import { Grid } from './Grid';
import { Section } from './Section';
import { HStack, Stack } from './Stack';

describe('Stack', () => {
  it('applies variant attrs for gap and direction', () => {
    const { container } = render(
      <Stack direction="row" gap="lg">
        <span>a</span>
      </Stack>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('var-ui-stack');
    expect(el.getAttribute('data-direction')).toBe('row');
    expect(el.getAttribute('data-gap')).toBe('lg');
  });

  it('HStack defaults to row with centered cross axis', () => {
    const { container } = render(<HStack>x</HStack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('data-direction')).toBe('row');
    expect(el.getAttribute('data-align')).toBe('center');
  });
});

describe('Grid', () => {
  it('maps numeric columns onto named variants', () => {
    const { container } = render(<Grid columns={3}>x</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('data-columns')).toBe('three');
  });
});

describe('Divider', () => {
  it('exposes aria-orientation when vertical', () => {
    render(<Divider orientation="vertical" />);
    const hr = document.querySelector('hr') as HTMLHRElement;
    expect(hr.getAttribute('aria-orientation')).toBe('vertical');
    expect(hr.getAttribute('data-orientation')).toBe('vertical');
  });
});

describe('Section', () => {
  it('renders a section element with an optional heading', () => {
    render(<Section title="Forms">body</Section>);
    expect(screen.getByRole('heading', { name: 'Forms' }).className).toContain(
      'var-ui-section__title',
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
