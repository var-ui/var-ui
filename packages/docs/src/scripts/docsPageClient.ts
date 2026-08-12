import { reattachTypestyles } from '../utils/reattachTypestyles';

/** Client entry for DocsPage — typestyles reattach after view transitions. */
function onPageLoad(): void {
  reattachTypestyles();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
