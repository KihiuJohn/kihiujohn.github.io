// One-off: soften the sales tone on each integration sub-page so they
// read as custom engineering work rather than productized software.

const fs = require('fs');
const path = require('path');

const INTEG_DIR = path.join(__dirname, '..', 'integrations');
const subdirs = fs
  .readdirSync(INTEG_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => path.join(INTEG_DIR, d.name, 'index.html'))
  .filter((p) => fs.existsSync(p));

const replacements = [
  {
    from: /<h3>Ready to deploy ([^<]+) on Acumatica\?<\/h3>/,
    to: '<h3>Want a custom integration like this built for your business?</h3>',
  },
  {
    from: /<p>Every engagement starts with a free discovery call to scope your requirements\. Reach out via any channel below and I'll get back within one business day\.<\/p>/,
    to: "<p>Each project starts with a discovery call to map your specific requirements — every integration is engineered from scratch to match your workflow, not adapted from an off-the-shelf package. Reach out via any channel below and I'll get back within one business day.</p>",
  },
];

let changed = 0;
for (const file of subdirs) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  for (const { from, to } of replacements) {
    html = html.replace(from, to);
  }
  if (html !== original) {
    fs.writeFileSync(file, html);
    changed++;
  }
}

console.log(`Reworded ${changed}/${subdirs.length} integration sub-pages.`);
