const INIT_ATTR = 'data-var-ui-code-copy-initialized';
const RESET_MS = 1200;

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function resetCopyButton(btn: HTMLButtonElement): void {
  btn.removeAttribute('data-copied');
  btn.removeAttribute('data-error');
  const copyLabel = btn.getAttribute('data-copy-label') ?? 'Copy code';
  btn.setAttribute('aria-label', copyLabel);
  const feedback = btn.parentElement?.querySelector('[data-codeblock-feedback]');
  if (feedback) feedback.textContent = '';
}

export function initCodeBlockCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-var-ui-code-copy]').forEach((btn) => {
    if (btn.hasAttribute(INIT_ATTR)) return;
    btn.setAttribute(INIT_ATTR, '');

    btn.addEventListener('click', async () => {
      const code = btn.getAttribute('data-code') ?? '';
      const copiedLabel = btn.getAttribute('data-copied-label') ?? 'Copied';
      const copyErrorLabel = btn.getAttribute('data-copy-error-label') ?? 'Copy failed';
      const feedback = btn.parentElement?.querySelector('[data-codeblock-feedback]');

      const ok = await copyText(code);
      if (ok) {
        btn.setAttribute('data-copied', '');
        btn.removeAttribute('data-error');
        btn.setAttribute('aria-label', copiedLabel);
        if (feedback) feedback.textContent = copiedLabel;
      } else {
        btn.removeAttribute('data-copied');
        btn.setAttribute('data-error', '');
        btn.setAttribute('aria-label', copyErrorLabel);
        if (feedback) feedback.textContent = copyErrorLabel;
      }

      window.setTimeout(() => resetCopyButton(btn), RESET_MS);
    });

    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', btn.getAttribute('data-copy-label') ?? 'Copy code');
    }
  });
}
