import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders every item when under maxItems', () => {
    render(
      <Breadcrumbs
        label="Test trail"
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'projects', label: 'Projects', href: '/projects' },
          { id: 'current', label: 'My Project' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Test trail' });
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('My Project')).toBeTruthy();
  });

  it('marks the last item as current and non-interactive', () => {
    render(
      <Breadcrumbs
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'current', label: 'My Project' },
        ]}
      />,
    );
    const current = screen.getByText('My Project');
    expect(current.closest('[aria-current="page"]')).toBeTruthy();
    expect(current.closest('a')).toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
  });

  it('collapses middle items and expands on ellipsis click', async () => {
    render(
      <Breadcrumbs
        maxItems={3}
        items={[
          { id: 'a', label: 'A', href: '/a' },
          { id: 'b', label: 'B', href: '/a/b' },
          { id: 'c', label: 'C', href: '/a/b/c' },
          { id: 'd', label: 'D' },
        ]}
      />,
    );
    expect(screen.queryByText('B')).toBeNull();
    expect(screen.queryByText('C')).toBeNull();
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('D')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Show all breadcrumbs' }));
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy();
  });

  it('never renders a duplicate item when before/after windows overlap', () => {
    render(
      <Breadcrumbs
        maxItems={3}
        itemsBeforeCollapse={3}
        itemsAfterCollapse={2}
        items={[
          { id: 'a', label: 'A', href: '/a' },
          { id: 'b', label: 'B', href: '/a/b' },
          { id: 'c', label: 'C', href: '/a/b/c' },
          { id: 'd', label: 'D' },
        ]}
      />,
    );
    // 4 unique items + 1 ellipsis marker = 5 rendered listitems, no duplicates.
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getAllByText('C')).toHaveLength(1);
  });

  it('calls onAction with the pressed item id', async () => {
    const onAction = vi.fn();
    render(
      <Breadcrumbs
        onAction={onAction}
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'current', label: 'My Project' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(onAction).toHaveBeenCalledWith('home');
  });
});
