const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const OUT = path.join(__dirname, '..', 'blog-manifest.json');

const files = fs.readdirSync(BLOG_DIR)
  .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'index.txt');

function pick(re, html, group = 1) {
  const m = html.match(re);
  return m ? m[group].trim() : '';
}

function detectCategory(slug, html) {
  const s = slug.toLowerCase();
  const t = (pick(/<title>([\s\S]*?)<\/title>/i, html) + ' ' + pick(/name="keywords" content="([^"]*)"/i, html)).toLowerCase();
  if (s.startsWith('laravel-') || t.includes('laravel')) return 'laravel';
  if (s.startsWith('acumatica-') || t.includes('acumatica')) return 'acumatica';
  if (s.includes('api') || s.includes('deploying')) return 'acumatica';
  return 'general';
}

function detectTags(slug, title, keywords) {
  const tags = new Set();
  const s = slug.toLowerCase();
  const all = (title + ' ' + keywords + ' ' + slug).toLowerCase();
  const catalog = [
    'acumatica', 'laravel', 'rest api', 'graphql', 'authentication', 'oauth', 'passport',
    'docker', 'azure', 'aws', 'report designer', 'generic inquiries', 'workflow', 'integration',
    'customization', 'security', 'performance', 'testing', 'queues', 'redis', 'ci/cd',
    'ecommerce', 'shopify', 'salesforce', 'power bi', 'inventory', 'manufacturing', 'crm',
    'edi', 'payments', 'payroll', 'project accounting', 'tax', 'fiscalization', 'sms',
    'webhooks', 'logging', 'monitoring', 'deployment', 'microservices', 'websockets',
    'livewire', 'blade', 'eloquent', 'nova', 'horizon', 'pulse', 'octane', 'sail', 'forge', 'vapor',
    'c#', '.net', 'php', 'mysql', 'postgresql', 'database', 'migrations', 'caching',
  ];
  for (const tag of catalog) {
    if (all.includes(tag)) tags.add(tag);
  }
  return Array.from(tags).slice(0, 5);
}

function estimateReadingTime(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const words = text.split(' ').length;
  return Math.max(3, Math.round(words / 220));
}

const manifest = files.map(file => {
  const full = path.join(BLOG_DIR, file);
  const html = fs.readFileSync(full, 'utf8');
  const slug = file.replace(/\.html$/, '');
  const title = pick(/<title>([\s\S]*?)(?:\s*\|[^<]*)?<\/title>/i, html)
             || pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html).replace(/<[^>]+>/g, '');
  const description = pick(/name="description" content="([^"]*)"/i, html);
  const keywords = pick(/name="keywords" content="([^"]*)"/i, html);
  const datePublished = pick(/"datePublished":\s*"([^"]*)"/i, html) || '2024-01-01';
  const category = detectCategory(slug, html);
  const tags = detectTags(slug, title, keywords);
  const readingTime = estimateReadingTime(html);
  return { slug, title: title.replace(/\s*\|\s*John Kihiu.*$/i, '').trim(), description, keywords, datePublished, category, tags, readingTime };
});

manifest.sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.slug.localeCompare(b.slug));

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${manifest.length} entries to ${OUT}`);
console.log(`Categories: acumatica=${manifest.filter(m => m.category === 'acumatica').length}, laravel=${manifest.filter(m => m.category === 'laravel').length}, general=${manifest.filter(m => m.category === 'general').length}`);
