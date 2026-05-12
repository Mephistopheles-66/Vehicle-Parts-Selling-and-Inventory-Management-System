import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const binDir = join(projectRoot, 'node_modules', '.bin');

const input = process.env.OPENAPI_INPUT_URL ?? 'http://localhost:5165/openapi/v1.json';
const typesOutput = process.env.OPENAPI_TYPES_OUTPUT ?? join(projectRoot, 'src', 'api', 'generated', 'schema.d.ts');
const clientOutput = process.env.OPENAPI_CLIENT_OUTPUT ?? join(projectRoot, 'src', 'api', 'generated', 'client');
const cacheOutput = process.env.OPENAPI_CACHE_OUTPUT ?? join(projectRoot, 'src', 'api', 'generated', 'openapi.json');

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

mkdirSync(dirname(typesOutput), { recursive: true });
rmSync(clientOutput, { recursive: true, force: true });

let generatorInput = input;
if (/^https?:\/\//i.test(input)) {
  const response = await fetch(input);

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI document from ${input}: ${response.status} ${response.statusText}`);
  }

  const spec = await response.text();
  mkdirSync(dirname(cacheOutput), { recursive: true });
  writeFileSync(cacheOutput, spec);
  generatorInput = cacheOutput;
}

run(join(binDir, 'openapi-typescript'), [
  generatorInput,
  '--output',
  typesOutput,
  '--export-type',
]);

run(join(binDir, 'openapi'), [
  '--input',
  generatorInput,
  '--output',
  clientOutput,
  '--client',
  'fetch',
  '--useOptions',
  '--useUnionTypes',
]);
