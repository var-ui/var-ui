import { ensureDocumentStylesAttached } from 'typestyles';

/** Re-inject runtime theme CSS after Astro view transitions swap the document head. */
export function reattachTypestyles(): void {
  ensureDocumentStylesAttached();
}

function onPageLoad(): void {
  reattachTypestyles();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
