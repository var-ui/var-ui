import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeComponentProps } from '../src/lib/extract-component-props';

const docsRoot = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(docsRoot, '../src/generated/props');

writeComponentProps(outputDir);
