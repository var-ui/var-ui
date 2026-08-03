import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('yaml', yaml);

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  html: 'xml',
  htm: 'xml',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
};

const AUTO_LANGUAGES = ['typescript', 'javascript', 'xml', 'css', 'yaml', 'json', 'bash'] as const;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resolveLanguage(language: string): string {
  const normalized = language.trim().toLowerCase();
  return LANGUAGE_ALIASES[normalized] ?? normalized;
}

function highlightAstro(code: string): string {
  const match = code.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return hljs.highlight(code, { language: 'xml', ignoreIllegals: true }).value;
  }

  const [, frontmatter, template] = match;
  const highlightedFrontmatter = hljs.highlight(frontmatter.trim(), {
    language: 'yaml',
    ignoreIllegals: true,
  }).value;
  const highlightedTemplate = hljs.highlight(template.trim(), {
    language: 'xml',
    ignoreIllegals: true,
  }).value;

  return `---\n${highlightedFrontmatter}\n---\n${highlightedTemplate}`;
}

/**
 * Highlight source code with highlight.js, returning HTML safe for `innerHTML` / `set:html`.
 * Falls back to escaped plain text when highlighting is unavailable.
 */
export function highlightCode(code: string, language?: string): string {
  if (!language) return escapeHtml(code);

  const resolved = resolveLanguage(language);

  try {
    if (resolved === 'astro') {
      return highlightAstro(code);
    }

    if (hljs.getLanguage(resolved)) {
      return hljs.highlight(code, { language: resolved, ignoreIllegals: true }).value;
    }

    return hljs.highlightAuto(code, [...AUTO_LANGUAGES]).value;
  } catch {
    return escapeHtml(code);
  }
}

export function highlightCodeClassName(language?: string): string {
  if (!language) return '';
  const resolved = resolveLanguage(language);
  if (resolved === 'astro') return 'hljs language-astro';
  if (hljs.getLanguage(resolved)) return `hljs language-${resolved}`;
  return 'hljs';
}
