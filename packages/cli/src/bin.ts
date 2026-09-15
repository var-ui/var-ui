#!/usr/bin/env node
// @ts-expect-error TS5097: Node bin entry imports the sibling with a .ts extension
import { runCli } from './run-cli.ts';

runCli(process.argv.slice(2), {
  stdout: process.stdout,
  stderr: process.stderr,
  exit: (code) => {
    process.exit(code);
  },
});
