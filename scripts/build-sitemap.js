const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog-manifest.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: 'https://kihiujohn.github.io/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
  { loc: 'https://kihiujohn.github.io/integrations/', lastmod: today, changefreq: 'monthly', priority: '0.95' },
  { loc: 'https://kihiujohn.github.io/blog/', lastmod: today, changefreq: 'daily', priority: '0.9' },
  { loc: 'https://kihiujohn.github.io/CV/', lastmod: today, changefreq: 'monthly', priority: '0.7' },
];

const integrationSlugs = [
  'kra-etims-vscu',
  'rra-vsdc',
  'zra-smart-invoice',
  'tra-vfd',
  'sms-notifications',
  'weighbridge-capture',
];
for (const slug of integrationSlugs) {
  urls.push({
    loc: `https://kihiujohn.github.io/integrations/${slug}/`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.85',
  });
}

for (const post of manifest) {
  urls.push({
    loc: `https://kihiujohn.github.io/blog/${post.slug}/`,
    lastmod: post.datePublished || today,
    changefreq: 'monthly',
    priority: '0.8',
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url>
        <loc>${u.loc}</loc>
        <lastmod>${u.lastmod}</lastmod>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`Wrote sitemap with ${urls.length} URLs`);
