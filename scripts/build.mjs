import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';

// The deployed archive contains static sources, not the original build program.
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const source = new URL('presets/', root);
const existing = JSON.parse(await readFile(new URL('index.json', source), 'utf8'));
const names = new Map(existing.presets.map(entry => [entry.file, entry.name]));
const files = (await readdir(source)).filter(file => file.endsWith('.gravitylab.json')).sort();
const presets = [];
for (const file of files) {
  const state = JSON.parse(await readFile(new URL(encodeURIComponent(file), source), 'utf8'));
  if (state.format !== 'gravity-lab-state' || state.version !== 1 || !Array.isArray(state.bodies)) {
    throw new Error(`Invalid preset: ${file}`);
  }
  presets.push({ file, name: names.get(file) || file.replace(/\.gravitylab\.json$/, '').replace(/[_-]/g, ' ') });
}
await rm(output, { recursive: true, force: true });
await mkdir(new URL('presets/', output), { recursive: true });
await cp(new URL('index.html', root), new URL('index.html', output));
for (const { file } of presets) {
  await cp(new URL(encodeURIComponent(file), source), new URL('presets/' + encodeURIComponent(file), output));
}
await writeFile(new URL('presets/index.json', output), JSON.stringify({ version: 4, presets }, null, 2) + '\n');
await writeFile(new URL('build-report.json', output), JSON.stringify({ presets }, null, 2) + '\n');
console.log(`Built Gravity Lab with ${presets.length} presets.`);
