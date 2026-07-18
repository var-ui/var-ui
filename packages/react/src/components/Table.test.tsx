import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from './Table';

describe('Table', () => {
  it('renders compound table semantics', () => {
    render(
      <Table caption="Team">
        <Table.Header>
          <Table.Row>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell isRowHeader>Ada</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.getByText('Team')).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeTruthy();
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('renders data-mode cells from columns + data', () => {
    render(
      <Table
        columns={[
          { key: 'name', header: 'Name', isRowHeader: true },
          { key: 'role', header: 'Role', align: 'end' },
        ]}
        data={[{ name: 'Ada', role: 'Admin' }]}
        getRowId={(r) => r.name as string}
      />,
    );
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeTruthy();
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('renders emptyContent when data is empty', () => {
    render(<Table columns={[{ key: 'name', header: 'Name' }]} data={[]} emptyContent="No rows" />);
    expect(screen.getByText('No rows')).toBeTruthy();
  });

  it('ignores columns/data in compound mode', () => {
    render(
      <Table columns={[{ key: 'name', header: 'Name' }]} data={[{ name: 'Ignored' }]}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Compound</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByText('Compound')).toBeTruthy();
    expect(screen.queryByText('Ignored')).toBeNull();
  });

  it('renders sort chrome and calls onSortChange on column click', async () => {
    const onSortChange = vi.fn();
    render(
      <Table
        columns={[{ key: 'name', header: 'Name', allowsSorting: true }]}
        data={[{ name: 'Ada' }]}
        sortDescriptor={{ column: 'name', direction: 'ascending' }}
        onSortChange={onSortChange}
      />,
    );
    const header = screen.getByRole('columnheader', { name: 'Name' });
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith({ column: 'name', direction: 'descending' });
  });
});
