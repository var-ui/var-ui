import { initTocs } from '@var-ui/astro';

function onPageLoad(): void {
  initTocs();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
