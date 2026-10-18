// The one link check for registry data. The page renders every repo link through safeRepoUrl; registry
// data is never parsed as HTML.

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
