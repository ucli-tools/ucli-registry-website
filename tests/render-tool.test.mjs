import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { renderTool, safeRepoUrl } from '../src/lib/render-tool.js';

const { document } = parseHTML('<html><body></body></html>');
const evil = '<img src=x onerror=alert(1)>';

test('hostile name/description/tag render as text, javascript: url gives no link', () => {
  const card = renderTool(document, {
    name: evil, description: evil, status: evil, tags: [evil], repo: 'javascript:alert(1)', type: 'official',
  });
  assert.equal(card.querySelector('img'), null);
  assert.equal(card.querySelector('a'), null);
  assert.equal(card.querySelector('h3').textContent, evil);
  assert.ok(card.textContent.includes(evil));
});

test('registry repo renders a noopener link; other schemes rejected', () => {
  const card = renderTool(document, { name: 'x', repo: 'github.com/ucli-tools/x', status: 'beta', tags: [] });
  const a = card.querySelector('a');
  assert.equal(a.getAttribute('href'), 'https://github.com/ucli-tools/x');
  assert.equal(a.getAttribute('rel'), 'noopener noreferrer');
  for (const bad of ['javascript:alert(1)', 'data:text/html,x', 'vbscript:x', 'JaVaScript:x', 'file:///etc/passwd', '', undefined]) {
    assert.equal(safeRepoUrl(bad), null, String(bad));
  }
});
