import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { LayerProvider, useLayer } from './LayerProvider';

function Probe({ testId }: { testId: string }) {
  const { zIndex } = useLayer();
  return <div data-testid={testId} data-z={zIndex} />;
}

describe('LayerProvider', () => {
  it('falls back to base z-index without a provider', () => {
    const { getByTestId } = render(<Probe testId="a" />);
    expect(Number(getByTestId('a').dataset.z)).toBeGreaterThanOrEqual(100);
  });

  it('stacks sibling layers in mount order', () => {
    const { getByTestId } = render(
      <LayerProvider baseZIndex={200}>
        <Probe testId="first" />
        <Probe testId="second" />
      </LayerProvider>,
    );
    const first = Number(getByTestId('first').dataset.z);
    const second = Number(getByTestId('second').dataset.z);
    expect(first).toBeGreaterThanOrEqual(200);
    expect(second).toBeGreaterThan(first);
  });
});
