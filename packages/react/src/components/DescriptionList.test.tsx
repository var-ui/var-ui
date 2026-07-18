import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DescriptionList } from './DescriptionList';

describe('DescriptionList', () => {
  it('renders semantic dl, dt, and dd elements in compound mode', () => {
    const { container } = render(
      <DescriptionList title="Details">
        <DescriptionList.Item label="Owner">Ada</DescriptionList.Item>
        <DescriptionList.Item label="Region">us-west</DescriptionList.Item>
      </DescriptionList>,
    );

    expect(container.querySelector('dl')).toBeTruthy();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Owner')).toBeTruthy();
    expect(screen.getByText('Ada')).toBeTruthy();
    expect(screen.getByText('Region')).toBeTruthy();
    expect(screen.getByText('us-west')).toBeTruthy();
  });

  it('renders semantic dl, dt, and dd elements in items mode', () => {
    const { container } = render(
      <DescriptionList
        items={[
          { id: 'owner', label: 'Owner', value: 'Ada' },
          { id: 'region', label: 'Region', value: 'us-west' },
        ]}
      />,
    );

    expect(container.querySelector('dl')).toBeTruthy();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
    expect(screen.getByText('Owner')).toBeTruthy();
    expect(screen.getByText('Ada')).toBeTruthy();
  });

  it('hides extra items behind maxItems then reveals them on toggle', async () => {
    render(
      <DescriptionList maxItems={2}>
        <DescriptionList.Item label="One">1</DescriptionList.Item>
        <DescriptionList.Item label="Two">2</DescriptionList.Item>
        <DescriptionList.Item label="Three">3</DescriptionList.Item>
      </DescriptionList>,
    );

    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Two')).toBeTruthy();
    expect(screen.queryByText('Three')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(screen.getByText('Three')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Show less' }));
    expect(screen.queryByText('Three')).toBeNull();
  });
});
