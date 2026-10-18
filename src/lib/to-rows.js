// Maps registry entries to table rows. Pure: no DOM, no HTML. Text is passed on as plain strings (Astro
// escapes it when it renders); the only link is the one safeRepoUrl accepts. Nothing is dropped.
import { safeRepoUrl } from './render-tool.js';

const KIND_LABEL = { official: 'Official', community: 'Community', template: 'Template' };

export function toRows(entries, kind) {
  return (Array.isArray(entries) ? entries : []).map((e) => {
    const name = String(e?.name ?? '');
    const description = String(e?.description ?? '').replace(/\s+/g, ' ').trim();
    const tags = Array.isArray(e?.tags) ? e.tags.map(String) : [];
    const sha = typeof e?.version === 'string' ? e.version.trim() : '';
    return {
      name,
      href: safeRepoUrl(e?.repo),
      sha,
      shaTitle: /^[0-9a-f]{40}$/i.test(sha) ? sha : undefined,
      short: sha.slice(0, 7),
      kind,
      kindLabel: KIND_LABEL[kind],
      description,
      tags,
    };
  });
}

export function counts(registry) {
  const official = registry.official.length;
  const community = registry.community.length;
  const template = registry.templates.length;
  return { all: official + community + template, official, community, template };
}
