// One-off: normalize blog post pages so their nav renders identically
// to the homepage. Fixes:
//   1. Removes `defer` from the Tailwind CDN script (homepage loads it sync).
//   2. Ensures `body { font-family: 'Courier New', monospace; }` is declared
//      explicitly, so the font is stable even before Tailwind's JIT runs.

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });

const files = [];
for (const e of entries) {
  if (e.isDirectory()) {
    const p = path.join(BLOG_DIR, e.name, 'index.html');
    if (fs.existsSync(p)) files.push(p);
  }
}

let updated = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  // 1. Remove `defer` from Tailwind CDN script.
  html = html.replace(
    /<script\s+src="https:\/\/cdn\.tailwindcss\.com"\s+defer\s*><\/script>/g,
    '<script src="https://cdn.tailwindcss.com"></script>'
  );

  // 2. Make sure body has an explicit Courier New font family so nav/brand
  //    look identical to the homepage regardless of Tailwind timing.
  if (!/body\s*\{[^}]*font-family[^}]*Courier New/.test(html)) {
    // Inject right after the opening <style> tag.
    html = html.replace(
      /<style>\s*/,
      `<style>\nbody { font-family: 'Courier New', monospace; }\n`
    );
  }

  if (html !== original) {
    fs.writeFileSync(file, html);
    updated++;
  }
}

console.log(`Normalized ${updated}/${files.length} blog post pages.`);
