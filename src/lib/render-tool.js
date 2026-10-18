// Builds a registry tool card with DOM APIs only. Registry data is only ever
// assigned through textContent / setAttribute, never parsed as HTML.

const GITHUB_ICON =
  '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';

// Returns an absolute http(s) URL string, or null. Bare "host/path" values
// (the registry format) get https:// prepended; any other scheme is rejected.
export function safeRepoUrl(repo) {
  if (typeof repo !== 'string') return null;
  const value = repo.trim();
  if (!value) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) && !/^[^/]*:\d+(\/|$)/.test(value)
    ? value
    : 'https://' + value;
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function renderTool(doc, tool, onCopy) {
  const statusColor = tool.status === 'production' ? 'green' : tool.status === 'beta' ? 'yellow' : 'gray';
  const typeColor = 'orange';

  const el = (tag, className, text) => {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };

  const card = el('div', `bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-${typeColor}-400/60 transition group flex flex-col h-full`);

  const head = el('div', 'flex items-start justify-between mb-4');
  const headInner = el('div', 'flex-1');
  const titleRow = el('div', 'flex items-center gap-2 mb-2');
  titleRow.append(
    el('h3', `text-xl font-bold text-white group-hover:text-${typeColor}-200 transition`, tool.name),
    el('span', `text-xs px-2 py-1 bg-${typeColor}-600/80 rounded text-white font-semibold`, 'Official'),
  );
  headInner.append(titleRow, el('p', 'text-white/80 text-sm mb-3', tool.description || 'No description available'));
  head.append(headInner);

  const badges = el('div', 'flex flex-wrap gap-2 mb-4 min-h-[32px]');
  badges.append(el('span', `text-xs px-2 py-1 bg-${statusColor}-600/30 text-${statusColor}-200 rounded border border-${statusColor}-400/40`, tool.status ?? ''));
  const tags = Array.isArray(tool.tags) ? tool.tags : [];
  for (const tag of tags.slice(0, 3)) {
    badges.append(el('span', 'text-xs px-2 py-1 bg-white/20 text-white/80 rounded', tag));
  }
  if (tags.length > 3) {
    const more = el('span', 'text-xs px-2 py-1 bg-white/20 text-white/70 rounded cursor-help', `+${tags.length - 3} more`);
    more.setAttribute('title', tags.slice(3).join(', '));
    badges.append(more);
  }

  const actions = el('div', 'flex gap-2 mt-auto');
  const copy = el('button', `flex-1 px-4 py-2 bg-${typeColor}-600 hover:bg-${typeColor}-500 rounded-lg font-medium transition text-white text-sm`, 'Copy Install Command');
  copy.setAttribute('type', 'button');
  if (onCopy) copy.addEventListener('click', () => onCopy(tool.name));
  actions.append(copy);

  const href = safeRepoUrl(tool.repo);
  if (href) {
    const link = el('a', 'px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-white text-sm flex items-center gap-2 backdrop-blur-sm');
    link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.innerHTML = GITHUB_ICON; // constant markup, no registry data
    link.append(doc.createTextNode(' View '));
    actions.append(link);
  }

  card.append(head, badges, actions);
  return card;
}
