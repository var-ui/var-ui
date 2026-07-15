import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../../icons';
import { ChatToolCalls } from './ChatToolCalls';

describe('ChatToolCalls', () => {
  it('renders nothing for an empty calls array', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <ChatToolCalls calls={[]} />
      </IconProvider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a single call inline without a group header', () => {
    render(
      <IconProvider icons={{}}>
        <ChatToolCalls calls={[{ name: 'read_file', status: 'complete', target: 'App.tsx' }]} />
      </IconProvider>,
    );
    expect(screen.getByText('read_file')).toBeTruthy();
    expect(screen.getByText('App.tsx')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('collapses 2+ calls into an expandable group', async () => {
    render(
      <IconProvider icons={{}}>
        <ChatToolCalls
          calls={[
            { name: 'read_file', status: 'complete', target: 'App.tsx' },
            { name: 'run_tests', status: 'running' },
          ]}
        />
      </IconProvider>,
    );
    const toggle = screen.getByRole('button');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('read_file')).toBeNull();
    await userEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('read_file')).toBeTruthy();
    expect(screen.getByText('run_tests')).toBeTruthy();
  });

  it('toggles inline result detail for a call that has one', async () => {
    render(
      <IconProvider icons={{}}>
        <ChatToolCalls
          calls={[{ name: 'run_tests', status: 'complete', resultDetail: <span>42 passed</span> }]}
        />
      </IconProvider>,
    );
    expect(screen.queryByText('42 passed')).toBeNull();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('42 passed')).toBeTruthy();
  });
});
