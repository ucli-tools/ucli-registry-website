import test from 'node:test';
import assert from 'node:assert/strict';
import { safeRepoUrl } from '../src/lib/render-tool.js';

test('safeRepoUrl adds https:// to a bare registry repo', () => {
  assert.equal(safeRepoUrl('github.com/ucli-tools/x'), 'https://github.com/ucli-tools/x');
});

test('safeRepoUrl keeps an http(s) URL', () => {
  assert.equal(safeRepoUrl('https://github.com/ucli-tools/x'), 'https://github.com/ucli-tools/x');
  assert.equal(safeRepoUrl('http://example.org/x'), 'http://example.org/x');
});

test('safeRepoUrl rejects non-http(s) and empty values', async (t) => {
  for (const bad of ['javascript:alert(1)', 'data:text/html,x', 'vbscript:x', 'JaVaScript:x', 'file:///etc/passwd', '', '   ', undefined, null, 42]) {
    await t.test(`rejects ${JSON.stringify(bad) ?? 'undefined'}`, () => {
      assert.equal(safeRepoUrl(bad), null);
    });
  }
});
