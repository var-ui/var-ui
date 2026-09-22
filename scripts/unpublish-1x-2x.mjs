#!/usr/bin/env node
/**
 * One-shot reset: wait for 0.1.0, then remove accidental 1.x/2.x publishes.
 *
 * Unpublish dependents before dependencies so npm's "no public dependents"
 * rule does not block us. Does not touch @var-ui/form@0.0.1.
 *
 * Usage:
 *   node scripts/unpublish-1x-2x.mjs
 *   node scripts/unpublish-1x-2x.mjs --dry-run
 */
import { spawnSync } from 'node:child_process';

const dryRun = process.argv.includes('--dry-run');
const KEEP = '0.1.0';
const WAIT_MS = 12 * 60 * 1000;
const POLL_MS = 15_000;

/** Dependents first so peer-dependent packages do not block unpublish. */
const PACKAGES = [
  '@var-ui/docs-components',
  '@var-ui/docs',
  '@var-ui/astro',
  '@var-ui/react',
  '@var-ui/icons',
  '@var-ui/core',
];

/** Highest versions first per package. */
const UNPUBLISH = {
  '@var-ui/docs-components': ['2.0.0', '1.0.0'],
  '@var-ui/docs': ['2.0.0', '1.0.1', '1.0.0'],
  '@var-ui/astro': ['2.0.0', '1.0.0'],
  '@var-ui/react': ['2.0.0', '1.0.0'],
  '@var-ui/icons': ['2.0.0', '1.0.0'],
  '@var-ui/core': ['2.0.0', '1.0.0'],
};

function log(message) {
  console.log(message);
}

function npm(args, { allowFail = false } = {}) {
  const result = spawnSync('npm', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const stdout = result.stdout?.trim() ?? '';
  const stderr = result.stderr?.trim() ?? '';
  if (result.status !== 0 && !allowFail) {
    throw new Error(`npm ${args.join(' ')} failed:\n${stdout}\n${stderr}`);
  }
  return { status: result.status ?? 1, stdout, stderr };
}

async function registryHas(pkg, version) {
  const url = `https://registry.npmjs.org/${pkg}/${version}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  return res.ok;
}

async function waitForKeepVersion() {
  const deadline = Date.now() + WAIT_MS;
  log(`Waiting for ${PACKAGES[PACKAGES.length - 1]}@${KEEP} on npm…`);
  while (Date.now() < deadline) {
    const ready = await Promise.all(PACKAGES.map((pkg) => registryHas(pkg, KEEP)));
    if (ready.every(Boolean)) {
      log(`All packages have ${KEEP}.`);
      return;
    }
    log(`Not all ${KEEP} versions are published yet; retrying in ${POLL_MS / 1000}s.`);
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  throw new Error(`Timed out waiting for ${KEEP}. Refusing to unpublish 1.x/2.x.`);
}

function unpublishVersion(pkg, version) {
  const spec = `${pkg}@${version}`;
  if (dryRun) {
    log(`[dry-run] npm unpublish ${spec}`);
    return;
  }
  log(`Unpublishing ${spec}`);
  const result = npm(['unpublish', spec], { allowFail: true });
  if (result.status === 0) {
    log(`Unpublished ${spec}`);
    return;
  }
  const combined = `${result.stdout}\n${result.stderr}`;
  if (
    combined.includes('404') ||
    /not in the npm registry/i.test(combined) ||
    /cannot unpublish.*does not exist/i.test(combined)
  ) {
    log(`${spec} already gone; skipping.`);
    return;
  }
  throw new Error(`Failed to unpublish ${spec}:\n${combined}`);
}

function pointLatest(pkg) {
  if (dryRun) {
    log(`[dry-run] npm dist-tag add ${pkg}@${KEEP} latest`);
    return;
  }
  log(`Tagging ${pkg}@${KEEP} as latest`);
  npm(['dist-tag', 'add', `${pkg}@${KEEP}`, 'latest']);
}

async function main() {
  if (dryRun) {
    log('Dry run: skipping wait for 0.1.0.');
  } else {
    await waitForKeepVersion();
  }

  for (const pkg of PACKAGES) {
    for (const version of UNPUBLISH[pkg]) {
      unpublishVersion(pkg, version);
    }
  }

  for (const pkg of PACKAGES) {
    pointLatest(pkg);
  }

  log('Done.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
