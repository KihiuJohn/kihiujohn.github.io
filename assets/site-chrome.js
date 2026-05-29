/* John Kihiu — shared site chrome (nav, footer, WhatsApp dialog, floating button)
   Self-contained: injects its own CSS + HTML + handlers.
   Each page only needs:  <script src="/assets/site-chrome.js" defer></script>
   Set <body data-page="home|integrations|blog|cv|post"> to mark active nav link.
*/
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────
  // CSS — chrome only (does not touch page-specific styles)
  // ─────────────────────────────────────────────────────────
  const CSS = `
  :root{
    --chrome-nav-h: clamp(3.5rem, 5vw, 4.25rem);
    --chrome-text: #0C0A09;
    --chrome-text-2: #57534E;
    --chrome-muted: #78716C;
    --chrome-border: #E7E5E4;
    --chrome-bg: #FAFAF9;
    --chrome-accent: #4ade80;
    --chrome-accent-dk: #16a34a;
    --chrome-accent-tint: #ECFDF5;
    --chrome-max: 80rem;
    --chrome-gutter: clamp(1rem, 3vw, 1.75rem);
    --chrome-radius: 6px;
    --chrome-radius-md: 10px;
    --chrome-shadow-2: 0 4px 14px rgba(12,10,9,0.06);
    --chrome-shadow-3: 0 12px 36px rgba(12,10,9,0.12);
  }

  /* ── NAV ── */
  #siteNav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: var(--chrome-nav-h); background: rgba(255,255,255,0.92); backdrop-filter: saturate(160%) blur(10px); border-bottom: 1px solid var(--chrome-border); }
  #siteNav.scrolled { box-shadow: var(--chrome-shadow-2); }
  #siteNav .nav-inner { max-width: var(--chrome-max); margin: 0 auto; padding: 0 var(--chrome-gutter); height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
  #siteNav .nav-logo { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 1.18rem; letter-spacing: -0.02em; color: var(--chrome-text); flex-shrink: 0; }
  #siteNav .nav-logo .lg-1 { color: var(--chrome-text); }
  #siteNav .nav-logo .lg-2 { color: var(--chrome-accent-dk); }
  #siteNav .nav-links { display: flex; align-items: center; gap: clamp(1rem, 2vw, 2rem); list-style: none; margin: 0; padding: 0; }
  #siteNav .nav-links a { font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem; font-weight: 500; color: var(--chrome-text-2); text-decoration: none; transition: color .15s; padding: 0.4rem 0; position: relative; }
  #siteNav .nav-links a:hover { color: var(--chrome-text); }
  #siteNav .nav-links a.active { color: var(--chrome-text); }
  #siteNav .nav-links a.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -0.15rem; height: 2px; background: var(--chrome-accent-dk); border-radius: 2px; }
  #siteNav .nav-cta { font-family: 'Inter', system-ui, sans-serif; font-size: 0.85rem; font-weight: 600; padding: 0.55rem 1rem; border-radius: var(--chrome-radius); background: var(--chrome-text); color: #fff; text-decoration: none; transition: background .15s; }
  #siteNav .nav-cta:hover { background: var(--chrome-accent-dk); }
  #siteNav .nav-burger { display: none; flex-direction: column; gap: 4px; background: none; border: none; padding: 0.4rem; cursor: pointer; }
  #siteNav .nav-burger span { display: block; width: 22px; height: 2px; background: var(--chrome-text); border-radius: 1px; transition: transform .2s, opacity .2s; }
  #siteNav .nav-burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  #siteNav .nav-burger.open span:nth-child(2) { opacity: 0; }
  #siteNav .nav-burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

  #siteDrawer { position: fixed; top: var(--chrome-nav-h); left: 0; right: 0; background: #fff; border-bottom: 1px solid var(--chrome-border); padding: 0.5rem var(--chrome-gutter) 1rem; transform: translateY(-110%); transition: transform .25s; z-index: 99; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  #siteDrawer.open { transform: translateY(0); }
  #siteDrawer a { display: block; padding: 0.85rem 0.25rem; font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem; font-weight: 500; color: var(--chrome-text-2); border-bottom: 1px solid var(--chrome-border); text-decoration: none; }
  #siteDrawer a:last-child { border-bottom: none; }
  #siteDrawer a:hover { color: var(--chrome-text); }
  #siteDrawer a.active { color: var(--chrome-accent-dk); font-weight: 600; }

  body.chrome-nav-spacer { padding-top: var(--chrome-nav-h); }

  /* ── FOOTER ── */
  #siteFooter { background: #0C0A09; color: #D6D3D1; margin-top: 4rem; }
  #siteFooter .ft-container { max-width: var(--chrome-max); margin: 0 auto; padding: 0 var(--chrome-gutter); }
  #siteFooter .ft-top { padding: clamp(2.5rem, 5vw, 4rem) 0 2.25rem; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: clamp(1.5rem, 4vw, 3rem); border-bottom: 1px solid rgba(255,255,255,0.06); }
  #siteFooter .ft-logo { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; margin: 0 0 0.7rem; display: inline-block; text-decoration: none; }
  #siteFooter .ft-logo .lg-1 { color: var(--chrome-accent); }
  #siteFooter .ft-logo .lg-2 { color: #fff; }
  #siteFooter .ft-brand p { font-family: 'Inter', system-ui, sans-serif; font-size: 0.88rem; color: #A8A29E; line-height: 1.7; max-width: 30ch; margin: 0; }
  #siteFooter .ft-socials { display: flex; gap: 0.5rem; margin-top: 1.1rem; }
  #siteFooter .ft-social { width: 2.1rem; height: 2.1rem; border-radius: var(--chrome-radius); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; color: #A8A29E; transition: all .15s; text-decoration: none; }
  #siteFooter .ft-social:hover { color: #fff; border-color: var(--chrome-accent); background: rgba(74,222,128,0.08); }
  #siteFooter .ft-social svg { width: 1rem; height: 1rem; }
  #siteFooter .ft-col h4 { font-family: 'Inter', system-ui, sans-serif; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: #78716C; margin: 0 0 1rem; }
  #siteFooter .ft-col a { display: block; font-family: 'Inter', system-ui, sans-serif; font-size: 0.86rem; color: #A8A29E; margin-bottom: 0.5rem; transition: color .15s; text-decoration: none; }
  #siteFooter .ft-col a:hover { color: #fff; }
  #siteFooter .ft-bottom { padding: 1.25rem 0; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; font-family: 'Inter', system-ui, sans-serif; font-size: 0.78rem; color: #57534E; }

  @media (max-width: 64rem) { #siteFooter .ft-top { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 48rem) {
    #siteNav .nav-links, #siteNav .nav-cta { display: none; }
    #siteNav .nav-burger { display: flex; }
    #siteFooter .ft-top { grid-template-columns: 1fr; gap: 1.75rem; }
  }

  /* ── FLOATING WA BUTTON (flat color, no pulse breathing) ── */
  .wa-float { position: fixed; bottom: clamp(1rem, 3vw, 1.5rem); right: clamp(1rem, 3vw, 1.5rem); width: 3.4rem; height: 3.4rem; border-radius: 50%; background: #25D366; color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37,211,102,0.4); border: none; cursor: pointer; z-index: 90; transition: transform .2s, box-shadow .2s; }
  .wa-float:hover { transform: scale(1.06); box-shadow: 0 6px 18px rgba(37,211,102,0.5); }
  .wa-float svg { width: 1.7rem; height: 1.7rem; }

  /* ── WA CHAT MODAL ── */
  .wa-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 500; display: none; align-items: flex-end; justify-content: flex-end; padding: clamp(0.5rem, 2vw, 1.5rem); }
  .wa-overlay.open { display: flex; animation: waFade .25s; }
  @keyframes waFade { from { opacity: 0 } to { opacity: 1 } }
  .wa-window { width: min(24rem, 100%); height: min(36rem, 90vh); background: #efeae2; border-radius: var(--chrome-radius-md); box-shadow: var(--chrome-shadow-3); overflow: hidden; display: flex; flex-direction: column; animation: waSlide .3s; font-family: 'Inter', system-ui, sans-serif; }
  @keyframes waSlide { from { transform: translateY(2rem); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  .wa-header { background: #008069; color: #fff; padding: 0.75rem 0.85rem; display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0; }
  .wa-back, .wa-close { background: none; border: none; color: #fff; padding: 0.35rem; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; }
  .wa-back:hover, .wa-close:hover { background: rgba(255,255,255,0.12); }
  .wa-back svg, .wa-close svg { width: 1.1rem; height: 1.1rem; }
  .wa-avatar { width: 2.4rem; height: 2.4rem; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #128C7E; }
  .wa-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .wa-contact { flex: 1; line-height: 1.2; }
  .wa-contact-name { font-size: 0.95rem; font-weight: 600; }
  .wa-contact-status { font-size: 0.72rem; opacity: 0.88; display: flex; align-items: center; gap: 0.35rem; margin-top: 0.1rem; }
  .wa-contact-status::before { content: ''; width: 0.5rem; height: 0.5rem; border-radius: 50%; background: #4ADE80; }
  .wa-body { flex: 1; padding: 0.85rem 0.85rem 0.5rem; overflow-y: auto; background-color: #efeae2; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23dad4cc' stroke-width='0.6' opacity='0.9'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Cpath d='M70 50 q10 -10 20 0 t20 0'/%3E%3Crect x='130' y='25' width='14' height='14' rx='2'/%3E%3Cpath d='M20 90 l8 -8 l8 8 l-8 8 z'/%3E%3Ccircle cx='100' cy='100' r='4'/%3E%3Cpath d='M150 80 l10 0 l-5 8 z'/%3E%3Cpath d='M30 150 q10 5 20 0 q10 -5 20 0'/%3E%3Ccircle cx='160' cy='160' r='6'/%3E%3Cpath d='M80 170 l4 -4 l4 4 l-4 4 z'/%3E%3C/g%3E%3C/svg%3E"); display: flex; flex-direction: column; gap: 0.5rem; }
  .wa-msg { max-width: 80%; padding: 0.5rem 0.65rem 0.65rem; border-radius: var(--chrome-radius-md); font-size: 0.88rem; line-height: 1.4; color: #111B21; position: relative; box-shadow: 0 1px 1px rgba(0,0,0,0.08); word-wrap: break-word; }
  .wa-msg.in { background: #fff; border-top-left-radius: 0; align-self: flex-start; }
  .wa-msg.out { background: #d9fdd3; border-top-right-radius: 0; align-self: flex-end; }
  .wa-msg time { display: block; font-size: 0.62rem; color: #667781; text-align: right; margin-top: 0.15rem; font-weight: 500; }
  .wa-day { align-self: center; background: rgba(225,245,254,0.9); color: #54656F; font-size: 0.7rem; padding: 0.25rem 0.65rem; border-radius: var(--chrome-radius); font-weight: 500; margin: 0.25rem 0; box-shadow: 0 1px 1px rgba(0,0,0,0.06); }
  .wa-quick { display: flex; flex-wrap: wrap; gap: 0.35rem; align-self: flex-start; max-width: 90%; margin-top: 0.25rem; }
  .wa-quick button { background: #fff; border: 1px solid #d1d7db; color: #008069; font-size: 0.78rem; font-weight: 500; padding: 0.4rem 0.7rem; border-radius: 100px; cursor: pointer; transition: all .15s; font-family: inherit; }
  .wa-quick button:hover { background: #d9fdd3; border-color: #25D366; }
  .wa-compose { background: #f0f2f5; padding: 0.5rem 0.6rem; flex-shrink: 0; display: flex; align-items: center; gap: 0.4rem; position: relative; }
  .wa-compose .wa-btn { background: none; border: none; color: #54656F; padding: 0.4rem; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .wa-compose .wa-btn:hover { background: rgba(0,0,0,0.05); }
  .wa-compose svg { width: 1.35rem; height: 1.35rem; }
  .wa-input-wrap { flex: 1; background: #fff; border-radius: 100px; padding: 0.5rem 0.85rem; min-height: 2.4rem; display: flex; align-items: center; }
  .wa-input { width: 100%; border: none; outline: none; font-size: 0.92rem; background: transparent; font-family: inherit; resize: none; max-height: 5rem; line-height: 1.4; color: #111B21; }
  .wa-send { background: #008069 !important; color: #fff !important; }
  .wa-send svg { fill: #fff; }
  .wa-send:hover { background: #006a57 !important; }
  .wa-send.disabled { background: #54656F !important; opacity: 0.5; pointer-events: none; }
  .wa-emoji-picker { position: absolute; bottom: 100%; left: 0.5rem; background: #fff; border: 1px solid var(--chrome-border); border-radius: var(--chrome-radius-md); padding: 0.65rem; box-shadow: var(--chrome-shadow-3); display: none; grid-template-columns: repeat(8, 1fr); gap: 0.2rem; max-width: 18rem; max-height: 12rem; overflow-y: auto; z-index: 10; }
  .wa-emoji-picker.open { display: grid; }
  .wa-emoji-picker button { font-size: 1.2rem; padding: 0.25rem; background: none; border: none; cursor: pointer; border-radius: var(--chrome-radius); }
  .wa-emoji-picker button:hover { background: var(--chrome-bg); }
  .wa-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }

  /* ── NOTIFY toast ── */
  .chrome-notify { position: fixed; top: calc(var(--chrome-nav-h) + 0.85rem); right: 0.85rem; z-index: 600; padding: 0.85rem 1.1rem; border-radius: var(--chrome-radius-md); font-family: 'Inter', system-ui, sans-serif; font-size: 0.88rem; font-weight: 500; max-width: 22rem; opacity: 0; transform: translateY(-0.5rem); transition: all .25s; pointer-events: none; box-shadow: var(--chrome-shadow-3); }
  .chrome-notify.show { opacity: 1; transform: translateY(0); }
  .chrome-notify.success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
  .chrome-notify.error { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }

  @media print { #siteNav, #siteDrawer, .wa-float, .wa-overlay, #siteFooter { display: none !important; } body.chrome-nav-spacer { padding-top: 0 !important; } }
  `;

  // ─────────────────────────────────────────────────────────
  // HTML
  // ─────────────────────────────────────────────────────────
  const PAGE = document.body?.dataset?.page || 'home';
  const isHome = PAGE === 'home';
  const link = (id, label, href, alt) => {
    // On home, in-page anchors are valid. On other pages, anchors must point to /#section
    const hrefFinal = href.startsWith('#') ? (isHome ? href : '/' + href) : href;
    const isActive = id === PAGE || (id === 'home' && isHome && href === '#home');
    return `<a href="${hrefFinal}" data-link="${id}" class="${isActive ? 'active' : ''}">${label}</a>`;
  };

  const NAV_HTML = `
<header id="siteNav" role="banner">
  <div class="nav-inner">
    <a href="/" class="nav-logo" aria-label="John Kihiu — Home"><span class="lg-1">John</span><span class="lg-2">Kihiu</span></a>
    <nav aria-label="Main navigation">
      <ul class="nav-links">
        <li>${link('home', 'Home', '#home')}</li>
        <li>${link('about', 'About', '#about')}</li>
        <li>${link('work', 'Work', '#work')}</li>
        <li><a href="/services/" data-link="services" class="${PAGE==='services'?'active':''}">Services</a>
  <a href="/quote/" data-link="quote" class="${PAGE==='quote'?'active':''}">Quote</a></li>
        <li><a href="/quote/" data-link="quote" class="${PAGE==='quote'?'active':''}">Quote</a></li>
        <li><a href="/integrations/" data-link="integrations" class="${PAGE==='integrations'?'active':''}">Integrations</a></li>
        <li><a href="/blog/" data-link="blog" class="${PAGE==='blog'||PAGE==='post'?'active':''}">Blog</a></li>
        <li><a href="/CV/" data-link="cv" class="${PAGE==='cv'?'active':''}">CV</a></li>
        <li>${link('contact', 'Contact', '#contact')}</li>
      </ul>
    </nav>
    <a href="${isHome ? '#contact' : '/#contact'}" class="nav-cta">Get In Touch</a>
    <button class="nav-burger" id="navBurger" aria-label="Toggle menu" aria-expanded="false" aria-controls="siteDrawer"><span></span><span></span><span></span></button>
  </div>
</header>
<div id="siteDrawer" role="navigation" aria-label="Mobile navigation">
  ${link('home', 'Home', '#home')}
  ${link('about', 'About', '#about')}
  ${link('work', 'Work', '#work')}
  <a href="/services/" data-link="services" class="${PAGE==='services'?'active':''}">Services</a>
  <a href="/integrations/" data-link="integrations" class="${PAGE==='integrations'?'active':''}">Integrations</a>
  <a href="/blog/" data-link="blog" class="${PAGE==='blog'||PAGE==='post'?'active':''}">Blog</a>
  <a href="/CV/" data-link="cv" class="${PAGE==='cv'?'active':''}">CV</a>
  ${link('contact', 'Contact', '#contact')}
</div>
`;

  const FOOTER_HTML = `
<footer id="siteFooter" role="contentinfo">
  <div class="ft-container">
    <div class="ft-top">
      <div class="ft-brand">
        <a href="/" class="ft-logo"><span class="lg-1">John</span><span class="lg-2">Kihiu</span></a>
        <p>Software engineer based in Nairobi, Kenya. Building enterprise systems, ERP customisations, web platforms, and integrations for clients across East and Southern Africa.</p>
        <div class="ft-socials">
          <a href="https://www.linkedin.com/in/john-kihiu-3481b8232/" target="_blank" rel="noopener noreferrer" class="ft-social" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="https://github.com/KihiuJohn" target="_blank" rel="noopener noreferrer" class="ft-social" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
          <a href="https://www.instagram.com/_migett/" target="_blank" rel="noopener noreferrer" class="ft-social" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="mailto:kihiujohn12@gmail.com" class="ft-social" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>
        </div>
      </div>
      <div class="ft-col">
        <h4>Sitemap</h4>
        <a href="/">Home</a><a href="/#about">About</a><a href="/#work">Work</a><a href="/services/">Services</a><a href="/quote/">Get a quote</a><a href="/integrations/">Integrations</a><a href="/blog/">Blog</a><a href="/CV/">CV</a><a href="/#contact">Contact</a>
      </div>
      <div class="ft-col">
        <h4>What I build</h4>
        <a href="/#work">Acumatica ERP customisations</a><a href="/#work">Laravel web platforms</a><a href="/integrations/">Tax fiscalisation</a><a href="/#work">REST API integrations</a><a href="/#work">Custom dashboards &amp; reports</a><a href="/#work">Process automation</a>
      </div>
      <div class="ft-col">
        <h4>Connect</h4>
        <a href="mailto:kihiujohn12@gmail.com">kihiujohn12@gmail.com</a><a href="https://wa.me/254115169705" target="_blank" rel="noopener">WhatsApp</a><a href="https://www.linkedin.com/in/john-kihiu-3481b8232/" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/KihiuJohn" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
    <div class="ft-bottom">
      <span>© 2026 John Kihiu. All rights reserved.</span>
      <span>Built with care · Nairobi, Kenya</span>
    </div>
  </div>
</footer>
`;

  const WA_FLOAT_HTML = `
<button class="wa-float" id="waFloat" aria-label="Open WhatsApp chat with John">
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.181 0 6.167 1.24 8.413 3.488a11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
</button>
`;

  const WA_MODAL_HTML = `
<div class="wa-overlay" id="waOverlay" role="dialog" aria-modal="true" aria-labelledby="waName">
  <div class="wa-window">
    <div class="wa-header">
      <button class="wa-back" id="waBack" aria-label="Close chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
      <div class="wa-avatar"><img src="/profile.jpg" alt="" aria-hidden="true" onerror="this.style.display='none'"></div>
      <div class="wa-contact">
        <div class="wa-contact-name" id="waName">John Kihiu</div>
        <div class="wa-contact-status">online</div>
      </div>
      <button class="wa-close" id="waClose" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    </div>
    <div class="wa-body" id="waBody">
      <div class="wa-day">TODAY</div>
      <div class="wa-msg in">👋 Hey, thanks for stopping by! I'm John.<time id="waT1"></time></div>
      <div class="wa-msg in">How can I help — Acumatica work, a Laravel app, an integration, or something else?<time id="waT2"></time></div>
      <div class="wa-quick" id="waQuick">
        <button data-q="Hi John, I'd like to discuss an Acumatica customisation project.">Acumatica project</button>
        <button data-q="Hi John, I'm looking for help with a Laravel app / backend.">Laravel work</button>
        <button data-q="Hi John, I need help with tax fiscalisation (KRA / RRA / ZRA / TRA / ZIMRA).">Tax fiscalisation</button>
        <button data-q="Hi John, I'd like to discuss a different project.">General enquiry</button>
      </div>
    </div>
    <div class="wa-compose">
      <div class="wa-emoji-picker" id="waEmoji">
        <button>😀</button><button>😃</button><button>😄</button><button>😁</button><button>😊</button><button>😍</button><button>🤩</button><button>😘</button>
        <button>🤔</button><button>🙂</button><button>👍</button><button>👏</button><button>🙌</button><button>🤝</button><button>💪</button><button>✌️</button>
        <button>🔥</button><button>✨</button><button>⭐</button><button>💯</button><button>✅</button><button>❤️</button><button>🚀</button><button>💼</button>
        <button>📱</button><button>💻</button><button>📊</button><button>📈</button><button>💡</button><button>🎯</button><button>📝</button><button>🙏</button>
      </div>
      <button class="wa-btn" id="waEmojiBtn" aria-label="Insert emoji"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg></button>
      <input type="text" id="waHp" class="wa-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="wa-input-wrap"><textarea class="wa-input" id="waInput" rows="1" placeholder="Type a message" aria-label="Message"></textarea></div>
      <button class="wa-btn wa-send disabled" id="waSend" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></button>
    </div>
  </div>
</div>
`;

  // ─────────────────────────────────────────────────────────
  // INJECT
  // ─────────────────────────────────────────────────────────
  function init() {
    // Inject style
    if (!document.getElementById('chromeStyle')) {
      const style = document.createElement('style');
      style.id = 'chromeStyle';
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    // Add body class for nav spacer
    document.body.classList.add('chrome-nav-spacer');

    // Inject nav at top of body
    const navWrap = document.createElement('div');
    navWrap.innerHTML = NAV_HTML;
    while (navWrap.firstChild) document.body.insertBefore(navWrap.firstChild, document.body.firstChild);

    // Inject footer + WA at end of body
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML + WA_FLOAT_HTML + WA_MODAL_HTML);

    wireNav();
    wireWA();
  }

  // ── NAV wiring ─────────────────────────────────────────
  function wireNav() {
    const nav = document.getElementById('siteNav');
    const burger = document.getElementById('navBurger');
    const drawer = document.getElementById('siteDrawer');

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    });

    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      drawer.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    }));

    // Smooth-scroll for in-page anchors when on home
    if (isHome) {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const t = document.querySelector(a.getAttribute('href'));
          if (!t) return;
          e.preventDefault();
          window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
          history.replaceState(null, '', a.getAttribute('href'));
        });
      });
    }
  }

  // ── Toast ─────────────────────────────────────────────
  window.chromeNotify = function (msg, type) {
    type = type || 'success';
    const n = document.createElement('div');
    n.className = 'chrome-notify ' + type;
    n.textContent = msg;
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add('show'));
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 4000);
  };

  // ── WA wiring ──────────────────────────────────────────
  function wireWA() {
    const PHONE = '254115169705';
    const overlay = document.getElementById('waOverlay');
    const float = document.getElementById('waFloat');
    const back = document.getElementById('waBack');
    const close = document.getElementById('waClose');
    const body = document.getElementById('waBody');
    const input = document.getElementById('waInput');
    const send = document.getElementById('waSend');
    const emojiBtn = document.getElementById('waEmojiBtn');
    const emojiPicker = document.getElementById('waEmoji');
    const quick = document.getElementById('waQuick');
    const hp = document.getElementById('waHp');

    function timeNow() { return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }

    window.openWA = function () {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('waT1').textContent = timeNow();
      document.getElementById('waT2').textContent = timeNow();
      setTimeout(() => input.focus(), 350);
    };
    window.closeWA = function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      emojiPicker.classList.remove('open');
    };

    float.addEventListener('click', window.openWA);
    back.addEventListener('click', window.closeWA);
    close.addEventListener('click', window.closeWA);
    overlay.addEventListener('click', e => { if (e.target === overlay) window.closeWA(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) window.closeWA(); });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 80) + 'px';
      send.classList.toggle('disabled', input.value.trim().length === 0);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
    });
    send.addEventListener('click', doSend);

    quick.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        input.value = b.dataset.q;
        input.dispatchEvent(new Event('input'));
        input.focus();
        quick.style.display = 'none';
      });
    });

    emojiBtn.addEventListener('click', () => emojiPicker.classList.toggle('open'));
    emojiPicker.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        const emo = b.textContent;
        const start = input.selectionStart, end = input.selectionEnd;
        input.value = input.value.slice(0, start) + emo + input.value.slice(end);
        input.dispatchEvent(new Event('input'));
        input.focus();
        input.setSelectionRange(start + emo.length, start + emo.length);
      });
    });
    document.addEventListener('click', e => {
      if (!emojiPicker.contains(e.target) && e.target !== emojiBtn && !emojiBtn.contains(e.target)) {
        emojiPicker.classList.remove('open');
      }
    });

    function appendMsg(text, kind) {
      const div = document.createElement('div');
      div.className = 'wa-msg ' + kind;
      div.appendChild(document.createTextNode(text));
      const t = document.createElement('time'); t.textContent = timeNow();
      div.appendChild(t);
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function doSend() {
      const text = input.value.trim();
      if (!text) return;
      if (hp.value.trim() !== '') return; // honeypot
      if (text.length > 1500) { window.chromeNotify('Message too long — please shorten.', 'error'); return; }
      appendMsg(text, 'out');
      input.value = ''; input.style.height = 'auto'; send.classList.add('disabled');
      quick.style.display = 'none';
      const encoded = encodeURIComponent(text);
      setTimeout(() => appendMsg('Sent ✓ Opening WhatsApp now…', 'in'), 600);
      setTimeout(() => {
        // Use a real anchor click instead of window.open — avoids Cross-Origin-Opener-Policy
        // refusals some browsers throw when navigating to wa.me from a JS-opened popup.
        const a = document.createElement('a');
        a.href = `https://wa.me/${PHONE}?text=${encoded}`;
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, 1200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
