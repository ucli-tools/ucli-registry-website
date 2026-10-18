// Loads the registry (ucli-registry registry/apps.yaml) at build time. Throws on anything unusual:
// a stale page is worse than no deploy. REGISTRY_FILE (a path to a YAML file) replaces the network
// fetch, for tests and fixtures.
import { readFileSync } from 'node:fs';
import YAML from 'yaml';

export const REGISTRY_URL = 'https://raw.githubusercontent.com/ucli-tools/ucli-registry/main/registry/apps.yaml';

export type Kind = 'official' | 'community' | 'template';
export interface App {
  name?: string;
  repo?: string;
  description?: string;
  version?: string;
  tags?: string[];
  [k: string]: unknown;
}
export interface Registry {
  official: App[];
  community: App[];
  templates: App[];
  builtOn: string;
}

export function parseRegistry(text: string): Omit<Registry, 'builtOn'> {
  // failsafe schema: every scalar stays a string, so an all-digit or 1e10-looking commit is never a number
  const doc = YAML.parse(text, { schema: 'failsafe' });
  const apps = doc?.apps;
  if (!apps || !Array.isArray(apps.official) || apps.official.length === 0) {
    throw new Error('registry: apps.official is missing or empty');
  }
  const list = (v: unknown): App[] => (Array.isArray(v) ? (v as App[]) : []);
  return { official: apps.official as App[], community: list(apps.community), templates: list(apps.templates) };
}

export async function loadRegistry(): Promise<Registry> {
  let text: string;
  const file = process.env.REGISTRY_FILE;
  if (file) {
    text = readFileSync(file, 'utf8');
  } else {
    const response = await fetch(REGISTRY_URL);
    if (!response.ok) throw new Error(`registry: ${REGISTRY_URL} answered ${response.status}`);
    text = await response.text();
  }
  return { ...parseRegistry(text), builtOn: new Date().toISOString().slice(0, 10) };
}
