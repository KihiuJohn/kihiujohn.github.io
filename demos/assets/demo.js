(function () {
  'use strict';

  var cfg = window.ERP_DEMOS[document.body.dataset.country];
  if (!cfg) return;

  var root = document.documentElement;
  root.style.setProperty('--accent', cfg.accent);
  root.style.setProperty('--accent-dark', cfg.accentDark);
  root.style.setProperty('--accent-soft', cfg.accentSoft);
  root.style.setProperty('--accent-line', cfg.accentLine);

  document.title = cfg.country + ' ' + cfg.authority + ' ' + cfg.system + ' demo — Acumatica-style invoice walkthrough | John Kihiu';

  var state = {
    lines: cfg.lines.map(function (l) { return Object.assign({}, l); }),
    validated: false,
    running: false,
    tourStep: 0,
    logTab: 'trace'
  };

  var ICONS = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 2h9l4 4v16l-3-2-2 2-2-2-2 2-2-2-2 2V2z"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2 3h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4z"/><path d="M20 4h-3a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h3V4z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.87a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 1-1 1.7v.4"/><circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z"/><path d="M8.5 12l2.5 2.5L16 9.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4h6v6"/><path d="M20 4L10 14"/><path d="M18 14v6H4V6h6"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>'
  };

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var CUR_NAMES = { KES: 'Kenyan shillings', RWF: 'Rwandan francs', ZMW: 'Zambian kwacha', TZS: 'Tanzanian shillings', USD: 'United States dollars' };

  function money(n, withCode) {
    var s = new Intl.NumberFormat(cfg.invoice.locale, {
      minimumFractionDigits: cfg.invoice.decimals,
      maximumFractionDigits: cfg.invoice.decimals
    }).format(n);
    return withCode === false ? s : cfg.invoice.currency + ' ' + s;
  }

  function num(n, d) {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }).format(n);
  }

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  function compute() {
    var subtotal = 0, discount = 0, taxTotal = 0, groups = {};
    state.lines.forEach(function (l) {
      var gross = l.qty * l.price;
      var net = gross * (1 - l.disc / 100);
      var tax = net * l.rate / 100;
      l.net = round2(net); l.taxAmt = round2(tax); l.gross = round2(gross);
      subtotal += gross; discount += gross - net; taxTotal += tax;
      var key = l.tax;
      if (!groups[key]) groups[key] = { label: l.tax, rate: l.rate, net: 0, tax: 0 };
      groups[key].net += net; groups[key].tax += tax;
    });
    var netSubtotal = subtotal - discount;
    var total = netSubtotal + taxTotal;
    return { subtotal: round2(subtotal), netSubtotal: round2(netSubtotal), discount: round2(discount), taxTotal: round2(taxTotal), total: round2(total), groups: groups };
  }

  function itemsWord(n) {
    var a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    function under1000(x) {
      var out = '';
      if (x >= 100) { out += a[Math.floor(x / 100)] + ' hundred'; x %= 100; if (x) out += ' and '; }
      if (x >= 20) { out += b[Math.floor(x / 10)]; x %= 10; if (x) out += '-' + a[x]; }
      else if (x) out += a[x];
      return out;
    }
    if (n === 0) return 'zero';
    var groups = [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
    var out = [];
    groups.forEach(function (g) {
      var v = Math.floor(n / g[0]);
      if (v) { out.push(under1000(v) + ' ' + g[1]); n %= g[0]; }
    });
    if (n) out.push(under1000(n));
    return out.join(' ');
  }

  function roundMoney(n) {
    var f = Math.pow(10, cfg.invoice.decimals);
    return Math.round(n * f) / f;
  }

  function amountInWords(total) {
    total = roundMoney(total);
    var whole = Math.floor(total);
    var cents = Math.round((total - whole) * 100);
    var name = CUR_NAMES[cfg.invoice.currency] || cfg.invoice.currency;
    var s = itemsWord(whole) + ' ' + name;
    if (cents) s += ' and ' + itemsWord(cents) + ' cents';
    return s.charAt(0).toUpperCase() + s.slice(1) + ' only';
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function qrSvg(seed) {
    var n = 29, cell = 4, quiet = 2, total = (n + quiet * 2) * cell;
    var rand = mulberry32(seed || 12345);
    var grid = [], reserved = [];
    var r, c;
    for (r = 0; r < n; r++) { grid.push(new Array(n).fill(0)); reserved.push(new Array(n).fill(0)); }
    function finder(ox, oy) {
      for (var y = -1; y < 8; y++) for (var x = -1; x < 8; x++) {
        var gx = ox + x, gy = oy + y;
        if (gx < 0 || gy < 0 || gx >= n || gy >= n) continue;
        reserved[gy][gx] = 1;
        var on = (x >= 0 && x < 7 && y >= 0 && y < 7) && (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
        grid[gy][gx] = on ? 1 : 0;
      }
    }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    for (var i = 8; i < n - 8; i++) {
      if (i % 2 === 0) { grid[6][i] = 1; grid[i][6] = 1; }
      reserved[6][i] = 1; reserved[i][6] = 1;
    }
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) {
      if (reserved[r][c]) continue;
      grid[r][c] = rand() > 0.52 ? 1 : 0;
    }
    var d = '';
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) {
      if (!grid[r][c]) continue;
      var x = (c + quiet) * cell, y = (r + quiet) * cell;
      d += 'M' + x + ' ' + y + 'h' + cell + 'v' + cell + 'h-' + cell + 'z';
    }
    return '<svg viewBox="0 0 ' + total + ' ' + total + '" role="img" aria-label="Decorative demo QR code" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="' + total + '" height="' + total + '" fill="#fff"/><path d="' + d + '" fill="#111827"/></svg>';
  }

  function flagImg(id, cls) {
    return '<img class="flag-img ' + (cls || '') + '" src="/demos/assets/flags/' + id + '.svg" alt="" width="24" height="16" loading="lazy">';
  }

  function brandInitials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
  }

  function customFieldHTML(f) {
    if (f.id === 'fiscalInvoice' && state.validated) {
      return '<div class="ff wide"><dt>' + esc(f.label) + '</dt><dd class="mono">' + esc(cfg.validation.receipt.number) + '</dd></div>';
    }
    return '<div class="ff' + (f.wide ? ' wide' : '') + '"><dt>' + esc(f.label) + '</dt><dd' + (f.id ? ' id="' + esc(f.id) + '"' : '') + ' class="' + (f.mono ? 'mono ' : '') + '">' + esc(f.value) + '</dd></div>';
  }

  function renderCustomCard(title, sub) {
    return '<section class="card" id="fiscal-details"><div class="card-head"><h2>' + esc(title) + '</h2><span class="sub">' + esc(sub) + '</span></div><div class="card-body"><div class="fiscal-fields">' +
      cfg.custom.map(customFieldHTML).join('') + '</div></div></section>';
  }

  function render() {
    var c = compute();
    var placement = cfg.customPlacement;
    var layoutClass = cfg.layout === 'wide' ? 'wide' : cfg.layout === 'compact' ? 'compact' : '';
    var statusPill = state.validated
      ? '<span class="status-pill ok">Validated</span>'
      : '<span class="status-pill pending">Not validated</span>';

    var headerCustom = placement === 'header'
      ? '<div class="fiscal-strip" id="fiscal-details"><div class="fiscal-strip-head"><div class="fiscal-mark">' + esc(cfg.authority) + '</div><div><h2>' + esc(cfg.system) + ' fiscal details</h2><p>Fields written to the ' + esc(cfg.authorityLong) + ' payload</p></div><div class="spacer">' + statusPill + '</div></div><div class="card-body"><div class="fiscal-fields">' +
        cfg.custom.map(customFieldHTML).join('') + '</div></div></div>'
      : '';

    var sectionCustom = placement === 'section' ? renderCustomCard(cfg.style || (cfg.country + ' fiscal details'), cfg.system + ' fields carried on the invoice') : '';
    var sideCustom = placement === 'side' ? renderCustomCard(cfg.country + ' fiscal details', cfg.system + ' fields carried on the invoice') : '';

    var headerFields = [
      ['Customer', cfg.customer.name, 'span-2'],
      [cfg.customer.tinLabel, cfg.customer.tin, ''],
      ['Branch', cfg.company.branch, ''],
      ['Invoice no.', cfg.invoice.no, 'mono'],
      ['Invoice date', cfg.invoice.date, ''],
      ['Due date', cfg.invoice.due, ''],
      ['Currency', cfg.invoice.currency, ''],
      ['Reference', cfg.invoice.reference, 'mono'],
      ['Terms', cfg.customer.terms, ''],
      ['Salesperson', cfg.invoice.salesperson, ''],
      ['Price list', cfg.invoice.priceList, '']
    ];

    var linesRows = state.lines.map(function (l, i) {
      var amount = l.qty * l.price * (1 - l.disc / 100);
      var tax = amount * l.rate / 100;
      return '<tr data-line="' + i + '">' +
        '<td class="idx">' + (i + 1) + '</td>' +
        '<td><div class="sku">' + esc(l.sku) + '</div></td>' +
        '<td><div class="desc">' + esc(l.desc) + '</div><div class="meta"><span>' + esc(cfg.lineMeta) + ' ' + esc(l.cls) + '</span><span class="sep">·</span><span>' + esc(l.tax) + '</span><span class="sep">·</span><span class="reg">Registered</span></div></td>' +
        '<td class="num"><input class="qty-input" data-qty="' + i + '" type="number" min="0" step="1" value="' + l.qty + '" aria-label="Quantity for ' + esc(l.sku) + '"></td>' +
        '<td>' + esc(l.uom) + '</td>' +
        '<td class="num">' + money(l.price, false) + '</td>' +
        '<td class="num">' + (l.disc ? l.disc + '%' : '—') + '</td>' +
        '<td><span class="chip">' + esc(l.tax) + '</span></td>' +
        '<td class="num tax line-tax">' + money(tax, false) + '</td>' +
        '<td class="num amount line-amount">' + money(amount + tax, false) + '</td>' +
        '</tr>';
    }).join('');

    var totalRows = [
      ['Subtotal', c.subtotal],
      ['Discount', -c.discount],
      ['VAT', c.taxTotal]
    ].map(function (row) {
      return '<div class="total-row' + (row[1] < 0 ? ' discount' : '') + '"><span>' + row[0] + '</span><span>' + (row[1] < 0 ? '−' : '') + money(Math.abs(row[1]), false) + '</span></div>';
    }).join('');

    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="app">' +
        '<aside class="rail" id="rail">' +
          '<div class="rail-brand"><div class="rail-mark">NE</div><div class="rail-name">Nimbus ERP<small>Modern workspace</small></div></div>' +
          '<div class="rail-tenant"><button class="tenant-chip" type="button" data-toast="Tenant switching is disabled in this demo.">' + flagImg(cfg.id, 'flag-rail') + '<span><b>' + esc(cfg.company.name) + '</b><small>' + esc(cfg.company.licence) + '</small></span><span class="chev">▾</span></button></div>' +
          '<nav class="rail-nav">' +
            '<div class="rail-group">Workspace</div>' +
            '<a class="rail-link" href="#" data-nav="Home">' + ICONS.grid + ' Home</a>' +
            '<a class="rail-link active" href="#invoice-header">' + ICONS.invoice + ' Invoices <span class="badge">' + (state.validated ? '1' : '1') + '</span></a>' +
            '<a class="rail-link" href="#" data-nav="Orders">' + ICONS.cart + ' Sales orders</a>' +
            '<a class="rail-link" href="#" data-nav="Inventory">' + ICONS.box + ' Inventory</a>' +
            '<a class="rail-link" href="#" data-nav="General ledger">' + ICONS.book + ' General ledger</a>' +
            '<div class="rail-group">Insight</div>' +
            '<a class="rail-link" href="#" data-nav="Reports">' + ICONS.chart + ' Reports</a>' +
            '<a class="rail-link" href="#" data-nav="Fiscal log">' + ICONS.shield + ' Fiscal log</a>' +
            '<a class="rail-link" href="#" data-nav="Settings">' + ICONS.gear + ' Settings</a>' +
          '</nav>' +
          '<div class="rail-foot"><b>' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</b><br>Sandbox connector<br>' + esc(cfg.company.tinLabel) + ' ' + esc(cfg.company.tin) + '</div>' +
        '</aside>' +
        '<div class="workspace">' +
          '<header class="topbar">' +
            '<button class="menu-btn" type="button" id="menuBtn" aria-label="Open navigation">' + ICONS.menu + '</button>' +
            '<label class="top-search">' + ICONS.search + '<input type="search" placeholder="Search invoices, customers, items…" aria-label="Search"><kbd>⌘K</kbd></label>' +
            '<div class="top-actions">' +
              '<button class="icon-btn" type="button" aria-label="Help" data-toast="This is a fictional demo. No tax authority is contacted.">' + ICONS.help + '</button>' +
              '<button class="icon-btn" type="button" aria-label="Notifications" data-toast="No notifications in the demo sandbox.">' + ICONS.bell + '<span class="dot"></span></button>' +
              '<span class="top-divider"></span>' +
              '<button class="user-chip" type="button" data-toast="Signed in to a fictional sandbox tenant."><span class="avatar">' + brandInitials(cfg.invoice.salesperson.replace('.', '')) + '</span><span class="who"><b>' + esc(cfg.invoice.salesperson) + '</b><small>Finance administrator</small></span></button>' +
            '</div>' +
          '</header>' +
          '<div class="crumb-bar"><a href="/demos/">Demos</a><span class="sep">/</span><a href="/demos/">' + esc(cfg.country) + '</a><span class="sep">/</span><span>' + esc(cfg.screen.module) + '</span><span class="sep">/</span><span class="here">' + esc(cfg.screen.title) + '</span></div>' +
          '<main class="screen">' +
            '<div class="screen-head">' +
              '<div><div class="screen-title"><h1>' + esc(cfg.screen.title) + '</h1><span class="screen-id">' + esc(cfg.screen.id) + '</span><span class="status-pill ' + (state.validated ? 'ok' : 'pending') + '">' + (state.validated ? 'Fiscally validated' : 'Draft — not fiscalised') + '</span></div>' +
              '<div class="screen-meta"><span class="pill"><span class="dot"></span>' + flagImg(cfg.id) + ' ' + esc(cfg.country) + ' · ' + esc(cfg.authority) + ' ' + esc(cfg.system) + ' sandbox</span><span>' + esc(cfg.invoice.no) + '</span><span>' + esc(cfg.invoice.date) + '</span></div></div>' +
              '<div class="screen-actions">' +
                '<button class="btn btn-ghost" type="button" data-toast="New invoices are disabled in the demo.">' + ICONS.plus + '<span class="lbl">New invoice</span></button>' +
                '<button class="btn" type="button" data-toast="Draft saved locally in this browser session.">Save draft</button>' +
                '<button class="btn btn-soft" type="button" data-action="print" id="printBtn">' + ICONS.print + '<span class="lbl">Tax invoice</span></button>' +
                '<button class="btn btn-primary" type="button" data-action="validate" id="validateBtn">' + ICONS.shield + '<span class="lbl">' + esc(cfg.validation.action) + '</span></button>' +
              '</div>' +
            '</div>' +
            '<div class="demo-banner" id="demoBanner">' +
              '<b>Interactive sandbox.</b><span>' + esc(cfg.country) + ' · ' + esc(cfg.authorityLong) + '. Every name, TIN, item and response is fictional. No live service is called.</span>' +
              '<span class="spacer"></span><span class="tag">DEMO</span>' +
              '<span class="banner-actions"><button class="btn btn-sm" type="button" data-action="tour">' + ICONS.play + ' Guided walkthrough</button><button class="btn btn-sm btn-ghost" type="button" data-action="reset">' + ICONS.reset + ' Reset</button></span>' +
            '</div>' +
            '<div class="layout ' + layoutClass + '">' +
              '<div class="main-col">' +
                '<section class="card" id="invoice-header">' +
                  '<div class="card-head"><h2>Invoice details</h2><span class="sub">' + esc(cfg.customer.terms) + ' · ' + esc(cfg.invoice.currency) + '</span><span class="spacer"></span><span class="sub">Updated just now</span></div>' +
                  '<div class="card-body"><div class="form-grid">' +
                    headerFields.map(function (f) {
                      var ro = f[3] === 'mono';
                      return '<div class="field ' + f[2] + '"><label>' + esc(f[0]) + '</label><div class="control ' + (ro ? 'readonly' : '') + '"><span class="' + (ro ? 'mono' : '') + ' value-trunc">' + esc(f[1]) + '</span>' + (ro ? '<span class="caret">▾</span>' : '') + '</div></div>';
                    }).join('') +
                  '</div></div>' +
                '</section>' +
                headerCustom +
                sectionCustom +
                '<section class="card" id="invoice-lines">' +
                  '<div class="card-head"><h2>Line items</h2><span class="sub">' + state.lines.length + ' lines · tax calculated per line</span><span class="spacer"></span><button class="add-line" type="button" data-action="add">' + ICONS.plus + ' Add line</button></div>' +
                  '<div class="table-wrap"><table class="lines"><thead><tr><th>#</th><th>Item</th><th>Description</th><th class="num">Qty</th><th>UOM</th><th class="num">Unit price</th><th class="num">Disc.</th><th>Tax code</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead><tbody>' + linesRows + '</tbody></table></div>' +
                  '<div class="card-foot"><span class="sub">Prices are exclusive of tax. Amount column includes tax.</span><span class="spacer"></span><span class="sub mono">' + esc(cfg.invoice.currency) + '</span></div>' +
                '</section>' +
                '<section class="card" id="invoice-totals">' +
                  '<div class="card-body"><div class="totals-grid"><div class="totals-note"><b>Tax summary</b><br>' +
                    Object.keys(c.groups).map(function (k) {
                      var g = c.groups[k];
                      return esc(g.label) + ': taxable ' + money(g.net, false) + ' · tax ' + money(g.tax, false);
                    }).join('<br>') +
                    '<br><br>Invoice amount in words:<br><span class="mono" style="font-size:.62rem">' + esc(amountInWords(c.total)) + '</span>' +
                    '</div><div class="totals-box" id="totalsBox">' +
                      totalRows +
                      '<div class="total-row grand"><span>Total</span><span>' + money(c.total) + '</span></div>' +
                      '<div class="total-row"><span>Paid</span><span>' + money(0) + '</span></div>' +
                      '<div class="total-row balance"><span>Balance due</span><span>' + money(c.total) + '</span></div>' +
                    '</div></div></div>' +
                '</section>' +
              '</div>' +
              '<aside class="side-col">' +
                sideCustom +
                '<section class="fiscal-card' + (state.validated ? ' validated' : '') + '" id="fiscal-panel">' +
                  '<div class="status-bar"></div>' +
                  '<div class="fiscal-head"><div class="auth-logo">' + esc(cfg.authority) + '</div><div><h2>' + esc(cfg.system) + ' validation</h2><p>' + esc(cfg.authorityLong) + ' · sandbox</p></div><span class="spacer"></span>' + statusPill + '</div>' +
                  '<div class="fiscal-body" id="fiscalBody">' + fiscalBodyHTML() + '</div>' +
                  '<div class="fiscal-actions">' +
                    '<button class="btn btn-primary" type="button" data-action="validate">' + ICONS.shield + ' ' + (state.validated ? 'Re-validate invoice' : esc(cfg.validation.action)) + '</button>' +
                    '<button class="btn" type="button" data-action="print">' + ICONS.print + ' Print tax invoice</button>' +
                  '</div>' +
                '</section>' +
                '<div class="demo-tip"><b>What this demo proves</b>Acumatica captures the sale; the connector maps it to the fiscal schema, signs it, transmits it, and writes the authority response back to the same invoice. Try changing a quantity, then re-validate.<div class="start"><button class="btn btn-sm btn-soft" type="button" data-action="tour">' + ICONS.play + ' Walk me through it</button></div></div>' +
              '</aside>' +
            '</div>' +
          '</main>' +
          '<div class="demo-footer"><div class="demo-footer-inner"><span>Fictional sandbox built by <a href="/">John Kihiu</a>. No Acumatica, KRA, RRA, ZRA, TRA or ZIMRA system is contacted.</span><span class="spacer"></span><div class="footer-countries">' +
            Object.keys(window.ERP_DEMOS).map(function (k) {
              var d = window.ERP_DEMOS[k];
              return '<a class="' + (k === cfg.id ? 'active' : '') + '" href="/demos/' + (k === 'ke' ? 'kenya' : k === 'rw' ? 'rwanda' : k === 'zm' ? 'zambia' : k === 'tz' ? 'tanzania' : 'zimbabwe') + '/">' + flagImg(k, 'flag-sm') + ' ' + d.country + '</a>';
            }).join('') +
          '</div></div></div>' +
        '</div>' +
      '</div>' +
      tourHTML() +
      welcomeHTML() +
      validationModalHTML() +
      invoiceModalHTML() +
      '<div class="toast" id="toast" role="status"></div>';

    bind();
    if (window.__pendingTour) { window.__pendingTour = false; startTour(); }
  }

  function fiscalBodyHTML() {
    if (!state.validated) {
      return '<div class="fiscal-empty"><b>No fiscal receipt yet.</b> Pre-flight checks run when you validate: branch mapping, item classification, customer TIN format, tax-code mapping and device status. The authority response is written back to this panel.<br><br><span class="mono" style="font-size:.62rem">' + esc(cfg.company.tinLabel) + ' ' + esc(cfg.company.tin) + ' · ' + esc(cfg.validation.short) + ' ready</span></div>';
    }
    var fields = cfg.validation.fields.map(function (f) {
      var tone = f.tone === 'ok' ? ' class="ok"' : '';
      return '<div class="ff' + (f.wide ? ' wide' : '') + '"><dt>' + esc(f.label) + '</dt><dd class="' + (f.mono ? 'mono ' : '') + (f.truncate ? 'trunc' : '') + '" title="' + esc(f.value) + '">' + (tone ? '<span class="ok">' + esc(f.value) + '</span>' : esc(f.value)) + '</dd></div>';
    }).join('');
    return '<div class="fiscal-fields">' + fields + '</div>' +
      '<div style="display:flex;gap:.65rem;margin-top:.7rem;align-items:center"><div style="flex:1;min-width:0"><div class="mono" style="font-size:.6rem;color:var(--subtle);word-break:break-all">' + esc(cfg.validation.receipt.verify) + '</div><a href="#" class="fiscal-links" style="justify-content:flex-start;margin-top:.35rem" data-toast="Verification links are disabled in the demo.">Open verification page ↗</a></div><div class="qr-box" style="width:5.6rem">' + qrSvg(cfg.validation.receipt.qrSeed) + '<span>Demo QR</span></div></div>';
  }

  function tourHTML() {
    return '<div class="tour" id="tour" role="dialog" aria-live="polite"><div class="tour-top"><span class="tour-step" id="tourStepLabel">Step 1 of 5</span><button class="tour-skip" type="button" data-action="tour-skip">Skip tour</button></div><div class="tour-bar"><span id="tourBar"></span></div><p id="tourText"></p><div class="tour-actions"><button class="btn btn-sm" type="button" data-action="tour-prev">Back</button><span class="spacer"></span><button class="btn btn-sm btn-primary" type="button" data-action="tour-next" id="tourNext">Next</button></div></div>';
  }

  function welcomeHTML() {
    var c = compute();
    return '<div class="overlay" id="welcomeModal"><div class="modal welcome"><div class="modal-head"><div><h2>Walk through a real fiscalisation flow</h2><p>No sign-in. No real authority. Everything is fictional.</p></div><span class="spacer"></span><button class="modal-close" type="button" data-action="welcome-close" aria-label="Close">×</button></div><div class="modal-body">' +
      '<div class="flag-line"><span class="flag-big">' + flagImg(cfg.id, 'flag-big') + '</span><div><h2 style="font-size:1rem">' + esc(cfg.country) + ' · ' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</h2><div class="sub" style="font-size:.7rem;color:var(--muted)">' + esc(cfg.authorityLong) + ' sandbox</div></div></div>' +
      '<p>You are looking at a fictional invoice inside an ERP screen modelled on the way Acumatica presents receivables. The validation action, the payload and the authority responses follow the shape of a real ' + esc(cfg.system) + ' integration — but every company, TIN, SKU, price and receipt below is invented.</p>' +
      '<div class="facts"><div class="fact"><b>Invoice</b>' + esc(cfg.invoice.no) + '</div><div class="fact"><b>Customer</b>' + esc(cfg.customer.name) + '</div><div class="fact"><b>Total</b>' + money(c.total) + '</div><div class="fact"><b>Authority</b>' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</div></div>' +
      '<p style="margin-bottom:0"><b>What you can do:</b> edit a quantity, add a line, run validation, inspect the request/response log, then open the printable tax invoice.</p>' +
      '<div class="fine">This demo exists to show integration behaviour, not to reproduce any client system. No Acumatica licence, tenant data or authority credential is used.</div>' +
      '<div class="actions"><button class="btn btn-primary" type="button" data-action="tour-start">' + ICONS.play + ' Start guided walkthrough</button><button class="btn" type="button" data-action="welcome-close">Explore on my own</button></div>' +
      '</div></div></div>';
  }

  function validationModalHTML() {
    return '<div class="overlay" id="validationModal"><div class="modal"><div class="modal-head"><div><h2 id="vModalTitle">Submitting to ' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</h2><p id="vModalSub">Invoice ' + esc(cfg.invoice.no) + ' · ' + esc(cfg.invoice.currency) + '</p></div><span class="spacer"></span><button class="modal-close" type="button" data-action="validation-close" aria-label="Close">×</button></div><div class="modal-body"><div class="runner"><div><div class="runner-steps" id="runnerSteps"></div><div class="runner-status" id="runnerStatus"><div class="spin"></div><div class="okmark">✓</div><div><b id="runnerStatusTitle">Contacting sandbox…</b><small id="runnerStatusSub">Do not close this window.</small></div></div></div><div class="runner-log"><div class="log-head"><span class="tab active" data-logtab="trace">Trace</span><span class="tab" data-logtab="request">Request</span><span class="tab" data-logtab="response">Response</span><span class="spacer">sandbox · ' + esc(cfg.country) + '</span></div><div class="log-body" id="logBody"></div></div></div></div><div class="modal-foot"><span class="hint" style="font-size:.65rem;color:var(--muted)">Fictional endpoint. No network request leaves this page.</span><span class="spacer"></span><button class="btn" type="button" data-action="validation-close">Close</button><button class="btn btn-primary" type="button" data-action="validation-results" id="resultsBtn" disabled>View results</button></div></div></div>';
  }

  function invoiceModalHTML() {
    return '<div class="overlay" id="invoiceModal"><div class="modal print-modal"><div class="modal-head"><div><h2>Tax invoice preview</h2><p>' + esc(cfg.country) + ' · ' + esc(cfg.authority) + ' ' + esc(cfg.system) + ' · fictional document</p></div><span class="spacer"></span><button class="modal-close" type="button" data-action="invoice-close" aria-label="Close">×</button></div><div class="print-scroll" id="printScroll"></div><div class="print-actions"><span class="hint">A4 print layout. All data is fictional.</span><span class="spacer"></span><button class="btn" type="button" data-action="invoice-close">Close</button><button class="btn btn-primary" type="button" data-action="print-now">' + ICONS.print + ' Print / save PDF</button></div></div></div>';
  }

  /* ── Interactions ─────────────────────────────────────── */
  function bind() {
    document.querySelectorAll('[data-toast]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toast(el.getAttribute('data-toast'));
      });
    });
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toast(el.getAttribute('data-nav') + ' is outside the scope of this sandbox demo. The invoice screen is fully interactive.');
      });
    });
    document.querySelectorAll('[data-action]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var a = el.getAttribute('data-action');
        if (a === 'validate') runValidation();
        else if (a === 'print') openInvoice();
        else if (a === 'add') addLine();
        else if (a === 'reset') resetDemo();
        else if (a === 'tour') { closeWelcome(); startTour(); }
        else if (a === 'tour-start') { closeWelcome(); startTour(); }
        else if (a === 'welcome-close') closeWelcome();
        else if (a === 'tour-skip') endTour();
        else if (a === 'tour-next') tourNext();
        else if (a === 'tour-prev') tourPrev();
        else if (a === 'validation-close') closeOverlay('validationModal');
        else if (a === 'validation-results') { closeOverlay('validationModal'); focusFiscal(); }
        else if (a === 'invoice-close') closeOverlay('invoiceModal');
        else if (a === 'print-now') window.print();
      });
    });
    document.querySelectorAll('[data-qty]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var i = Number(inp.getAttribute('data-qty'));
        var v = Math.max(0, Number(inp.value) || 0);
        state.lines[i].qty = v;
        if (state.validated) {
          state.validated = false;
          toast('Invoice changed. The previous fiscal receipt is now stale — re-validate.');
        }
        recalcUI();
      });
    });
    var menu = document.getElementById('menuBtn');
    if (menu) menu.addEventListener('click', function () { document.getElementById('rail').classList.toggle('open'); });

    document.querySelectorAll('[data-logtab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        state.logTab = tab.getAttribute('data-logtab');
        document.querySelectorAll('[data-logtab]').forEach(function (t) { t.classList.toggle('active', t === tab); });
        paintLog();
      });
    });

    var closeTargets = { welcomeModal: null };
    void closeTargets;
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  function closeOverlay(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
    if (id === 'invoiceModal') document.body.classList.remove('showing-print');
  }

  function closeWelcome() {
    closeOverlay('welcomeModal');
  }

  function focusFiscal() {
    var el = document.getElementById('fiscal-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function totalsRowsHTML(c) {
    return ('<div class="total-row">' +
      '<span>Subtotal</span><span>' + money(c.subtotal, false) + '</span></div>' +
      '<div class="total-row' + (c.discount ? ' discount' : '') + '"><span>Discount</span><span>' + (c.discount ? '−' + money(c.discount, false) : money(0, false)) + '</span></div>' +
      '<div class="total-row"><span>VAT</span><span>' + money(c.taxTotal, false) + '</span></div>' +
      '<div class="total-row grand"><span>Total</span><span>' + money(c.total) + '</span></div>' +
      '<div class="total-row"><span>Paid</span><span>' + money(0) + '</span></div>' +
      '<div class="total-row balance"><span>Balance due</span><span>' + money(c.total) + '</span></div>');
  }

  function taxSummaryHTML(c) {
    return '<b>Tax summary</b><br>' + Object.keys(c.groups).map(function (k) {
      var g = c.groups[k];
      return esc(g.label) + ': taxable ' + money(g.net, false) + ' · tax ' + money(g.tax, false);
    }).join('<br>') + '<br><br>Invoice amount in words:<br><span class="mono" style="font-size:.62rem">' + esc(amountInWords(c.total)) + '</span>';
  }

  function resetFiscalUI() {
    var panel = document.getElementById('fiscal-panel');
    if (!panel) return;
    panel.classList.remove('validated');
    var body = document.getElementById('fiscalBody');
    if (body) body.innerHTML = fiscalBodyHTML();
    document.querySelectorAll('.fiscal-head .status-pill, .fiscal-strip-head .status-pill').forEach(function (s) { s.className = 'status-pill pending'; s.textContent = 'Not validated'; });
    var st = document.querySelector('.screen-title .status-pill');
    if (st) { st.className = 'status-pill pending'; st.textContent = 'Draft — not fiscalised'; }
    var fin = document.getElementById('fiscalInvoice');
    if (fin) fin.textContent = 'Assigned on validation';
    document.querySelectorAll('[data-action="validate"]').forEach(function (b) {
      if (b.id === 'validateBtn' || b.classList.contains('btn-primary')) b.innerHTML = ICONS.shield + ' <span class="lbl">' + esc(cfg.validation.action) + '</span>';
    });
  }

  function recalcUI() {
    var c = compute();
    state.lines.forEach(function (l, i) {
      var row = document.querySelector('[data-line="' + i + '"]');
      if (!row) return;
      var amount = l.qty * l.price * (1 - l.disc / 100);
      var tax = amount * l.rate / 100;
      var a = row.querySelector('.line-amount');
      var t = row.querySelector('.line-tax');
      if (a) a.textContent = money(amount + tax, false);
      if (t) t.textContent = money(tax, false);
    });
    var box = document.getElementById('totalsBox');
    if (box) box.innerHTML = totalsRowsHTML(c);
    var note = document.querySelector('.totals-note');
    if (note) note.innerHTML = taxSummaryHTML(c);
    if (!state.validated) resetFiscalUI();
  }

  function addLine() {
    state.lines.push({ sku: 'NEW-ITEM', desc: 'New charge line', cls: '0000.00.00', qty: 1, uom: 'PCS', price: 1000, disc: 0, tax: state.lines[0].tax, rate: state.lines[0].rate });
    state.validated = false;
    render();
    toast('Line added. Edit the quantity to recalculate tax.');
  }

  function resetDemo() {
    state.lines = cfg.lines.map(function (l) { return Object.assign({}, l); });
    state.validated = false;
    state.running = false;
    state.tourStep = 0;
    render();
    toast('Demo reset to the original fictional invoice.');
  }

  /* ── Validation walkthrough ───────────────────────────── */
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function clock() {
    var d = new Date();
    function p(x) { return String(x).padStart(2, '0'); }
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  function trace(line, cls) {
    var el = document.getElementById('logBody');
    if (!el) return;
    var span = document.createElement('span');
    span.className = 'ln';
    span.innerHTML = '<span class="t">' + clock() + '</span>  ' + (cls ? '<span class="' + cls + '">' + esc(line) + '</span>' : esc(line));
    el.appendChild(span);
    el.scrollTop = el.scrollHeight;
  }

  function paintLog() {
    var el = document.getElementById('logBody');
    if (!el) return;
    if (state.logTab === 'trace') {
      el.innerHTML = state.traceLines || '';
    } else if (state.logTab === 'request') {
      el.textContent = JSON.stringify(cfg.validation.request, null, 2);
    } else {
      el.textContent = JSON.stringify(cfg.validation.response, null, 2);
    }
  }

  function runValidation() {
    if (state.running) return;
    state.running = true;
    state.traceLines = '';
    state.logTab = 'trace';
    var overlay = document.getElementById('validationModal');
    overlay.classList.add('open');
    var stepsEl = document.getElementById('runnerSteps');
    stepsEl.innerHTML = cfg.validation.steps.map(function (s, i) {
      return '<div class="rstep" data-rstep="' + i + '"><div class="ico">' + (i + 1) + '</div><div style="min-width:0"><b>' + esc(s.title) + '</b><p>' + esc(s.detail) + '</p></div><time></time></div>';
    }).join('');
    var status = document.getElementById('runnerStatus');
    status.classList.remove('done');
    document.getElementById('runnerStatusTitle').textContent = 'Contacting ' + cfg.authority + ' sandbox…';
    document.getElementById('runnerStatusSub').textContent = 'Pre-flight checks and signing in progress.';
    document.getElementById('resultsBtn').disabled = true;
    document.getElementById('logBody').innerHTML = '';
    state.traceLines = '';
    trace('session opened · device ' + cfg.validation.request.branchId, 'k');
    trace('payload version 2026.11 · ' + state.lines.length + ' lines · ' + cfg.invoice.currency, 'k');

    var p = (async function () {
      for (var i = 0; i < cfg.validation.steps.length; i++) {
        var step = cfg.validation.steps[i];
        var el = stepsEl.querySelector('[data-rstep="' + i + '"]');
        el.classList.add('active');
        var t0 = clock();
        trace(step.title + ' — ' + step.detail, 'y');
        await sleep(step.ms);
        el.classList.remove('active');
        el.classList.add('done');
        el.querySelector('.ico').textContent = '✓';
        el.querySelector('time').textContent = t0;
        if (i === 0) {
          cfg.validation.checks.forEach(function (c) { trace('  ✓ ' + c, 'g'); });
        }
        if (i === 1) trace('  signed payload · ' + (JSON.stringify(cfg.validation.request).length) + ' bytes', 'g');
        if (i === 2) trace('  POST /sandbox/' + cfg.validation.short.toLowerCase().replace(/\s+/g, '-') + '/submit', 'k');
        if (i === 3) trace('  resultCd ' + cfg.validation.response.resultCd + ' · ' + cfg.validation.response.resultMsg, 'g');
        if (i === 4) trace('  receipt ' + cfg.validation.receipt.number + ' stored against ' + cfg.invoice.no, 'g');
      }
      state.traceLines = document.getElementById('logBody').innerHTML;
      state.validated = true;
      state.running = false;
      status.classList.add('done');
      document.getElementById('runnerStatusTitle').textContent = 'Validation complete';
      document.getElementById('runnerStatusSub').textContent = cfg.authority + ' accepted the invoice. Receipt ' + cfg.validation.receipt.number + '.';
      document.getElementById('resultsBtn').disabled = false;
      trace('done · no real authority was contacted', 'k');
      state.traceLines = document.getElementById('logBody').innerHTML;
      renderFiscalOnly();
    })();
    return p;
  }

  function renderFiscalOnly() {
    var panel = document.getElementById('fiscal-panel');
    if (!panel) { render(); return; }
    panel.classList.add('validated');
    var status = document.querySelector('.screen-title .status-pill');
    if (status) { status.className = 'status-pill ok'; status.textContent = 'Fiscally validated'; }
    document.querySelectorAll('.fiscal-head .status-pill').forEach(function (s) { s.className = 'status-pill ok'; s.textContent = 'Validated'; });
    var body = document.getElementById('fiscalBody');
    body.innerHTML = fiscalBodyHTML();
    var headStatus = document.querySelector('.fiscal-strip-head .status-pill');
    if (headStatus) { headStatus.className = 'status-pill ok'; headStatus.textContent = 'Validated'; }
    var fin = document.getElementById('fiscalInvoice');
    if (fin) { fin.textContent = cfg.validation.receipt.number; }
    document.querySelectorAll('[data-action="validate"]').forEach(function (b) {
      if (b.classList.contains('btn-primary')) b.innerHTML = ICONS.shield + ' Re-validate invoice';
    });
  }

  /* ── Print invoice ────────────────────────────────────── */
  function openInvoice() {
    if (!state.validated) {
      toast('Validate the invoice first — a tax invoice needs a fiscal receipt number.');
      return;
    }
    var c = compute();
    var scroll = document.getElementById('printScroll');
    scroll.innerHTML = printDocHTML(c);
    document.getElementById('invoiceModal').classList.add('open');
  }

  function printDocHTML(c) {
    var v = cfg.validation;
    var taxRows = Object.keys(c.groups).map(function (k) {
      var g = c.groups[k];
      return '<tr><td>' + esc(g.label) + '</td><td class="num">' + money(g.net, false) + '</td><td class="num">' + money(g.tax, false) + '</td></tr>';
    }).join('');
    var lineRows = state.lines.map(function (l, i) {
      var net = l.qty * l.price * (1 - l.disc / 100);
      var tax = net * l.rate / 100;
      return '<tr><td>' + (i + 1) + '</td><td><strong>' + esc(l.desc) + '</strong><span class="sku">' + esc(l.sku) + ' · ' + esc(l.cls) + '</span></td><td class="num">' + num(l.qty) + ' ' + esc(l.uom) + '</td><td class="num">' + money(l.price, false) + '</td><td class="num">' + money(tax, false) + '</td><td class="num">' + money(net + tax, false) + '</td></tr>';
    }).join('');

    return '<div class="print-doc v-' + cfg.print.variant + '" id="printDoc">' +
      '<div class="pd-demo-stamp">DEMO · FICTIONAL</div>' +
      '<div class="pd-top">' +
        '<div class="pd-brand"><div class="pd-mark">' + brandInitials(cfg.company.name) + '</div><div class="pd-company"><h1>' + esc(cfg.company.name) + '</h1><p>' + esc(cfg.company.branch) + ' · ' + esc(cfg.company.address) + '<br>' + esc(cfg.company.phone) + ' · ' + esc(cfg.company.email) + '</p></div></div>' +
        '<div class="pd-title"><h2>' + esc(cfg.print.docTitle) + '</h2><p>' + esc(cfg.print.subtitle) + '</p><span class="jur">' + flagImg(cfg.id) + ' ' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</span></div>' +
      '</div>' +
      '<div class="pd-parties">' +
        '<div class="pd-block"><h3>Seller</h3><strong>' + esc(cfg.company.name) + '</strong><p>' + esc(cfg.company.branch) + '<br>' + esc(cfg.company.address) + '</p><dl class="ids"><dt>' + esc(cfg.company.tinLabel) + '</dt><dd>' + esc(cfg.company.tin) + '</dd><dt>' + esc(cfg.company.vatLabel) + '</dt><dd>' + esc(cfg.company.vat) + '</dd></dl></div>' +
        '<div class="pd-block"><h3>Bill to</h3><strong>' + esc(cfg.customer.name) + '</strong><p>' + esc(cfg.customer.address) + '<br>' + esc(cfg.customer.contact) + '</p><dl class="ids"><dt>' + esc(cfg.customer.tinLabel) + '</dt><dd>' + esc(cfg.customer.tin) + '</dd><dt>Terms</dt><dd>' + esc(cfg.customer.terms) + '</dd></dl></div>' +
      '</div>' +
      '<div class="pd-meta">' +
        '<div><dt>Invoice number</dt><dd class="mono">' + esc(cfg.invoice.no) + '</dd></div>' +
        '<div><dt>Invoice date</dt><dd>' + esc(cfg.invoice.date) + '</dd></div>' +
        '<div><dt>Due date</dt><dd>' + esc(cfg.invoice.due) + '</dd></div>' +
        '<div><dt>Currency</dt><dd>' + esc(cfg.invoice.currency) + '</dd></div>' +
        '<div><dt>Customer reference</dt><dd class="mono">' + esc(cfg.invoice.reference) + '</dd></div>' +
        '<div><dt>Salesperson</dt><dd>' + esc(cfg.invoice.salesperson) + '</dd></div>' +
        '<div><dt>Fiscal receipt</dt><dd class="mono">' + esc(v.receipt.number) + '</dd></div>' +
        '<div><dt>Receipt type</dt><dd>' + esc(cfg.print.docTitle.charAt(0) + cfg.print.docTitle.slice(1).toLowerCase()) + '</dd></div>' +
      '</div>' +
      '<table class="pd-lines"><thead><tr><th>#</th><th>Description</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead><tbody>' + lineRows + '</tbody></table>' +
      '<div class="pd-summary">' +
        '<div class="pd-tax"><table><thead><tr><th>Tax breakdown</th><th class="num">Taxable</th><th class="num">Tax</th></tr></thead><tbody>' + taxRows + '</tbody></table><div class="pd-note" style="border-top:0;padding-top:.35rem;margin-top:.2rem">Amount in words: <strong>' + esc(amountInWords(c.total)) + '</strong></div></div>' +
        '<div class="pd-totals"><div class="row"><span>Subtotal</span><span>' + money(c.subtotal, false) + '</span></div><div class="row"><span>Discount</span><span>−' + money(c.discount, false) + '</span></div><div class="row"><span>VAT</span><span>' + money(c.taxTotal, false) + '</span></div><div class="row grand"><span>Total due</span><span>' + money(c.total, false) + '</span></div></div>' +
      '</div>' +
      '<div class="pd-fiscal">' +
        cfg.print.fiscalLabels.map(function (f) { return '<div class="f' + (f[1].length > 18 ? ' mono' : '') + '"><h4>' + esc(f[0]) + '</h4><p>' + esc(f[1]) + '</p></div>'; }).join('') +
        '<div class="qr">' + qrSvg(v.receipt.qrSeed) + '</div>' +
      '</div>' +
      '<div class="pd-note"><strong>' + esc(cfg.print.note) + '</strong><br>Verification: ' + esc(v.receipt.verify) + '<br>This document is a fictional demo. It is not a valid tax invoice and must not be used for accounting, VAT or customs purposes.</div>' +
      '<div class="pd-foot"><span>' + esc(cfg.company.name) + ' · ' + esc(cfg.company.branch) + '</span><span>' + esc(cfg.invoice.no) + ' · Page 1 of 1</span></div>' +
    '</div>';
  }

  /* ── Tour ─────────────────────────────────────────────── */
  function tourTargets() {
    return ['invoice-header', 'invoice-lines', 'validateBtn', 'fiscal-panel', 'printBtn'];
  }

  function startTour() {
    state.tourStep = 0;
    closeWelcome();
    document.getElementById('tour').classList.add('open');
    paintTour();
  }

  function paintTour() {
    var total = cfg.tour.length;
    var idx = Math.min(state.tourStep, total - 1);
    document.getElementById('tourStepLabel').textContent = 'Step ' + (idx + 1) + ' of ' + total;
    document.getElementById('tourText').textContent = cfg.tour[idx];
    document.getElementById('tourBar').style.width = ((idx + 1) / total * 100) + '%';
    document.getElementById('tourNext').textContent = idx === total - 1 ? 'Finish' : 'Next';
    document.querySelector('[data-action="tour-prev"]').style.visibility = idx === 0 ? 'hidden' : 'visible';

    document.querySelectorAll('.spotlight').forEach(function (e) { e.classList.remove('spotlight'); });
    var targetId = tourTargets()[idx];
    var target = document.getElementById(targetId);
    if (target) {
      target.classList.add('spotlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function tourNext() {
    if (state.tourStep >= cfg.tour.length - 1) { endTour(); return; }
    state.tourStep++;
    paintTour();
    if (state.tourStep === 2 && !state.validated) {
      setTimeout(function () {
        var b = document.getElementById('validateBtn');
        if (b) b.classList.add('spotlight');
      }, 350);
    }
  }

  function tourPrev() {
    if (state.tourStep === 0) return;
    state.tourStep--;
    paintTour();
  }

  function endTour() {
    document.querySelectorAll('.spotlight').forEach(function (e) { e.classList.remove('spotlight'); });
    document.getElementById('tour').classList.remove('open');
    state.tourStep = 0;
  }

  /* ── boot ─────────────────────────────────────────────── */
  render();
  var params = new URLSearchParams(location.search);
  if (params.get('welcome') !== '0') {
    setTimeout(function () {
      document.getElementById('welcomeModal').classList.add('open');
    }, 450);
  }
  if (params.get('autovalidate') === '1') {
    setTimeout(runValidation, 500);
  }
  if (params.get('print') === '1') {
    setTimeout(function () {
      if (!state.validated) {
        state.validated = true;
        renderFiscalOnly();
      }
      openInvoice();
    }, 700);
  }
})();
