const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog-manifest.json'), 'utf8'));
const slugs = new Set(manifest.map(m => m.slug));

function rewriteNavToAbsolute(html) {
  // Rewrite nav references to absolute paths so they work from any depth
  return html
    .replace(/href="\.\.\/index\.html#([\w-]+)"/g, 'href="/#$1"')
    .replace(/href="\.\.\/index\.html"/g, 'href="/"')
    .replace(/href="\.\.\/blogs\.html"/g, 'href="/blog/"');
}

function rewriteInterBlogLinks(html) {
  // href="some-slug.html" (no path) -> href="/blog/some-slug/"
  return html.replace(/href="([a-z][a-z0-9-]*)\.html"/g, (m, slug) => {
    if (slugs.has(slug)) return `href="/blog/${slug}/"`;
    return m;
  });
}

function rewriteCanonicalAndOg(html, slug) {
  return html
    .replace(
      /<link rel="canonical" href="https:\/\/kihiujohn\.github\.io\/blog\/[^"]+"\s*\/?>/,
      `<link rel="canonical" href="https://kihiujohn.github.io/blog/${slug}/">`
    )
    .replace(
      /<meta property="og:url" content="https:\/\/kihiujohn\.github\.io\/blog\/[^"]+"\s*\/?>/,
      `<meta property="og:url" content="https://kihiujohn.github.io/blog/${slug}/">`
    );
}

function buildRedirectStub(slug, title) {
  const target = `/blog/${slug}/`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="canonical" href="https://kihiujohn.github.io${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<meta name="robots" content="noindex">
<script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body>
<p>Redirecting to <a href="${target}">${target}</a>...</p>
</body>
</html>
`;
}

let migrated = 0;
for (const entry of manifest) {
  const slug = entry.slug;
  const srcFile = path.join(BLOG_DIR, `${slug}.html`);
  if (!fs.existsSync(srcFile)) continue;

  let html = fs.readFileSync(srcFile, 'utf8');
  html = rewriteNavToAbsolute(html);
  html = rewriteInterBlogLinks(html);
  html = rewriteCanonicalAndOg(html, slug);

  const destDir = path.join(BLOG_DIR, slug);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), html);

  // Replace old .html with redirect stub
  fs.writeFileSync(srcFile, buildRedirectStub(slug, entry.title));
  migrated++;
}
console.log(`Migrated ${migrated} blog posts to pretty URLs`);
