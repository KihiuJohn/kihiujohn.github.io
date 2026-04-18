const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const SCRIPT = `<script>
(function(){
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && ['u','U','s','S','i','I'].includes(e.key)) e.preventDefault();
    if (e.key === 'F12') e.preventDefault();
    if (e.ctrlKey && e.shiftKey && ['i','I','j','J','c','C'].includes(e.key)) e.preventDefault();
  });
})();
</script>`;

const MARK = 'document.addEventListener(\'contextmenu\'';

function collectFiles() {
  const files = [];
  // Blog posts
  const blogDir = path.join(ROOT, 'blog');
  for (const entry of fs.readdirSync(blogDir)) {
    const full = path.join(blogDir, entry);
    if (fs.statSync(full).isDirectory()) {
      const idx = path.join(full, 'index.html');
      if (fs.existsSync(idx)) files.push(idx);
    }
  }
  files.push(path.join(blogDir, 'index.html'));
  // Blogs redirect stub (short file - but still worth protecting)
  const blogsHtml = path.join(ROOT, 'blogs.html');
  if (fs.existsSync(blogsHtml)) files.push(blogsHtml);
  // 404
  const notFound = path.join(ROOT, '404.html');
  if (fs.existsSync(notFound)) files.push(notFound);
  return files;
}

let updated = 0, skipped = 0;
for (const file of collectFiles()) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARK)) { skipped++; continue; }
  if (!html.includes('</body>')) { skipped++; continue; }
  const out = html.replace('</body>', SCRIPT + '\n</body>');
  fs.writeFileSync(file, out);
  updated++;
}
console.log(`Injected inspect-protection into ${updated} files (${skipped} already had it or had no body)`);
