// API endpoint to serve apps as JSON
export async function GET() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/ucli-tools/ucli-registry/main/registry/apps.yaml'
    );
    const yamlText = await response.text();

    // Parse YAML to JSON (simple parser for our format)
    const apps = parseAppsYaml(yamlText);

    return new Response(JSON.stringify(apps, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch apps' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function parseAppsYaml(yaml: string) {
  const apps: any[] = [];
  const officialSection = yaml.match(/official:([\s\S]*?)(?=community:|metadata:|$)/)?.[1] || '';
  const communitySection = yaml.match(/community:([\s\S]*?)(?=metadata:|$)/)?.[1] || '';

  // Parse official apps
  const officialMatches = officialSection.matchAll(/- name: ([\s\S]*?)(?=- name:|community:|metadata:|$)/g);
  for (const match of officialMatches) {
    const appText = match[1];
    const app = parseApp(appText, 'official');
    if (app) apps.push(app);
  }

  // Parse community apps
  const communityMatches = communitySection.matchAll(/- name: ([\s\S]*?)(?=- name:|metadata:|$)/g);
  for (const match of communityMatches) {
    const appText = match[1];
    const app = parseApp(appText, 'community');
    if (app) apps.push(app);
  }

  return apps;
}

function parseApp(text: string, type: string) {
  const name = text.match(/^(\S+)/)?.[1];
  if (!name) return null;

  const repo = text.match(/repo: (.+)/)?.[1]?.trim();
  const description = text.match(/description: (.+)/)?.[1]?.trim();
  const pattern = text.match(/pattern: (\S+)/)?.[1];
  const status = text.match(/status: (\S+)/)?.[1];
  const version = text.match(/version: (\S+)/)?.[1];
  const tagsMatch = text.match(/tags:\s*\n([\s\S]*?)(?=\n\s*\w+:|$)/);
  const tags = tagsMatch ? tagsMatch[1].match(/- (\S+)/g)?.map(t => t.substring(2)) || [] : [];

  return {
    name,
    repo,
    description,
    pattern,
    status,
    version,
    tags,
    type,
  };
}
