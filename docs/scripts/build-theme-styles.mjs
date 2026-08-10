import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTypestylesBuild } from '@typestyles/build-runner';

const docsRoot = fileURLToPath(new URL('..', import.meta.url));
const outDir = path.join(docsRoot, 'public', 'themes');

const THEME_IDS = [
  'forest',
  'rose',
  'amber',
  'ai-glow',
  'new-wave',
  'windows-95',
  'classic-system',
];

function themeClassForId(themeId) {
  return `.theme-var-ui-${themeId}`;
}

/** Drop duplicated core/component CSS; keep @font-face + theme class rules only. */
function extractThemeOnlyCss(css, themeId) {
  const themeClass = themeClassForId(themeId);
  const fontFaceIdx = css.indexOf('@font-face');
  const themeIdx = css.indexOf(themeClass);
  const candidates = [fontFaceIdx, themeIdx].filter((index) => index >= 0);
  if (candidates.length === 0) {
    throw new Error(`[build-theme-styles] No theme CSS found for "${themeId}"`);
  }
  const start = Math.min(...candidates);
  return css.slice(start).trim();
}

fs.mkdirSync(outDir, { recursive: true });

for (const id of THEME_IDS) {
  const css = extractThemeOnlyCss(
    await runTypestylesBuild({
      root: docsRoot,
      modules: [`typestyles-themes/${id}.ts`],
    }),
    id,
  );
  const outPath = path.join(outDir, `${id}.css`);
  fs.writeFileSync(outPath, css);
  const kb = (Buffer.byteLength(css, 'utf8') / 1024).toFixed(1);
  process.stdout.write(`Wrote ${outPath} (${kb} KB)\n`);
}
