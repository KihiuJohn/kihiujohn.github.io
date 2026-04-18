const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_ROOT = path.join(ROOT, 'integrations');

const integrations = [
  {
    slug: 'kra-etims-vscu',
    flag: '🇰🇪',
    country: 'Kenya',
    title: 'KRA eTIMS VSCU Integration for Acumatica',
    shortTitle: 'KRA eTIMS VSCU',
    category: 'Tax Fiscalization',
    categoryColor: '#d1fae5',
    description: 'Virtual Sales Control Unit integration connecting Acumatica ERP to the Kenya Revenue Authority eTIMS platform for real-time e-invoicing compliance.',
    overview: `The Kenya Revenue Authority's eTIMS (electronic Tax Invoice Management System) replaced the legacy ETR/TIMS regime with a fully digital, software-driven Virtual Sales Control Unit (VSCU). This integration plugs directly into Acumatica AR Invoices, Credit Memos, and Cash Sales so every document is signed, numbered, and transmitted to KRA before the sales clerk hits print.`,
    features: [
      'Real-time invoice transmission to KRA eTIMS (sandbox + production)',
      'CU-invoice number & QR code stamped back onto the Acumatica document',
      'Credit & debit notes linked to the original CU-invoice number',
      'Automatic retry + offline queue for network interruptions',
      'Per-branch device tagging and multi-branch configuration',
      'Export of B2B, B2C, export, and exempt-rated sales',
      'Cancellation &amp; void handling in line with KRA rules',
      'HSCode validation and stock movement logging',
    ],
    architecture: [
      { step: '1. Trigger', detail: 'Acumatica Business Event fires on AR Invoice / Credit Memo release.' },
      { step: '2. Transform', detail: 'Custom graph projects Acumatica fields into KRA eTIMS payload (seller TIN, buyer TIN, line items, HSCode, VAT).' },
      { step: '3. Sign', detail: 'Payload is signed using the branch VSCU certificate &amp; transmitted to the eTIMS API.' },
      { step: '4. Persist', detail: 'CU-invoice number &amp; QR code written back to custom DAC fields; audit row inserted.' },
      { step: '5. Print', detail: 'Acumatica Report Designer prints the KRA-compliant invoice with QR stamp.' },
    ],
    bestFor: [
      'Retailers, distributors, manufacturers operating in Kenya',
      'Businesses already on Acumatica wanting KRA compliance without swapping POS',
      'Multi-branch operations needing one fiscalization layer across sites',
    ],
  },
  {
    slug: 'rra-vsdc',
    flag: '🇷🇼',
    country: 'Rwanda',
    title: 'RRA VSDC Integration for Acumatica',
    shortTitle: 'RRA VSDC',
    category: 'Tax Fiscalization',
    categoryColor: '#d1fae5',
    description: 'Virtual Sales Data Controller integration connecting Acumatica to the Rwanda Revenue Authority EBM v2 e-invoicing platform.',
    overview: `Rwanda's Electronic Billing Machine v2 (EBM v2) runs on the Virtual Sales Data Controller (VSDC) model — every invoice, credit note and stock movement is signed and posted to RRA before it leaves the system. This integration wires Acumatica directly into the VSDC, handling sales, purchases, stock adjustments, and imports in a single plug-in.`,
    features: [
      'EBM v2 / VSDC compatible with full RRA certification flow',
      'Sales, purchases, credit notes, debit notes, and stock reconciliation',
      'Offline-capable queue with automatic replay when connectivity returns',
      'CIS-code and HSCode lookups from Acumatica item master',
      'Branch-level VSDC keys and per-user device registration',
      'Fiscal receipt PDF with signature & verification URL',
      'Exemption, zero-rate, and foreign-currency handling',
      'End-of-day Z-report generation',
    ],
    architecture: [
      { step: '1. Event', detail: 'Acumatica release action on SO Invoice / AR Invoice triggers the VSDC process.' },
      { step: '2. Map', detail: 'Document is mapped to RRA VSDC envelope (items, taxes, buyer, itemCls).' },
      { step: '3. Sign + Send', detail: 'Envelope is signed with the VSDC key and posted to the RRA endpoint.' },
      { step: '4. Receipt', detail: 'Receipt number, internal data, signature &amp; MRC code are written back.' },
      { step: '5. Stock', detail: 'Matching stock movement is automatically dispatched to RRA.' },
    ],
    bestFor: [
      'Distributors and wholesalers billing in Rwanda',
      'Importers needing combined sales + stock transmission',
      'Companies operating in multiple EAC countries who need VSDC alongside other fiscalization',
    ],
  },
  {
    slug: 'zra-smart-invoice',
    flag: '🇿🇲',
    country: 'Zambia',
    title: 'ZRA Smart Invoice Integration for Acumatica',
    shortTitle: 'ZRA Smart Invoice',
    category: 'Tax Fiscalization',
    categoryColor: '#d1fae5',
    description: 'Smart Invoice System integration wiring Acumatica ERP to the Zambia Revenue Authority e-invoicing backbone with QR-coded compliant receipts.',
    overview: `ZRA's Smart Invoice System (SIS) is the mandatory e-invoicing platform for VAT-registered businesses in Zambia. This integration handles the full lifecycle — sales, purchase, stock, and inventory reporting — directly from Acumatica, so tax compliance is a by-product of normal business operations rather than an extra job.`,
    features: [
      'Sales invoices, credit notes, debit notes, refunds',
      'Purchase invoices &amp; import declarations',
      'Stock master &amp; stock movement submissions',
      'QR-coded printable invoices',
      'Item classification with ZRA codes',
      'Multi-branch &amp; multi-TPIN support',
      'Batch catch-up submissions for missed documents',
      'Automated reconciliation with ZRA portal reports',
    ],
    architecture: [
      { step: '1. Release', detail: 'Acumatica document release triggers a queued SIS message.' },
      { step: '2. Validate', detail: 'Integration validates item codes, TPINs, and VAT rates before transmission.' },
      { step: '3. Submit', detail: 'Signed payload is posted to the ZRA Smart Invoice API.' },
      { step: '4. Confirm', detail: 'ZRA response (INVCNUM, QR data) is persisted on the Acumatica record.' },
      { step: '5. Print', detail: 'Custom report prints the compliant invoice with QR + verification URL.' },
    ],
    bestFor: [
      'VAT-registered companies in Zambia using Acumatica',
      'Import/distribution businesses needing combined sales + inventory reporting',
      'Groups needing centralized reporting across multiple TPINs',
    ],
  },
  {
    slug: 'tra-vfd',
    flag: '🇹🇿',
    country: 'Tanzania',
    title: 'TRA VFD Integration for Acumatica',
    shortTitle: 'TRA VFD',
    category: 'Tax Fiscalization',
    categoryColor: '#d1fae5',
    description: 'Virtual Fiscal Device integration between Acumatica and the Tanzania Revenue Authority fiscal infrastructure for compliant EFD receipt generation.',
    overview: `Tanzania's Electronic Fiscal Device (EFD) regime now supports a Virtual Fiscal Device (VFD) mode — a software EFD that turns any compliant POS/ERP into a fiscal device. This integration implements the VFD protocol from within Acumatica so every SO Invoice and Cash Sale produces an EFD number, Z-number, and verification code printed directly on the invoice.`,
    features: [
      'VFD registration &amp; provisioning with TRA',
      'EFD number &amp; Z-number generation per invoice',
      'TIN &amp; VRN validation against TRA master',
      'Daily Z-report (X-report, Z-report) automation',
      'Invoice cancellation &amp; credit-note flow',
      'Multi-branch device registration',
      'Swahili/English receipt layout',
      'Verification URL + QR on every printed invoice',
    ],
    architecture: [
      { step: '1. Provision', detail: 'VFD serial &amp; registration number are stored securely in Acumatica.' },
      { step: '2. Invoice', detail: 'On AR/SO invoice release, integration builds the EFD payload.' },
      { step: '3. Fiscalize', detail: 'Payload is fiscalized through the VFD, returning the EFD + Z number.' },
      { step: '4. Persist', detail: 'Numbers are written back; daily counters are incremented.' },
      { step: '5. Z-Report', detail: 'Scheduled daily Z-report is pushed to TRA automatically.' },
    ],
    bestFor: [
      'Retailers, restaurants, hotels, and distributors in Tanzania',
      'Multi-location businesses that want one fiscalization layer',
      'Operations wanting to retire hardware EFDs in favour of software VFDs',
    ],
  },
  {
    slug: 'sms-notifications',
    flag: '📱',
    country: 'Any market',
    title: 'SMS Notification Engine for Acumatica',
    shortTitle: 'SMS Notification Engine',
    category: 'Customer Comms',
    categoryColor: '#fef3c7',
    description: 'Template-driven SMS dispatch triggered on Acumatica Invoice, Credit Note, Debit Note, and Payment document release with delivery tracking.',
    overview: `Customers expect an SMS the moment you raise an invoice or receive a payment. This integration uses Acumatica Business Events + a custom provider abstraction to send templated SMS to customer contacts on any financial document event — without forcing your staff to leave the ERP. It supports multiple SMS gateways with automatic failover.`,
    features: [
      'Trigger SMS on Invoice, Credit Note, Debit Note &amp; Payment release',
      'Template engine with merge-fields (customer, amount, balance, ref number)',
      "Multi-provider support (Africa's Talking, Twilio, local aggregators)",
      'Provider failover &amp; retry queue',
      'Delivery reports persisted against the source document',
      'Opt-in / opt-out management per customer contact',
      'SMS dashboard with send volume, delivery rate, cost',
      'Bulk campaign mode for statements &amp; promotions',
    ],
    architecture: [
      { step: '1. Event', detail: 'Acumatica Business Event fires on the target document release.' },
      { step: '2. Match', detail: 'Customer contacts are resolved and filtered for SMS opt-in status.' },
      { step: '3. Render', detail: 'Template is rendered with merge-fields from the source document.' },
      { step: '4. Send', detail: 'Message is dispatched via the active SMS provider (with failover).' },
      { step: '5. Report', detail: 'Delivery status is polled &amp; logged against the Acumatica document.' },
    ],
    bestFor: [
      'Finance &amp; billing teams wanting automated customer communication',
      'Companies with high invoice volume needing reliable notifications',
      'Businesses tracking delivery rates &amp; SMS cost per customer',
    ],
  },
  {
    slug: 'weighbridge-capture',
    flag: '⚖️',
    country: 'Any market',
    title: 'Weighbridge Capture Integration for Acumatica',
    shortTitle: 'Weighbridge Capture',
    category: 'Operations',
    categoryColor: '#e0e7ff',
    description: 'Direct weighbridge serial-port / TCP capture integration that streams gross, tare and net weights into Acumatica purchase receipts and stock movements.',
    overview: `Paper weight tickets and manual data entry are the #1 source of inventory variance for bulk-goods businesses. This integration connects weighbridge indicators (Mettler Toledo, Avery, Rice Lake, generic RS232/TCP) directly to Acumatica, so the weight on the scale is the weight on the purchase receipt — full stop. The operator confirms; Acumatica posts.`,
    features: [
      'Serial (RS232/485) &amp; TCP weighbridge support',
      'Gross / tare / net capture in a single operator screen',
      'Auto-creation of Acumatica Purchase Receipts &amp; Inventory Receipts',
      'Vehicle registration, driver &amp; supplier lookup',
      'Two-pass (inbound / outbound) weighing workflow',
      'Weight ticket PDF with photo &amp; signature capture',
      'GL posting &amp; costing using Acumatica standard flow',
      'Audit trail of raw indicator stream for compliance',
    ],
    architecture: [
      { step: '1. Connect', detail: 'Local agent reads the weighbridge indicator over serial or TCP.' },
      { step: '2. Capture', detail: 'Operator confirms gross/tare; net is computed and validated.' },
      { step: '3. Post', detail: 'A Purchase Receipt (or Inventory Transaction) is created in Acumatica.' },
      { step: '4. Attach', detail: 'Weight ticket PDF, signatures, and photos are attached to the receipt.' },
      { step: '5. Ship/Invoice', detail: 'Downstream Acumatica processes pick up the receipt unchanged.' },
    ],
    bestFor: [
      'Agribusiness, feed mills, cement, scrap metal, aggregates, FMCG',
      'Companies automating purchase receipts from bulk deliveries',
      'Multi-site operations needing centralized weight capture data',
    ],
  },
];

function buildListingHtml() {
  const cards = integrations.map(i => `            <a href="/integrations/${i.slug}/" class="integration-card">
                <span class="flag" aria-hidden="true">${i.flag}</span>
                <h3 class="font-bold text-lg mb-1">${i.shortTitle}</h3>
                <p class="text-sm text-gray-600 mb-2">${i.description}</p>
                <span class="integration-badge" style="background:${i.categoryColor}">${i.category}</span>
                <div class="read-more">Learn more →</div>
            </a>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Enterprise Integrations | John Kihiu - Acumatica ERP Developer</title>
<meta name="description" content="Production-grade Acumatica integrations: KRA eTIMS, RRA VSDC, ZRA Smart Invoice, TRA VFD, SMS, and Weighbridge capture.">
<meta name="keywords" content="Acumatica Integration, KRA eTIMS, RRA VSDC, ZRA Smart Invoice, TRA VFD, SMS Integration, Weighbridge">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://kihiujohn.github.io/integrations/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://kihiujohn.github.io/integrations/">
<meta property="og:title" content="Enterprise Integrations | John Kihiu">
<meta property="og:description" content="KRA, RRA, ZRA, TRA tax fiscalization, SMS notifications, and weighbridge capture for Acumatica.">
<link rel="icon" type="image/x-icon" href="/static/favicon.ico">
<script src="https://cdn.tailwindcss.com"></script>
<style>
  body { font-family: 'Courier New', monospace; }
  .neobrutalist { border: 3px solid #000; box-shadow: 8px 8px 0 #000; background: #fff; }
  .neobrutalist-btn { border: 3px solid #000; box-shadow: 4px 4px 0 #000; transition: all 0.2s; background: #fff; }
  .neobrutalist-btn:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #000; }
  .text-secondary { color: #4ade80; }
  .bg-secondary { background-color: #4ade80; }
  .hover\\:bg-secondary:hover { background-color: #4ade80; }
  .hover\\:text-secondary:hover { color: #4ade80; }
  .mobile-menu { display: none; position: fixed; top: 80px; right: 20px; background: white; border: 3px solid black; box-shadow: 8px 8px 0 #000; z-index: 20; }
  .mobile-menu.active { display: block; }
  .integration-card { border: 3px solid #000; box-shadow: 6px 6px 0 #000; background: #fff; padding: 22px; transition: all .2s; display: block; text-decoration: none; color: inherit; }
  .integration-card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 #000; }
  .integration-card .flag { display: inline-block; font-size: 2.2rem; margin-bottom: 10px; }
  .integration-card h3 { transition: color .15s; }
  .integration-card:hover h3 { color: #16a34a; }
  .integration-card .read-more { font-size: .82rem; font-weight: bold; color: #16a34a; margin-top: 10px; display: inline-block; }
  .integration-card:hover .read-more { text-decoration: underline; }
  .integration-badge { display: inline-block; padding: 3px 8px; border: 2px solid #000; font-size: .68rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
</style>
</head>
<body class="bg-white text-black">
<nav class="bg-white border-b-4 border-black fixed w-full z-10" role="navigation" aria-label="Main navigation">
  <div class="container mx-auto px-6 py-3">
    <div class="flex items-center justify-between">
      <a href="/" class="text-2xl font-bold text-black hover:text-secondary transition">John<span class="text-secondary">Kihiu</span></a>
      <div class="hidden md:flex space-x-8">
        <a href="/#home" class="hover:text-secondary transition">Home</a>
        <a href="/#about" class="hover:text-secondary transition">About</a>
        <a href="/#skills" class="hover:text-secondary transition">Skills</a>
        <a href="/integrations/" class="text-secondary font-bold">Integrations</a>
        <a href="/blog/" class="hover:text-secondary transition">Blog</a>
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
          <a href="/integrations/" class="text-secondary font-bold">Integrations</a>
          <a href="/blog/" class="hover:text-secondary transition">Blog</a>
          <a href="/#contact" class="hover:text-secondary transition">Contact</a>
        </div>
      </div>
    </div>
  </div>
</nav>
<div class="container mx-auto px-6 pt-28 pb-12">
  <header class="text-center mb-12">
    <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-black rounded-full mb-4" style="box-shadow: 4px 4px 0 #000">
      <span class="w-2 h-2 bg-secondary rounded-full"></span>
      <span class="text-xs font-bold uppercase tracking-widest">Production-Grade Integrations</span>
    </div>
    <h1 class="text-4xl md:text-5xl font-bold mb-4">Enterprise <span class="text-secondary">Integrations</span></h1>
    <p class="text-gray-700 max-w-3xl mx-auto">Battle-tested Acumatica integrations deployed across East &amp; Southern Africa. Click any card to dive into architecture, features, and deployment notes.</p>
  </header>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${cards}
  </div>
  <div class="text-center mt-12">
    <p class="text-sm text-gray-600 mb-4">Need a custom integration or discovery call?</p>
    <a href="/#contact" class="neobrutalist-btn bg-secondary hover:bg-green-500 text-black font-bold py-3 px-6 inline-block">Get In Touch</a>
  </div>
</div>
<footer class="bg-white border-t-4 border-black py-8 mt-12">
  <div class="container mx-auto px-6 text-center">
    <p>&copy; 2024 John Kihiu. All rights reserved.</p>
  </div>
</footer>
${inspectScript()}
${navScript()}
</body>
</html>
`;
}

function inspectScript() {
  return `<script>
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && ['u','U','s','S','i','I'].includes(e.key)) e.preventDefault();
    if (e.key === 'F12') e.preventDefault();
    if (e.ctrlKey && e.shiftKey && ['i','I','j','J','c','C'].includes(e.key)) e.preventDefault();
  });
</script>`;
}

function navScript() {
  return `<script>
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    document.addEventListener('click', (e) => {
      if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) mobileMenu.classList.remove('active');
    });
  }
</script>`;
}

function buildDetailHtml(i) {
  const features = i.features.map(f => `      <li>${f}</li>`).join('\n');
  const arch = i.architecture.map(a => `      <div class="arch-step"><div class="arch-step-title">${a.step}</div><div class="arch-step-detail">${a.detail}</div></div>`).join('\n');
  const bestFor = i.bestFor.map(b => `      <li>${b}</li>`).join('\n');
  const relatedCards = integrations.filter(x => x.slug !== i.slug).slice(0, 3).map(x => `      <a href="/integrations/${x.slug}/" class="related-card">
        <span style="font-size:1.6rem">${x.flag}</span>
        <div>
          <div class="related-title">${x.shortTitle}</div>
          <div class="related-country">${x.country}</div>
        </div>
      </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${i.title} | John Kihiu</title>
<meta name="description" content="${i.description}">
<meta name="keywords" content="${i.shortTitle}, Acumatica ${i.category}, ${i.country} ERP Integration">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://kihiujohn.github.io/integrations/${i.slug}/">
<meta property="og:type" content="article">
<meta property="og:url" content="https://kihiujohn.github.io/integrations/${i.slug}/">
<meta property="og:title" content="${i.title}">
<meta property="og:description" content="${i.description}">
<link rel="icon" type="image/x-icon" href="/static/favicon.ico">
<script src="https://cdn.tailwindcss.com"></script>
<style>
  body { font-family: 'Courier New', monospace; background: #fff; color: #000; }
  .neobrutalist { border: 3px solid #000; box-shadow: 8px 8px 0 #000; background: #fff; }
  .neobrutalist-btn { border: 3px solid #000; box-shadow: 4px 4px 0 #000; transition: all 0.2s; background: #fff; }
  .neobrutalist-btn:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #000; }
  .text-secondary { color: #4ade80; }
  .bg-secondary { background-color: #4ade80; }
  .hover\\:bg-secondary:hover { background-color: #4ade80; }
  .hover\\:text-secondary:hover { color: #4ade80; }
  .mobile-menu { display: none; position: fixed; top: 80px; right: 20px; background: white; border: 3px solid black; box-shadow: 8px 8px 0 #000; z-index: 20; }
  .mobile-menu.active { display: block; }

  .hero-wrap { background: linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%); border-bottom: 4px solid #000; padding: 60px 20px 50px; }
  .hero-flag { font-size: 4rem; margin-bottom: 10px; line-height: 1; }
  .hero-badge { display: inline-block; background: #000; color: #4ade80; padding: 4px 14px; font-size: .7rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
  .hero-title { font-size: 2.2rem; font-weight: bold; max-width: 820px; margin: 0 auto 16px; line-height: 1.2; }
  @media (min-width: 768px) { .hero-title { font-size: 3rem; } }
  .hero-sub { max-width: 700px; margin: 0 auto; color: #374151; }

  .content-wrap { max-width: 880px; margin: 0 auto; padding: 48px 20px; }
  .content-card { border: 4px solid #000; box-shadow: 8px 8px 0 #000; background: #fff; padding: 32px; margin-bottom: 32px; }
  .content-card h2 { font-size: 1.6rem; font-weight: bold; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .content-card h2::before { content: ''; display: inline-block; width: 6px; height: 24px; background: #4ade80; border: 2px solid #000; }
  .content-card p { line-height: 1.75; margin-bottom: 12px; color: #1f2937; }
  .feature-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 640px) { .feature-list { grid-template-columns: 1fr 1fr; } }
  .feature-list li { padding: 10px 12px 10px 34px; background: #f0fdf4; border: 2px solid #000; position: relative; font-size: .92rem; }
  .feature-list li::before { content: "✓"; position: absolute; left: 12px; color: #16a34a; font-weight: bold; font-size: 1.1rem; }
  .best-for-list { list-style: none; padding: 0; margin: 0; }
  .best-for-list li { padding: 8px 0 8px 26px; position: relative; }
  .best-for-list li::before { content: "→"; position: absolute; left: 0; color: #4ade80; font-weight: bold; }

  .arch-step { border: 3px solid #000; padding: 16px 18px; margin-bottom: 12px; background: #fff; box-shadow: 4px 4px 0 #000; }
  .arch-step-title { font-weight: bold; font-size: .95rem; color: #16a34a; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
  .arch-step-detail { font-size: .92rem; color: #1f2937; line-height: 1.6; }

  .cta-card { background: #000; color: #fff; border: 4px solid #000; padding: 32px; text-align: center; box-shadow: 8px 8px 0 #4ade80; }
  .cta-card h3 { font-size: 1.6rem; font-weight: bold; margin-bottom: 10px; }
  .cta-card p { color: #d1d5db; margin-bottom: 20px; }
  .cta-grid { display: grid; grid-template-columns: 1fr; gap: 12px; max-width: 520px; margin: 0 auto; }
  @media (min-width: 640px) { .cta-grid { grid-template-columns: 1fr 1fr; } }
  .cta-link { display: flex; align-items: center; justify-content: center; gap: 8px; background: #fff; color: #000; padding: 14px; border: 3px solid #fff; font-weight: bold; text-decoration: none; transition: all .15s; font-size: .92rem; }
  .cta-link:hover { background: #4ade80; border-color: #4ade80; }
  .cta-link.primary { background: #4ade80; }
  .cta-link.primary:hover { background: #fff; }

  .related-card { display: flex; align-items: center; gap: 14px; padding: 14px; border: 3px solid #000; background: #fff; text-decoration: none; color: #000; box-shadow: 4px 4px 0 #000; transition: all .15s; }
  .related-card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #000; }
  .related-title { font-weight: bold; font-size: .95rem; }
  .related-country { font-size: .75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }

  footer.site { border-top: 4px solid #000; background: #fff; padding: 32px 20px; text-align: center; margin-top: 24px; }
</style>
</head>
<body>
<nav class="bg-white border-b-4 border-black fixed w-full z-10" role="navigation" aria-label="Main navigation">
  <div class="container mx-auto px-6 py-3">
    <div class="flex items-center justify-between">
      <a href="/" class="text-2xl font-bold text-black hover:text-secondary transition">John<span class="text-secondary">Kihiu</span></a>
      <div class="hidden md:flex space-x-8">
        <a href="/#home" class="hover:text-secondary transition">Home</a>
        <a href="/#about" class="hover:text-secondary transition">About</a>
        <a href="/#skills" class="hover:text-secondary transition">Skills</a>
        <a href="/integrations/" class="text-secondary font-bold">Integrations</a>
        <a href="/blog/" class="hover:text-secondary transition">Blog</a>
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
          <a href="/integrations/" class="text-secondary font-bold">Integrations</a>
          <a href="/blog/" class="hover:text-secondary transition">Blog</a>
          <a href="/#contact" class="hover:text-secondary transition">Contact</a>
        </div>
      </div>
    </div>
  </div>
</nav>
<div style="height:72px"></div>

<section class="hero-wrap text-center">
  <div class="hero-flag" aria-hidden="true">${i.flag}</div>
  <div class="hero-badge">${i.category}</div>
  <h1 class="hero-title">${i.title}</h1>
  <p class="hero-sub">${i.description}</p>
</section>

<div class="content-wrap">
  <div class="content-card">
    <h2>Overview</h2>
    <p>${i.overview}</p>
  </div>

  <div class="content-card">
    <h2>Core Features</h2>
    <ul class="feature-list">
${features}
    </ul>
  </div>

  <div class="content-card">
    <h2>How It Works</h2>
${arch}
  </div>

  <div class="content-card">
    <h2>Best Fit</h2>
    <ul class="best-for-list">
${bestFor}
    </ul>
  </div>

  <div class="cta-card">
    <h3>Ready to deploy ${i.shortTitle} on Acumatica?</h3>
    <p>Every engagement starts with a free discovery call to scope your requirements. Reach out via any channel below and I'll get back within one business day.</p>
    <div class="cta-grid">
      <a href="mailto:kihiujohn12@gmail.com?subject=${encodeURIComponent(i.shortTitle + ' Integration Inquiry')}" class="cta-link primary">📧 Email John</a>
      <a href="https://wa.me/254115169705?text=${encodeURIComponent("Hi John, I'm interested in the " + i.shortTitle + " integration for Acumatica.")}" target="_blank" rel="noopener" class="cta-link">💬 WhatsApp</a>
      <a href="https://www.linkedin.com/in/john-kihiu-3481b8232/" target="_blank" rel="noopener" class="cta-link">🔗 LinkedIn</a>
      <a href="/#contact" class="cta-link">📝 Contact form</a>
    </div>
  </div>

  <div class="content-card">
    <h2>Other Integrations</h2>
    <div style="display:grid;grid-template-columns:1fr;gap:12px">
${relatedCards}
    </div>
  </div>
</div>

<footer class="site">
  <div class="text-2xl font-bold mb-2">John<span class="text-secondary">Kihiu</span></div>
  <p class="text-sm" style="color:#6b7280">&copy; 2024 John Kihiu. All rights reserved.</p>
</footer>
${inspectScript()}
${navScript()}
</body>
</html>
`;
}

// Generate listing
if (!fs.existsSync(OUT_ROOT)) fs.mkdirSync(OUT_ROOT, { recursive: true });
fs.writeFileSync(path.join(OUT_ROOT, 'index.html'), buildListingHtml());

// Generate detail pages
for (const i of integrations) {
  const dir = path.join(OUT_ROOT, i.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildDetailHtml(i));
}

console.log(`Built integrations listing + ${integrations.length} detail pages in /integrations/`);
