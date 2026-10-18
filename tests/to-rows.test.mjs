import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseRegistry } from '../src/data/registry.ts';
import { toRows } from '../src/lib/to-rows.js';

const read = (f) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');
const evil = '<img src=x onerror=alert(1)>';

test('hostile name, description and tag stay as plain text; javascript: repo gives no link', () => {
  const r = parseRegistry(read('hostile-apps.yaml'));
  const rows = toRows(r.official, 'official');
  assert.equal(rows.length, 2, 'nothing from the fixture is dropped');
  assert.equal(rows[0].name, evil);
  assert.equal(rows[0].href, null);
  assert.ok(rows[0].description.includes(evil));
  assert.equal(rows[0].tags[0], '<script>alert(1)</script>');
});

test('a bare github.com repo becomes an https link', () => {
  const r = parseRegistry(read('hostile-apps.yaml'));
  assert.equal(toRows(r.official, 'official')[1].href, 'https://github.com/ucli-tools/bare');
});

test('rows carry the short sha, the full sha and the kind label; folded text is one line', () => {
  const r = parseRegistry(read('folded-apps.yaml'));
  const [a] = toRows(r.official, 'official');
  assert.equal(a.short, '1111111');
  assert.equal(a.sha.length, 40);
  assert.equal(a.kindLabel, 'Official');
  assert.equal(a.description, 'A folded description that runs over two source lines.');
  assert.equal(toRows(r.templates, 'template')[0].kindLabel, 'Template');
});

test('the sha title is set only for a 40-character hex commit', () => {
  const [ok] = toRows([{ name: 'a', version: 'a'.repeat(40) }], 'official');
  const [odd] = toRows([{ name: 'b', version: '<x>' }], 'official');
  assert.equal(ok.shaTitle, 'a'.repeat(40));
  assert.equal(odd.shaTitle, undefined);
  assert.equal(odd.short, '<x>');
});
