import { reattachTypestyles } from '@var-ui/docs/utils';

export { reattachTypestyles };

function onPageLoad(): void {
  reattachTypestyles();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
