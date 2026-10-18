import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseRegistry } from '../src/data/registry.ts';
import { toRows, counts } from '../src/lib/to-rows.js';

const read = (f) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');

test('folded fixture: counts and full description text', () => {
  const r = parseRegistry(read('folded-apps.yaml'));
  assert.deepEqual(counts(r), { all: 3, official: 2, community: 0, template: 1 });
  assert.equal(r.official[0].description, 'A folded description that runs over two source lines.\n');
  assert.equal(r.official[1].description, 'A multi-line plain scalar that continues here');
});

test('parseRegistry throws on an empty or missing official list', () => {
  assert.throws(() => parseRegistry('apps:\n  official: []\n'));
  assert.throws(() => parseRegistry('apps: {}\n'));
  assert.throws(() => parseRegistry('a: [unclosed'));
});
