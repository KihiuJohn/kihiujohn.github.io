const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');

const NEW_NAV = `<nav class="bg-white border-b-4 border-black fixed w-full z-10" role="navigation" aria-label="Main navigation">
        <div class="container mx-auto px-6 py-3">
            <div class="flex items-center justify-between">
                <a href="../index.html" class="text-2xl font-bold text-black hover:text-secondary transition" aria-label="John Kihiu Home">John<span class="text-secondary">Kihiu</span></a>
                <div class="hidden md:flex space-x-8">
                    <a href="../index.html#home" class="hover:text-secondary transition">Home</a>
                    <a href="../index.html#about" class="hover:text-secondary transition">About</a>
                    <a href="../index.html#skills" class="hover:text-secondary transition">Skills</a>
                    <a href="../index.html#integrations" class="hover:text-secondary transition">Integrations</a>
                    <a href="../blogs.html" class="text-secondary font-bold">Blog</a>
                    <a href="../index.html#contact" class="hover:text-secondary transition">Contact</a>
                </div>
                <button id="menuButton" class="md:hidden focus:outline-none" aria-label="Toggle menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div id="mobileMenu" class="mobile-menu p-4">
                    <div class="flex flex-col space-y-4">
                        <a href="../index.html#home" class="hover:text-secondary transition">Home</a>
                        <a href="../index.html#about" class="hover:text-secondary transition">About</a>
                        <a href="../index.html#skills" class="hover:text-secondary transition">Skills</a>
                        <a href="../index.html#integrations" class="hover:text-secondary transition">Integrations</a>
                        <a href="../blogs.html" class="text-secondary font-bold">Blog</a>
                        <a href="../index.html#contact" class="hover:text-secondary transition">Contact</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;

const COPY_SCRIPT = `
        // Copy-to-clipboard for code blocks
        document.querySelectorAll('.prose pre').forEach(pre => {
            if (pre.dataset.copyWired) return;
            pre.dataset.copyWired = '1';
            pre.style.position = 'relative';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'copy-btn';
            btn.textContent = 'Copy';
            btn.setAttribute('aria-label', 'Copy code to clipboard');
            btn.addEventListener('click', async () => {
                const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
                try {
                    await navigator.clipboard.writeText(code);
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
                } catch (e) {
                    btn.textContent = 'Failed';
                    setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
                }
            });
            pre.appendChild(btn);
        });`;

const COPY_CSS = `
        .copy-btn { position: absolute; top: 8px; right: 8px; background: #4ade80; color: #000; border: 2px solid #000; padding: 4px 10px; font-size: 12px; font-weight: bold; cursor: pointer; font-family: inherit; box-shadow: 3px 3px 0 #000; transition: all 0.15s; z-index: 2; }
        .copy-btn:hover { transform: translate(1px, 1px); box-shadow: 2px 2px 0 #000; }
        .copy-btn.copied { background: #22c55e; color: #fff; }`;

let updated = 0;
for (const file of files) {
  const full = path.join(BLOG_DIR, file);
  let html = fs.readFileSync(full, 'utf8');
  const original = html;

  // Replace <nav>...first </nav> after body
  html = html.replace(/<nav\b[\s\S]*?<\/nav>/, NEW_NAV);

  // Inject copy CSS before </style>
  if (!html.includes('.copy-btn')) {
    html = html.replace(/<\/style>/, COPY_CSS + '\n    </style>');
  }

  // Inject copy script before </body>
  if (!html.includes('copyWired')) {
    html = html.replace(/(\s*)<\/script>\s*<\/body>/, (m, pre) => {
      return pre + COPY_SCRIPT + '\n    </script>\n</body>';
    });
    // Fallback if the above regex didn't match (no existing script tag before </body>)
    if (!html.includes('copyWired')) {
      html = html.replace(/<\/body>/, `    <script>${COPY_SCRIPT}\n    </script>\n</body>`);
    }
  }

  if (html !== original) {
    fs.writeFileSync(full, html);
    updated++;
  }
}
console.log(`Updated ${updated}/${files.length} blog files with unified nav + copy-to-clipboard`);
