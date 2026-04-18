const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog-manifest.json'), 'utf8'));

const COVER_MAP = {
  laravel: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  acumatica: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  general: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
};

function tagChipHtml(tag) {
  return `<span class="tag-chip">${tag}</span>`;
}

function cardHtml(post) {
  const cover = COVER_MAP[post.category] || COVER_MAP.general;
  const tags = post.tags.slice(0, 3).map(tagChipHtml).join('');
  const tagData = post.tags.join('|');
  const searchBlob = `${post.title} ${post.description} ${post.tags.join(' ')} ${post.keywords}`.toLowerCase();
  return `<article class="post-card neobrutalist-sm" data-category="${post.category}" data-tags="${tagData}" data-search="${searchBlob.replace(/"/g, '&quot;')}">
      <a href="/blog/${post.slug}/" class="post-cover">
        <img src="${cover}" alt="${post.title.replace(/"/g, '&quot;')}" loading="lazy">
        <span class="post-category cat-${post.category}">${post.category}</span>
      </a>
      <div class="post-body">
        <h3 class="post-title"><a href="/blog/${post.slug}/">${post.title}</a></h3>
        <p class="post-excerpt">${post.description}</p>
        <div class="post-meta">
          <span class="meta-date">${post.datePublished}</span>
          <span class="meta-dot">•</span>
          <span class="meta-read">${post.readingTime} min read</span>
        </div>
        <div class="post-tags">${tags}</div>
      </div>
    </article>`;
}

const acumaticaCount = manifest.filter(m => m.category === 'acumatica').length;
const laravelCount = manifest.filter(m => m.category === 'laravel').length;
const totalCount = manifest.length;

const allTags = {};
for (const p of manifest) {
  for (const t of p.tags) allTags[t] = (allTags[t] || 0) + 1;
}
const topTags = Object.entries(allTags).sort((a, b) => b[1] - a[1]).slice(0, 18);
const tagFilterHtml = topTags
  .map(([t, n]) => `<button class="tag-filter" data-tag="${t}">${t} <span class="tag-count">${n}</span></button>`)
  .join('');

const cardsHtml = manifest.map(cardHtml).join('\n    ');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Technical Blog | John Kihiu - Acumatica ERP & Laravel Expert</title>
<meta name="title" content="Technical Blog | John Kihiu - Acumatica ERP & Laravel Developer">
<meta name="description" content="In-depth articles on Acumatica ERP development, customizations, API integrations, report designer, workflows, and Laravel backend engineering. Search ${totalCount}+ tutorials.">
<meta name="keywords" content="Acumatica Blog, Acumatica Tutorial, Laravel Blog, ERP Development, Acumatica Customization, REST API, Report Designer, Code Snippets">
<meta name="robots" content="index, follow">

<link rel="canonical" href="https://kihiujohn.github.io/blog/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://kihiujohn.github.io/blog/">
<meta property="og:title" content="Technical Blog | John Kihiu - Acumatica ERP & Laravel Expert">
<meta property="og:description" content="${totalCount}+ tutorials on Acumatica ERP and Laravel backend development.">
<meta property="og:image" content="https://kihiujohn.github.io/profile.jpg">

<link rel="icon" type="image/x-icon" href="/static/favicon.ico">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "John Kihiu's Technical Blog",
  "description": "Technical articles on Acumatica ERP and Laravel development",
  "url": "https://kihiujohn.github.io/blog/",
  "author": { "@type": "Person", "name": "John Kihiu" }
}
</script>

<style>
  body { font-family: 'Courier New', monospace; background: #f8fafc; color: #000; }
  .neobrutalist { border: 3px solid #000; box-shadow: 8px 8px 0 #000; background: #fff; }
  .neobrutalist-sm { border: 3px solid #000; box-shadow: 4px 4px 0 #000; background: #fff; transition: transform .15s, box-shadow .15s; }
  .neobrutalist-sm:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 #000; }
  .neobrutalist-btn { border: 3px solid #000; box-shadow: 4px 4px 0 #000; transition: all 0.15s; background: #fff; }
  .neobrutalist-btn:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #000; }

  .text-secondary { color: #4ade80; }
  .bg-secondary { background-color: #4ade80; }
  .hover\\:bg-secondary:hover { background-color: #4ade80; }
  .hover\\:text-secondary:hover { color: #4ade80; }

  .mobile-menu { display: none; position: fixed; top: 80px; right: 20px; background: white; border: 3px solid black; box-shadow: 8px 8px 0 #000; z-index: 20; }
  .mobile-menu.active { display: block; }

  .hero-wrap { background: linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%); border-bottom: 4px solid #000; padding: 80px 0 60px; }
  .search-box { max-width: 640px; margin: 0 auto; position: relative; }
  .search-box input { width: 100%; padding: 18px 20px 18px 52px; border: 4px solid #000; box-shadow: 8px 8px 0 #000; font-size: 1.1rem; font-family: inherit; background: #fff; }
  .search-box input:focus { outline: none; box-shadow: 4px 4px 0 #4ade80; transform: translate(4px, 4px); }
  .search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #000; }

  .stats-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 900px; margin: -30px auto 40px; padding: 0 20px; position: relative; z-index: 5; }
  .stat-card { background: #fff; border: 4px solid #000; box-shadow: 8px 8px 0 #000; padding: 24px; text-align: center; }
  .stat-num { font-size: 2.4rem; font-weight: bold; color: #4ade80; margin-bottom: 4px; }
  .stat-label { font-size: .8rem; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }

  .filters-bar { background: #fff; border-top: 4px solid #000; border-bottom: 4px solid #000; padding: 20px 0; margin-bottom: 30px; }
  .filter-group { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
  .category-btn, .tag-filter { border: 3px solid #000; background: #fff; padding: 8px 16px; font-size: .85rem; font-weight: bold; font-family: inherit; cursor: pointer; transition: all .15s; text-transform: capitalize; }
  .category-btn:hover, .tag-filter:hover { background: #4ade80; }
  .category-btn.active { background: #4ade80; box-shadow: 3px 3px 0 #000; transform: translate(-2px, -2px); }
  .tag-filter.active { background: #fbbf24; }
  .tag-count { background: rgba(0,0,0,.1); padding: 2px 6px; border-radius: 3px; font-size: .75rem; margin-left: 4px; }

  .posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; padding: 0 20px 60px; }
  .post-card { display: flex; flex-direction: column; overflow: hidden; }
  .post-card.hidden { display: none; }
  .post-cover { position: relative; display: block; height: 160px; overflow: hidden; border-bottom: 3px solid #000; }
  .post-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
  .post-card:hover .post-cover img { transform: scale(1.05); }
  .post-category { position: absolute; top: 10px; left: 10px; background: #fff; border: 2px solid #000; padding: 3px 10px; font-size: .7rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
  .cat-acumatica { background: #4ade80; }
  .cat-laravel { background: #fbbf24; }
  .cat-general { background: #c7d2fe; }
  .post-body { padding: 16px; flex: 1; display: flex; flex-direction: column; }
  .post-title { font-size: 1.05rem; font-weight: bold; line-height: 1.3; margin-bottom: 8px; }
  .post-title a { color: #000; text-decoration: none; }
  .post-title a:hover { color: #16a34a; }
  .post-excerpt { font-size: .82rem; color: #4b5563; line-height: 1.5; margin-bottom: 12px; flex: 1; }
  .post-meta { display: flex; align-items: center; gap: 6px; font-size: .72rem; color: #6b7280; margin-bottom: 10px; }
  .meta-dot { opacity: .5; }
  .post-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .tag-chip { background: #f3f4f6; border: 1px solid #000; padding: 2px 8px; font-size: .7rem; text-transform: lowercase; }

  .no-results { grid-column: 1 / -1; text-align: center; padding: 60px 20px; font-size: 1.1rem; color: #6b7280; }
  .result-count { text-align: center; margin-bottom: 20px; font-size: .9rem; color: #6b7280; font-weight: bold; }

  footer { background: #fff; border-top: 4px solid #000; padding: 40px 20px; text-align: center; margin-top: 40px; }
</style>
<script>
  tailwind.config = { theme: { extend: { colors: { primary: '#FFFFFF', secondary: '#4ade80' }, fontFamily: { sans: ['Courier New', 'monospace'] } } } }
</script>
</head>
<body>
<nav class="bg-white border-b-4 border-black fixed w-full z-10" role="navigation" aria-label="Main navigation">
  <div class="container mx-auto px-6 py-3">
    <div class="flex items-center justify-between">
      <a href="/" class="text-2xl font-bold text-black hover:text-secondary transition" aria-label="John Kihiu Home">John<span class="text-secondary">Kihiu</span></a>
      <div class="hidden md:flex space-x-8">
        <a href="/#home" class="hover:text-secondary transition">Home</a>
        <a href="/#about" class="hover:text-secondary transition">About</a>
        <a href="/#skills" class="hover:text-secondary transition">Skills</a>
        <a href="/#integrations" class="hover:text-secondary transition">Integrations</a>
        <a href="/blog/" class="text-secondary font-bold">Blog</a>
        <a href="/#contact" class="hover:text-secondary transition">Contact</a>
      </div>
      <button id="menuButton" class="md:hidden focus:outline-none" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <div id="mobileMenu" class="mobile-menu p-4">
        <div class="flex flex-col space-y-4">
          <a href="/#home" class="hover:text-secondary transition">Home</a>
          <a href="/#about" class="hover:text-secondary transition">About</a>
          <a href="/#skills" class="hover:text-secondary transition">Skills</a>
          <a href="/#integrations" class="hover:text-secondary transition">Integrations</a>
          <a href="/blog/" class="text-secondary font-bold">Blog</a>
          <a href="/#contact" class="hover:text-secondary transition">Contact</a>
        </div>
      </div>
    </div>
  </div>
</nav>

<div style="height: 72px"></div>

<section class="hero-wrap">
  <div class="container mx-auto px-6">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full mb-4" style="box-shadow: 4px 4px 0 #000">
        <span class="w-2 h-2 bg-secondary rounded-full"></span>
        <span class="text-xs font-bold uppercase tracking-widest">Technical Insights & Code Snippets</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-3">The <span class="text-secondary">Dev</span> Knowledge Base</h1>
      <p class="text-gray-700 max-w-2xl mx-auto mb-8">Search ${totalCount}+ battle-tested tutorials on Acumatica ERP, Laravel, APIs, and enterprise integrations. Code snippets you can copy and use today.</p>
    </div>
    <div class="search-box">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input id="searchInput" type="search" placeholder="Search ${totalCount}+ articles, snippets, tags..." autocomplete="off">
    </div>
  </div>
</section>

<div class="stats-strip">
  <div class="stat-card">
    <div class="stat-num">${totalCount}</div>
    <div class="stat-label">Total Articles</div>
  </div>
  <div class="stat-card">
    <div class="stat-num">${acumaticaCount}</div>
    <div class="stat-label">Acumatica</div>
  </div>
  <div class="stat-card">
    <div class="stat-num">${laravelCount}</div>
    <div class="stat-label">Laravel</div>
  </div>
</div>

<div class="filters-bar">
  <div class="filter-group" role="tablist" aria-label="Category filters">
    <button class="category-btn active" data-category="all">All Posts</button>
    <button class="category-btn" data-category="acumatica">Acumatica</button>
    <button class="category-btn" data-category="laravel">Laravel</button>
  </div>
  <div class="filter-group" style="margin-top: 14px;" aria-label="Tag filters">
    ${tagFilterHtml}
  </div>
</div>

<div class="result-count" id="resultCount">Showing ${totalCount} articles</div>
<div class="posts-grid" id="postsGrid">
    ${cardsHtml}
</div>

<footer>
  <div class="text-2xl font-bold mb-4">John<span class="text-secondary">Kihiu</span></div>
  <p class="text-sm text-gray-600">&copy; 2024 John Kihiu. All rights reserved.</p>
</footer>

<script>
  feather.replace();
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  menuButton.addEventListener('click', () => mobileMenu.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) mobileMenu.classList.remove('active');
  });

  const searchInput = document.getElementById('searchInput');
  const cards = Array.from(document.querySelectorAll('.post-card'));
  const resultCount = document.getElementById('resultCount');
  const catButtons = document.querySelectorAll('.category-btn');
  const tagButtons = document.querySelectorAll('.tag-filter');
  const state = { q: '', cat: 'all', tag: null };

  function apply() {
    const q = state.q.trim().toLowerCase();
    let visible = 0;
    cards.forEach(c => {
      const matchCat = state.cat === 'all' || c.dataset.category === state.cat;
      const matchTag = !state.tag || (c.dataset.tags || '').split('|').includes(state.tag);
      const matchQ = !q || (c.dataset.search || '').includes(q);
      const show = matchCat && matchTag && matchQ;
      c.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    resultCount.textContent = visible === cards.length
      ? 'Showing ' + cards.length + ' articles'
      : 'Showing ' + visible + ' of ' + cards.length + ' articles';
    const grid = document.getElementById('postsGrid');
    grid.querySelector('.no-results')?.remove();
    if (visible === 0) {
      const empty = document.createElement('div');
      empty.className = 'no-results';
      empty.innerHTML = 'No articles match your filters. <a href="#" onclick="event.preventDefault();resetAll()" style="color:#16a34a;font-weight:bold">Clear filters</a>';
      grid.appendChild(empty);
    }
  }
  window.resetAll = function() {
    state.q = ''; state.cat = 'all'; state.tag = null;
    searchInput.value = '';
    catButtons.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
    tagButtons.forEach(b => b.classList.remove('active'));
    apply();
  };
  searchInput.addEventListener('input', (e) => { state.q = e.target.value; apply(); });
  catButtons.forEach(b => b.addEventListener('click', () => {
    state.cat = b.dataset.category;
    catButtons.forEach(x => x.classList.toggle('active', x === b));
    apply();
  }));
  tagButtons.forEach(b => b.addEventListener('click', () => {
    if (state.tag === b.dataset.tag) { state.tag = null; b.classList.remove('active'); }
    else { state.tag = b.dataset.tag; tagButtons.forEach(x => x.classList.toggle('active', x === b)); }
    apply();
  }));
</script>
</body>
</html>
`;

// Write both /blog/index.html (pretty URL) and keep /blogs.html as redirect
fs.writeFileSync(path.join(ROOT, 'blog', 'index.html'), html);

const blogsRedirect = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Blog | John Kihiu</title>
<link rel="canonical" href="https://kihiujohn.github.io/blog/">
<meta http-equiv="refresh" content="0; url=/blog/">
<meta name="robots" content="noindex">
<script>window.location.replace('/blog/');</script>
</head>
<body><p>Redirecting to <a href="/blog/">/blog/</a>...</p></body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'blogs.html'), blogsRedirect);

console.log('Built blog listing at /blog/index.html and /blogs.html redirect');
