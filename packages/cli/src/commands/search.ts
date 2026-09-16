import type { SearchHit } from '../search';

function jsonHit(hit: SearchHit) {
  if (hit.kind === 'component' && hit.component) {
    return {
      kind: 'component' as const,
      name: hit.component.name,
      slug: hit.component.slug,
      score: hit.score,
      docsPath: hit.component.docsPath,
    };
  }
  return {
    kind: 'guide' as const,
    title: hit.guide?.title,
    id: hit.guide?.id,
    score: hit.score,
    docsPath: hit.guide?.docsPath,
  };
}

function humanHit(hit: SearchHit): string {
  if (hit.kind === 'component' && hit.component) {
    return `component ${hit.component.name} (${hit.component.slug})`;
  }
  return `guide ${hit.guide?.title ?? ''} (${hit.guide?.id ?? ''})`;
}

export function formatSearchHits(hits: SearchHit[], json: boolean): string {
  if (json) {
    return `${JSON.stringify(hits.map(jsonHit), null, 2)}\n`;
  }
  if (hits.length === 0) {
    return '';
  }
  return `${hits.map(humanHit).join('\n')}\n`;
}
