import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
// Exercise the actual recovered routine without changing or starting the UI.
const start = inline.indexOf('function solveKeplerRelative(');
const end = inline.indexOf('function anchorDepth(', start);
assert.ok(start >= 0 && end > start);
const solve = runInNewContext('const TAU = 2 * Math.PI; const clamp = (v,a,b) => Math.max(a,Math.min(b,v));\n' + inline.slice(start, end) + '\nsolveKeplerRelative');
const near = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('recovered inline application parses as JavaScript', () => {
  assert.doesNotThrow(() => new Script(inline));
});
test('Kepler drift advances a circular AU orbit by one quarter year', () => {
  const state = solve(1, 0, 0, 0, 2 * Math.PI, 0, 4 * Math.PI ** 2, 0.25);
  near(state.rx, 0); near(state.ry, 1); near(state.vx, -2 * Math.PI); near(state.vy, 0); near(state.period, 1);
});
test('Kepler drift returns an eccentric orbit after a complete period', () => {
  const mu = 4 * Math.PI ** 2, perihelion = 0.5, speed = Math.sqrt(3 * mu);
  const state = solve(perihelion, 0, 0, 0, speed, 0, mu, 1);
  near(state.rx, perihelion); near(state.ry, 0); near(state.vy, speed);
});
test('degenerate and unbound states decline the elliptic solver', () => {
  assert.equal(solve(0, 0, 0, 0, 0, 0, 1, 1), null);
  assert.equal(solve(1, 0, 0, 0, 3, 0, 1, 1), null);
});
test('catalog filenames match real presets with valid finite body state', () => {
  const dir = new URL('presets/', root);
  const entries = JSON.parse(readFileSync(new URL('index.json', dir), 'utf8')).presets;
  const files = readdirSync(dir);
  assert.equal(entries.length, 2);
  for (const entry of entries) {
    assert.ok(files.includes(entry.file), `Case-sensitive filename missing: ${entry.file}`);
    const state = JSON.parse(readFileSync(new URL(encodeURIComponent(entry.file), dir), 'utf8'));
    assert.equal(state.format, 'gravity-lab-state'); assert.equal(state.version, 1);
    assert.ok(state.bodies.length > 0 && state.bodies.length <= 8000);
    assert.equal(new Set(state.bodies.map(body => body.id)).size, state.bodies.length);
    for (const body of state.bodies) {
      for (const field of ['mass', 'radius', 'x', 'y', 'z', 'vx', 'vy', 'vz']) assert.ok(Number.isFinite(body[field]), `${entry.file}: ${field}`);
      assert.ok(body.mass >= 0 && body.radius >= 0);
    }
  }
});
