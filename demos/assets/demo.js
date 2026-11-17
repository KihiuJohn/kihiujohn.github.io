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
    activeTab: 'document',
    fiscalOpen: true,
    logTab: 'request',
    traceLines: ''
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
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z"/><path d="M8.5 12l2.5 2.5L16 9.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
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
  function roundMoney(n) { var f = Math.pow(10, cfg.invoice.decimals); return Math.round(n * f) / f; }

  function compute() {
    var subtotal = 0, discount = 0, taxTotal = 0, groups = {};
    state.lines.forEach(function (l) {
      var gross = l.qty * l.price;
      var net = gross * (1 - l.disc / 100);
      var tax = net * l.rate / 100;
      l.net = round2(net); l.taxAmt = round2(tax); l.gross = round2(gross);
      subtotal += gross; discount += gross - net; taxTotal += tax;
      if (!groups[l.tax]) groups[l.tax] = { label: l.tax, rate: l.rate, net: 0, tax: 0 };
      groups[l.tax].net += net; groups[l.tax].tax += tax;
    });
    var netSubtotal = subtotal - discount;
    return { subtotal: round2(subtotal), netSubtotal: round2(netSubtotal), discount: round2(discount), taxTotal: round2(taxTotal), total: round2(netSubtotal + taxTotal), groups: groups };
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
    var grid = [], reserved = [], r, c;
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
    return '<svg viewBox="0 0 ' + total + ' ' + total + '" role="img" aria-label="Decorative demo QR code" xmlns="http://www.w3.org/2000/svg"><rect width="' + total + '" height="' + total + '" fill="#fff"/><path d="' + d + '" fill="#111827"/></svg>';
  }

  function flagImg(id, cls) {
    return '<img class="flag-img ' + (cls || '') + '" src="/demos/assets/flags/' + id + '.svg" alt="" width="24" height="16" loading="lazy">';
  }

  function brandInitials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
  }

  function statusPill() {
    return state.validated
      ? '<span class="status-pill ok">Validated</span>'
      : '<span class="status-pill pending">Not validated</span>';
  }

  function fieldHTML(label, value, opts) {
    opts = opts || {};
    return '<div class="field ' + (opts.span ? opts.span : '') + '"><label>' + esc(label) + '</label><div class="control readonly"><span class="' + (opts.mono ? 'mono ' : '') + 'value-trunc" title="' + esc(value) + '">' + esc(value) + '</span>' + (opts.caret ? '<span class="caret">▾</span>' : '') + '</div></div>';
  }

  function fiscalFieldHTML(label, value, opts) {
    opts = opts || {};
    var tone = opts.tone === 'ok' ? ' style="color:var(--ok);font-weight:700"' : '';
    return '<div class="field"><label>' + esc(label) + '</label><div class="control readonly"><span class="' + (opts.mono ? 'mono ' : '') + 'value-trunc"' + tone + ' title="' + esc(value) + '">' + esc(value) + '</span></div></div>';
  }

  function customFieldHTML(f) {
    var value = (f.id === 'fiscalInvoice' && state.validated) ? cfg.validation.receipt.number : f.value;
    return '<div class="field"><label>' + esc(f.label) + '</label><div class="control readonly"><span class="' + (f.mono ? 'mono ' : '') + 'value-trunc" title="' + esc(value) + '">' + esc(value) + '</span></div></div>';
  }

  function headerFieldsHTML() {
    return [
      fieldHTML('Customer', cfg.customer.name, { span: 'span-2', caret: true }),
      fieldHTML(cfg.customer.tinLabel, cfg.customer.tin, { mono: true }),
      fieldHTML('Branch', cfg.company.branch, { caret: true }),
      fieldHTML('Invoice no.', cfg.invoice.no, { mono: true }),
      fieldHTML('Invoice date', cfg.invoice.date),
      fieldHTML('Due date', cfg.invoice.due),
      fieldHTML('Currency', cfg.invoice.currency, { caret: true }),
      fieldHTML('Reference', cfg.invoice.reference, { span: 'span-2', mono: true }),
      fieldHTML('Terms', cfg.customer.terms, { caret: true }),
      fieldHTML('Salesperson', cfg.invoice.salesperson),
      fieldHTML('Price list', cfg.invoice.priceList)
    ].join('');
  }

  function checklistHTML() {
    return '<div class="checklist">' + cfg.validation.checks.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>';
  }

  function fiscalSectionHTML() {
    var cols = cfg.custom.length === 6 ? 3 : cfg.custom.length === 5 ? 5 : 4;
    var custom = '<div class="fiscal-subhead">Fiscal identifiers</div><div class="fiscal-grid" style="--fcols:' + cols + '">' + cfg.custom.map(customFieldHTML).join('') + '</div>';
    var result;
    if (state.validated) {
      var fields = cfg.validation.fields.map(function (f) {
        return fiscalFieldHTML(f.label, f.value, { mono: f.mono, tone: f.tone });
      }).join('');
      result = '<div class="fiscal-subhead">Authority response</div><div class="validation-result">' + fields +
        '<div class="qr-cell"><div class="qr-box">' + qrSvg(cfg.validation.receipt.qrSeed) + '<span>Demo QR</span></div></div></div>' +
        '<div class="fiscal-actions-inline"><button class="btn" type="button" data-action="validate">' + ICONS.shield + ' Re-validate</button><button class="btn btn-soft" type="button" data-action="print">' + ICONS.print + ' Print tax invoice</button></div>';
    } else {
      result = '<div class="fiscal-subhead">Authority response</div><div class="fiscal-empty"><span class="fi">' + ICONS.shield + '</span><div><b>Not validated yet.</b><p>The invoice is saved locally but has no fiscal receipt. Run the ' + esc(cfg.validation.short) + ' action to sign the payload, submit it and write the authority response back to this document.</p></div></div>' +
        checklistHTML() +
        '<div class="fiscal-actions-inline"><button class="btn btn-primary" type="button" data-action="validate">' + ICONS.shield + ' ' + esc(cfg.validation.action) + '</button></div>';
    }
    return custom + result;
  }

  function documentPanelHTML(c) {
    var rows = state.lines.map(function (l, i) {
      var amount = l.qty * l.price * (1 - l.disc / 100);
      var tax = amount * l.rate / 100;
      return '<tr data-line="' + i + '">' +
        '<td class="check-col"><input type="checkbox" aria-label="Select line ' + (i + 1) + '"></td>' +
        '<td class="idx">' + (i + 1) + '</td>' +
        '<td class="mono" style="font-size:.6rem;color:var(--ac-muted)">' + esc(cfg.validation.request.branchId) + '</td>' +
        '<td><a class="sku" href="#" data-toast="Item maintenance is outside this demo.">' + esc(l.sku) + '</a></td>' +
        '<td><div class="desc">' + esc(l.desc) + '</div><div class="meta"><span>' + esc(cfg.lineMeta) + ' ' + esc(l.cls) + '</span><span class="sep"> · </span><span>' + esc(l.tax) + '</span><span class="sep"> · </span><span class="reg">Registered</span></div></td>' +
        '<td class="num"><input class="qty-input" data-qty="' + i + '" type="number" min="0" step="1" value="' + l.qty + '" aria-label="Quantity for ' + esc(l.sku) + '"></td>' +
        '<td>' + esc(l.uom) + '</td>' +
        '<td class="num">' + money(l.price, false) + '</td>' +
        '<td class="num">' + (l.disc ? l.disc + '%' : '—') + '</td>' +
        '<td><span class="chip">' + esc(l.tax) + '</span></td>' +
        '<td class="num tax line-tax">' + money(tax, false) + '</td>' +
        '<td class="num amount line-amount">' + money(amount + tax, false) + '</td>' +
        '</tr>';
    }).join('');

    var taxRows = Object.keys(c.groups).map(function (k) {
      var g = c.groups[k];
      return '<tr><td>' + esc(g.label) + '</td><td>' + money(g.net, false) + '</td><td>' + money(g.tax, false) + '</td></tr>';
    }).join('');

    return '<div class="tab-panel" data-panel="document">' +
      '<div class="form-panel">' +
        '<div class="form-group" id="document-form">' +
          '<div class="group-head"><span class="gh-icon">D</span>Invoice details<span class="sub">' + esc(cfg.customer.terms) + ' · ' + esc(cfg.invoice.currency) + '</span><span class="spacer"></span><span class="sub">Draft</span></div>' +
          '<div class="group-body"><div class="form-grid">' + headerFieldsHTML() + '</div></div>' +
        '</div>' +
        '<div class="form-group fiscal" id="fiscal-section">' +
          '<div class="group-head"><span class="gh-icon">' + esc(cfg.authority) + '</span>' + esc(cfg.system) + ' / fiscalisation<span class="sub">' + esc(cfg.authorityLong) + ' sandbox</span><span class="spacer"></span>' + statusPill() + '</div>' +
          '<div class="group-body" id="fiscalSectionBody">' + fiscalSectionHTML() + '</div>' +
        '</div>' +
        '<div class="grid-section" id="invoice-lines">' +
          '<div class="grid-toolbar"><div class="grid-tabs"><span class="active">Details</span><span data-toast="Tax detail is on the Taxes tab.">Taxes</span><span data-toast="Financial detail is on the Financial tab.">Financial</span></div><div class="grid-actions"><button class="btn" type="button" data-action="add">' + ICONS.plus + ' Add row</button><button class="btn" type="button" data-toast="Row deletion is disabled in the demo.">Delete</button><span class="rows">' + state.lines.length + ' rows</span></div></div>' +
          '<div class="table-wrap"><table class="lines"><thead><tr><th class="check-col"><input type="checkbox" aria-label="Select all"></th><th>#</th><th>Branch</th><th>Item</th><th>Description</th><th class="num">Qty</th><th>UOM</th><th class="num">Unit price</th><th class="num">Disc. %</th><th>Tax code</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '</div>' +
        '<div class="summary-strip" id="invoice-totals">' +
          '<div><div class="summary-title">Tax summary</div><table class="tax-mini"><thead><tr><th>Tax code</th><th>Taxable</th><th>Tax</th></tr></thead><tbody>' + taxRows + '</tbody></table><div class="amount-words"><b>Amount in words:</b> ' + esc(amountInWords(c.total)) + '</div></div>' +
          '<div class="totals-box">' +
            '<div class="total-row"><span>Subtotal</span><span>' + money(c.subtotal, false) + '</span></div>' +
            '<div class="total-row' + (c.discount ? ' discount' : '') + '"><span>Discount</span><span>' + (c.discount ? '−' + money(c.discount, false) : money(0, false)) + '</span></div>' +
            '<div class="total-row"><span>VAT</span><span>' + money(c.taxTotal, false) + '</span></div>' +
            '<div class="total-row grand"><span>Total</span><span>' + money(c.total) + '</span></div>' +
            '<div class="total-row"><span>Paid</span><span>' + money(0) + '</span></div>' +
            '<div class="total-row balance"><span>Balance due</span><span>' + money(c.total) + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function financialPanelHTML(c) {
    var taxRows = Object.keys(c.groups).map(function (k) {
      var g = c.groups[k];
      return '<div class="total-row"><span>' + esc(g.label) + '</span><span>' + money(g.tax, false) + '</span></div>';
    }).join('');
    return '<div class="tab-panel" data-panel="financial" hidden>' +
      '<div class="form-panel">' +
        '<div class="two-col">' +
          '<div class="form-group"><div class="group-head"><span class="gh-icon">P</span>Payment terms</div><div class="group-body"><div class="form-grid" style="grid-template-columns:1fr 1fr">' +
            fieldHTML('Terms', cfg.customer.terms, { caret: true }) +
            fieldHTML('Due date', cfg.invoice.due) +
            fieldHTML('Currency', cfg.invoice.currency, { caret: true }) +
            fieldHTML('Exchange rate', '1.000000') +
            fieldHTML('Cash discount', '0.00%') +
            fieldHTML('Payment method', 'Bank transfer') +
            fieldHTML('Credit limit', money(2500000, true)) +
            fieldHTML('Bank account', 'Main operating account') +
          '</div></div></div>' +
          '<div class="form-group"><div class="group-head"><span class="gh-icon">F</span>Financial summary</div><div class="group-body">' +
            '<div class="totals-box" style="margin:0">' +
              '<div class="total-row"><span>Subtotal</span><span>' + money(c.subtotal, false) + '</span></div>' +
              '<div class="total-row"><span>Discount</span><span>' + (c.discount ? '−' + money(c.discount, false) : money(0, false)) + '</span></div>' +
              '<div class="total-row"><span>Net taxable</span><span>' + money(c.netSubtotal, false) + '</span></div>' +
              taxRows +
              '<div class="total-row grand"><span>Total</span><span>' + money(c.total) + '</span></div>' +
              '<div class="total-row balance"><span>Balance due</span><span>' + money(c.total) + '</span></div>' +
            '</div>' +
          '</div></div>' +
        '</div>' +
        '<div class="form-group"><div class="group-head"><span class="gh-icon">A</span>Amount in words</div><div class="group-body"><div class="amount-words" style="margin:0;font-size:.7rem">' + esc(amountInWords(c.total)) + '</div></div></div>' +
      '</div>' +
    '</div>';
  }

  function taxesPanelHTML(c) {
    var rows = Object.keys(c.groups).map(function (k) {
      var g = c.groups[k];
      return '<tr><td><b>' + esc(g.label) + '</b></td><td class="num">' + money(g.net, false) + '</td><td class="num">' + g.rate + '%</td><td class="num">' + money(g.tax, false) + '</td><td>' + esc(cfg.country) + ' · ' + esc(cfg.authority) + '</td></tr>';
    }).join('');
    return '<div class="tab-panel" data-panel="taxes" hidden>' +
      '<div class="form-panel">' +
        '<div class="group-head"><span class="gh-icon">T</span>Tax details<span class="spacer"></span><span class="sub">' + esc(cfg.authority) + ' sandbox</span></div>' +
        '<table class="data-table"><thead><tr><th>Tax code</th><th class="num">Taxable amount</th><th class="num">Rate</th><th class="num">Tax amount</th><th>Jurisdiction</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="table-foot"><span>Total taxable <b>' + money(c.netSubtotal, false) + '</b></span><span>Total tax <b>' + money(c.taxTotal, false) + '</b></span></div>' +
        '<div class="panel-note">Tax is calculated per line, then grouped by tax code for the fiscal payload. The authority validates the group totals, not just the invoice total.</div>' +
      '</div>' +
    '</div>';
  }

  function applicationsPanelHTML() {
    return '<div class="tab-panel" data-panel="applications" hidden>' +
      '<div class="form-panel">' +
        '<div class="group-head"><span class="gh-icon">A</span>Applications<span class="spacer"></span><span class="sub">Payments and credits applied to this invoice</span></div>' +
        '<table class="data-table"><thead><tr><th>Document</th><th>Date</th><th class="num">Amount</th><th class="num">Applied</th><th class="num">Balance</th><th>Status</th></tr></thead><tbody><tr><td colspan="6" style="text-align:center;color:var(--ac-muted);padding:1.4rem">No payments or credit notes applied. This is a draft invoice.</td></tr></tbody></table>' +
        '<div class="panel-note">In a production flow, released payments and credit notes appear here and reduce the balance without changing the fiscal receipt already issued.</div>' +
      '</div>' +
    '</div>';
  }

  function validationPanelHTML() {
    var body;
    if (state.validated) {
      var fields = cfg.validation.fields.map(function (f) {
        return fiscalFieldHTML(f.label, f.value, { mono: f.mono, tone: f.tone });
      }).join('');
      body = '<div class="validation-result">' + fields + '<div class="qr-cell"><div class="qr-box">' + qrSvg(cfg.validation.receipt.qrSeed) + '<span>Demo QR</span></div></div></div>';
    } else {
      body = '<div class="fiscal-empty"><span class="fi">' + ICONS.shield + '</span><div><b>No authority response yet.</b><p>Run the validation action to generate the ' + esc(cfg.system) + ' payload. The request and response will appear in the log beside this panel.</p></div></div>' + checklistHTML();
    }
    return '<div class="validation-panel"><div class="vp-head"><div style="width:1.9rem;height:1.9rem;border-radius:2px;background:var(--accent-soft);border:1px solid var(--accent-line);color:var(--accent-dark);display:grid;place-items:center;font-size:.55rem;font-weight:800">' + esc(cfg.authority) + '</div><div><h2>' + esc(cfg.system) + ' validation</h2><p>' + esc(cfg.authorityLong) + ' · sandbox connector</p></div><span class="spacer"></span>' + statusPill() + '</div><div class="vp-body">' + body + '</div><div class="vp-actions"><button class="btn btn-primary" type="button" data-action="validate">' + ICONS.shield + ' ' + (state.validated ? 'Re-validate' : esc(cfg.validation.action)) + '</button><button class="btn" type="button" data-action="print">' + ICONS.print + ' Print tax invoice</button></div></div>';
  }

  function logPanelHTML() {
    return '<div class="log-panel"><div class="log-head"><span class="tab" data-tablog="request">Request</span><span class="tab" data-tablog="response">Response</span><span class="tab" data-tablog="trace">Trace</span><span class="spacer">sandbox · ' + esc(cfg.country) + '</span></div><div class="log-body" id="logBodyTab"></div></div>';
  }

  function fiscalHistoryHTML() {
    if (!state.validated) {
      return '<div class="fiscal-history"><div class="fh-head">Fiscal history</div><table class="data-table"><tbody><tr><td style="color:var(--ac-muted)">No fiscal events yet. Validation will add the first entry.</td></tr></tbody></table></div>';
    }
    return '<div class="fiscal-history"><div class="fh-head">Fiscal history</div><table class="data-table"><thead><tr><th>Timestamp</th><th>Action</th><th>Result</th><th>Receipt</th></tr></thead><tbody><tr><td class="mono">17 Nov 2026 14:42:08</td><td>Invoice validation</td><td><span style="color:var(--ok);font-weight:600">Accepted</span></td><td class="mono">' + esc(cfg.validation.receipt.number) + '</td></tr></tbody></table></div>';
  }

  function fiscalTabHTML() {
    return '<div class="tab-panel" data-panel="fiscal" hidden><div class="form-panel fiscal-tab"><div class="fiscal-tab-grid">' + validationPanelHTML() + logPanelHTML() + '</div>' + fiscalHistoryHTML() + '</div></div>';
  }

  function tourHTML() {
    return '<div class="tour" id="tour" role="dialog" aria-live="polite"><div class="tour-top"><span class="tour-step" id="tourStepLabel">Step 1 of 5</span><button class="tour-skip" type="button" data-action="tour-skip">Skip tour</button></div><div class="tour-bar"><span id="tourBar"></span></div><p id="tourText"></p><div class="tour-actions"><button class="btn btn-sm" type="button" data-action="tour-prev">Back</button><span class="spacer"></span><button class="btn btn-sm btn-primary" type="button" data-action="tour-next" id="tourNext">Next</button></div></div>';
  }

  function welcomeHTML() {
    return '<div class="overlay" id="welcomeModal"><div class="modal welcome"><div class="modal-head"><div><h2>Walk through a real fiscalisation flow</h2><p>No sign-in. No real authority. Everything is fictional.</p></div><span class="spacer"></span><button class="modal-close" type="button" data-action="welcome-close" aria-label="Close">×</button></div><div class="modal-body">' +
      '<div class="flag-line"><span class="flag-big">' + flagImg(cfg.id, 'flag-big') + '</span><div><h2 style="font-size:1rem">' + esc(cfg.country) + ' · ' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</h2><div class="sub" style="font-size:.7rem;color:var(--muted)">' + esc(cfg.authorityLong) + ' sandbox</div></div></div>' +
      '<p>You are looking at a fictional invoice inside an Acumatica-style receivables screen. The validation action, the payload and the authority responses follow the shape of a real ' + esc(cfg.system) + ' integration — but every company, TIN, SKU, price and receipt below is invented.</p>' +
      '<div class="facts"><div class="fact"><b>Invoice</b>' + esc(cfg.invoice.no) + '</div><div class="fact"><b>Customer</b>' + esc(cfg.customer.name) + '</div><div class="fact"><b>Total</b>' + money(compute().total) + '</div><div class="fact"><b>Authority</b>' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</div></div>' +
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

  function render() {
    var c = compute();
    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="app">' +
        '<aside class="rail" id="rail">' +
          '<div class="rail-brand"><div class="rail-mark">NE</div><div class="rail-name">Nimbus ERP<small>Modern workspace</small></div></div>' +
          '<div class="rail-tenant"><button class="tenant-chip" type="button" data-toast="Tenant switching is disabled in this demo.">' + flagImg(cfg.id, 'flag-rail') + '<span><b>' + esc(cfg.company.name) + '</b><small>' + esc(cfg.company.licence) + '</small></span><span class="chev">▾</span></button></div>' +
          '<nav class="rail-nav">' +
            '<div class="rail-group">Workspace</div>' +
            '<a class="rail-link" href="#" data-nav="Home">' + ICONS.grid + ' Home</a>' +
            '<a class="rail-link active" href="#document-form">' + ICONS.invoice + ' Invoices <span class="badge">1</span></a>' +
            '<a class="rail-link" href="#" data-nav="Sales orders">' + ICONS.cart + ' Sales orders</a>' +
            '<a class="rail-link" href="#" data-nav="Purchases">' + ICONS.box + ' Purchases</a>' +
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
            '<span class="topbar-brand"><span class="tb-mark">NE</span>Nimbus <b>ERP</b></span>' +
            '<label class="top-search">' + ICONS.search + '<input type="search" placeholder="Search invoices, customers, items…" aria-label="Search"><kbd>⌘K</kbd></label>' +
            '<div class="top-actions">' +
              '<button class="icon-btn" type="button" aria-label="Help" data-toast="This is a fictional demo. No tax authority is contacted.">' + ICONS.help + '</button>' +
              '<button class="icon-btn" type="button" aria-label="Notifications" data-toast="No notifications in the demo sandbox.">' + ICONS.bell + '<span class="dot"></span></button>' +
              '<span class="top-divider"></span>' +
              '<button class="user-chip" type="button" data-toast="Signed in to a fictional sandbox tenant."><span class="avatar">' + brandInitials(cfg.invoice.salesperson.replace('.', '')) + '</span><span class="who"><b>' + esc(cfg.invoice.salesperson) + '</b><small>Finance administrator</small></span></button>' +
            '</div>' +
          '</header>' +
          '<div class="screen-shell">' +
            '<div class="screen-head">' +
              '<div class="crumb-bar"><a href="/demos/">Demos</a><span class="sep"> / </span><a href="/demos/">' + esc(cfg.country) + '</a><span class="sep"> / </span><span>' + esc(cfg.screen.module) + '</span><span class="sep"> / </span><span class="here">' + esc(cfg.screen.title) + '</span></div>' +
              '<div class="title-row"><div class="screen-title"><h1>' + esc(cfg.screen.title) + '</h1><span class="screen-id">' + esc(cfg.screen.id) + '</span><span class="status-pill ' + (state.validated ? 'ok' : 'pending') + '">' + (state.validated ? 'Fiscally validated' : 'Draft — not fiscalised') + '</span></div>' +
                '<div class="screen-actions">' +
                  '<button class="btn btn-ghost" type="button" data-toast="New invoices are disabled in the demo.">' + ICONS.plus + '<span class="lbl">New invoice</span></button>' +
                  '<button class="btn" type="button" data-toast="Draft saved locally in this browser session.">Save</button>' +
                  '<button class="btn" type="button" data-toast="Only the invoice screen is enabled in this sandbox.">Actions ' + ICONS.chev + '</button>' +
                  '<button class="btn btn-soft" type="button" data-action="print" id="printBtn" aria-label="Print tax invoice" title="Print tax invoice">' + ICONS.print + '<span class="lbl">Tax invoice</span></button>' +
                  '<button class="btn btn-primary" type="button" data-action="validate" id="validateBtn" aria-label="' + esc(cfg.validation.action) + '">' + ICONS.shield + '<span class="lbl">' + (state.validated ? 'Re-validate' : esc(cfg.validation.action)) + '</span></button>' +
                '</div>' +
              '</div>' +
              '<div class="tabbar" role="tablist">' +
                '<button class="tab' + (state.activeTab === 'document' ? ' active' : '') + '" data-tab="document" type="button">Document</button>' +
                '<button class="tab' + (state.activeTab === 'financial' ? ' active' : '') + '" data-tab="financial" type="button">Financial</button>' +
                '<button class="tab' + (state.activeTab === 'taxes' ? ' active' : '') + '" data-tab="taxes" type="button">Taxes</button>' +
                '<button class="tab' + (state.activeTab === 'applications' ? ' active' : '') + '" data-tab="applications" type="button">Applications</button>' +
                '<button class="tab' + (state.activeTab === 'fiscal' ? ' active' : '') + '" data-tab="fiscal" type="button">Fiscalisation <span class="tab-dot' + (state.validated ? ' ok' : '') + '"></span></button>' +
              '</div>' +
            '</div>' +
            '<main class="screen">' +
              '<div class="demo-banner"><b>Interactive sandbox.</b> ' + esc(cfg.country) + ' · ' + esc(cfg.authorityLong) + '. Every name, TIN, item and response is fictional. No live service is called.<span class="spacer"></span><span class="tag">DEMO</span><span class="banner-actions"><button class="btn btn-sm" type="button" data-action="tour">' + ICONS.play + ' Guided walkthrough</button><button class="btn btn-sm btn-ghost" type="button" data-action="reset">' + ICONS.reset + ' Reset</button></span></div>' +
              documentPanelHTML(c) +
              financialPanelHTML(c) +
              taxesPanelHTML(c) +
              applicationsPanelHTML() +
              fiscalTabHTML() +
            '</main>' +
            '<div class="demo-footer"><div class="demo-footer-inner"><span>Fictional sandbox built by <a href="/">John Kihiu</a>. No Acumatica, KRA, RRA, ZRA, TRA or ZIMRA system is contacted.</span><span class="spacer"></span><div class="footer-countries">' +
              Object.keys(window.ERP_DEMOS).map(function (k) {
                var d = window.ERP_DEMOS[k];
                return '<a class="' + (k === cfg.id ? 'active' : '') + '" href="/demos/' + (k === 'ke' ? 'kenya' : k === 'rw' ? 'rwanda' : k === 'zm' ? 'zambia' : k === 'tz' ? 'tanzania' : 'zimbabwe') + '/">' + flagImg(k, 'flag-sm') + ' ' + d.country + '</a>';
              }).join('') +
            '</div></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      tourHTML() + welcomeHTML() + validationModalHTML() + invoiceModalHTML() +
      '<div class="toast" id="toast" role="status"></div>';

    bind();
    applyTab();
    paintTabLog();
    if (window.__pendingTour) { window.__pendingTour = false; startTour(); }
  }

  function applyTab() {
    document.querySelectorAll('.tab[data-tab]').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === state.activeTab);
    });
    document.querySelectorAll('.tab-panel').forEach(function (p) {
      p.hidden = p.getAttribute('data-panel') !== state.activeTab;
    });
  }

  function bind(root) {
    root = root || document;
    root.querySelectorAll('[data-toast]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toast(el.getAttribute('data-toast'));
      });
    });
    root.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toast(el.getAttribute('data-nav') + ' is outside the scope of this sandbox demo. The invoice screen is fully interactive.');
      });
    });
    root.querySelectorAll('[data-tab]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.activeTab = el.getAttribute('data-tab');
        applyTab();
        paintTabLog();
      });
    });
    root.querySelectorAll('[data-tablog]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.logTab = el.getAttribute('data-tablog');
        document.querySelectorAll('[data-tablog]').forEach(function (t) { t.classList.toggle('active', t === el); });
        paintTabLog();
      });
    });
    root.querySelectorAll('[data-logtab]').forEach(function (el) {
      el.addEventListener('click', function () {
        state.logTab = el.getAttribute('data-logtab');
        document.querySelectorAll('[data-logtab]').forEach(function (t) { t.classList.toggle('active', t === el); });
        paintModalLog();
      });
    });
    root.querySelectorAll('[data-action]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var a = el.getAttribute('data-action');
        if (a === 'validate') runValidation();
        else if (a === 'print') openInvoice();
        else if (a === 'add') addLine();
        else if (a === 'reset') resetDemo();
        else if (a === 'tour') startTour();
        else if (a === 'tour-start') { closeWelcome(); startTour(); }
        else if (a === 'welcome-close') closeWelcome();
        else if (a === 'tour-skip') endTour();
        else if (a === 'tour-next') tourNext();
        else if (a === 'tour-prev') tourPrev();
        else if (a === 'validation-close') {
          closeOverlay('validationModal');
          if (state.validated) render();
        }
        else if (a === 'validation-results') {
          closeOverlay('validationModal');
          state.validated = true;
          state.activeTab = 'fiscal';
          render();
        }
        else if (a === 'invoice-close') closeOverlay('invoiceModal');
        else if (a === 'print-now') window.print();
      });
    });
    root.querySelectorAll('[data-qty]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var i = Number(inp.getAttribute('data-qty'));
        state.lines[i].qty = Math.max(0, Number(inp.value) || 0);
        if (state.validated) {
          state.validated = false;
          toast('Invoice changed. The previous fiscal receipt is now stale — re-validate.');
        }
        render();
      });
    });
    var menu = root.querySelector ? root.querySelector('#menuBtn') : null;
    if (menu) menu.addEventListener('click', function () { document.getElementById('rail').classList.toggle('open'); });
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

  function closeWelcome() { closeOverlay('welcomeModal'); }

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
    state.activeTab = 'document';
    state.logTab = 'request';
    state.traceLines = '';
    render();
    toast('Demo reset to the original fictional invoice.');
  }

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

  function paintModalLog() {
    var el = document.getElementById('logBody');
    if (!el) return;
    if (state.logTab === 'trace') el.innerHTML = state.traceLines || '<span class="ln">Waiting for validation…</span>';
    else if (state.logTab === 'request') el.textContent = JSON.stringify(cfg.validation.request, null, 2);
    else el.textContent = JSON.stringify(cfg.validation.response, null, 2);
  }

  function paintTabLog() {
    var el = document.getElementById('logBodyTab');
    if (!el) return;
    document.querySelectorAll('[data-tablog]').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-tablog') === state.logTab);
    });
    if (state.logTab === 'request') {
      el.textContent = JSON.stringify(cfg.validation.request, null, 2);
    } else if (state.logTab === 'response') {
      el.textContent = state.validated ? JSON.stringify(cfg.validation.response, null, 2) : 'No response yet. Run validation to submit the payload and receive the authority response.';
    } else {
      el.innerHTML = state.traceLines || '<div class="log-empty">No execution trace yet. Run validation to see the handshake, signing and submission steps.</div>';
    }
  }

  function refreshFiscalUI() {
    var body = document.getElementById('fiscalSectionBody');
    if (body) {
      body.innerHTML = fiscalSectionHTML();
      bind(body);
    }
    var oldTab = document.querySelector('.tab-panel[data-panel="fiscal"]');
    if (oldTab) {
      var temp = document.createElement('div');
      temp.innerHTML = fiscalTabHTML();
      var newNode = temp.firstChild;
      oldTab.parentNode.replaceChild(newNode, oldTab);
      bind(newNode);
    }
    document.querySelectorAll('.tab[data-tab="fiscal"] .tab-dot').forEach(function (d) { d.classList.add('ok'); });
    var st = document.querySelector('.screen-title .status-pill');
    if (st) { st.className = 'status-pill ok'; st.textContent = 'Fiscally validated'; }
    document.querySelectorAll('.form-group.fiscal .status-pill').forEach(function (s) { s.className = 'status-pill ok'; s.textContent = 'Validated'; });
    document.querySelectorAll('[data-action="validate"]').forEach(function (b) {
      if (b.classList.contains('btn-primary')) b.innerHTML = ICONS.shield + ' ' + (b.id === 'validateBtn' ? '<span class="lbl">Re-validate</span>' : 'Re-validate');
    });
    applyTab();
    paintTabLog();
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
    trace('session opened · device ' + cfg.validation.request.branchId, 'k');
    trace('payload version 2026.11 · ' + state.lines.length + ' lines · ' + cfg.invoice.currency, 'k');

    return (async function () {
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
        if (i === 0) cfg.validation.checks.forEach(function (c) { trace('  ✓ ' + c, 'g'); });
        if (i === 1) trace('  signed payload · ' + JSON.stringify(cfg.validation.request).length + ' bytes', 'g');
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
      refreshFiscalUI();
    })();
  }

  function openInvoice() {
    if (!state.validated) {
      toast('Validate the invoice first — a tax invoice needs a fiscal receipt number.');
      return;
    }
    var scroll = document.getElementById('printScroll');
    scroll.innerHTML = printDocHTML(compute());
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
      '<div class="pd-top"><div class="pd-brand"><div class="pd-mark">' + brandInitials(cfg.company.name) + '</div><div class="pd-company"><h1>' + esc(cfg.company.name) + '</h1><p>' + esc(cfg.company.branch) + ' · ' + esc(cfg.company.address) + '<br>' + esc(cfg.company.phone) + ' · ' + esc(cfg.company.email) + '</p></div></div><div class="pd-title"><h2>' + esc(cfg.print.docTitle) + '</h2><p>' + esc(cfg.print.subtitle) + '</p><span class="jur">' + flagImg(cfg.id) + ' ' + esc(cfg.authority) + ' ' + esc(cfg.system) + '</span></div></div>' +
      '<div class="pd-parties"><div class="pd-block"><h3>Seller</h3><strong>' + esc(cfg.company.name) + '</strong><p>' + esc(cfg.company.branch) + '<br>' + esc(cfg.company.address) + '</p><dl class="ids"><dt>' + esc(cfg.company.tinLabel) + '</dt><dd>' + esc(cfg.company.tin) + '</dd><dt>' + esc(cfg.company.vatLabel) + '</dt><dd>' + esc(cfg.company.vat) + '</dd></dl></div><div class="pd-block"><h3>Bill to</h3><strong>' + esc(cfg.customer.name) + '</strong><p>' + esc(cfg.customer.address) + '<br>' + esc(cfg.customer.contact) + '</p><dl class="ids"><dt>' + esc(cfg.customer.tinLabel) + '</dt><dd>' + esc(cfg.customer.tin) + '</dd><dt>Terms</dt><dd>' + esc(cfg.customer.terms) + '</dd></dl></div></div>' +
      '<div class="pd-meta"><div><dt>Invoice number</dt><dd class="mono">' + esc(cfg.invoice.no) + '</dd></div><div><dt>Invoice date</dt><dd>' + esc(cfg.invoice.date) + '</dd></div><div><dt>Due date</dt><dd>' + esc(cfg.invoice.due) + '</dd></div><div><dt>Currency</dt><dd>' + esc(cfg.invoice.currency) + '</dd></div><div><dt>Customer reference</dt><dd class="mono">' + esc(cfg.invoice.reference) + '</dd></div><div><dt>Salesperson</dt><dd>' + esc(cfg.invoice.salesperson) + '</dd></div><div><dt>Fiscal receipt</dt><dd class="mono">' + esc(v.receipt.number) + '</dd></div><div><dt>Receipt type</dt><dd>' + esc(cfg.print.docTitle.charAt(0) + cfg.print.docTitle.slice(1).toLowerCase()) + '</dd></div></div>' +
      '<table class="pd-lines"><thead><tr><th>#</th><th>Description</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Tax</th><th class="num">Amount</th></tr></thead><tbody>' + lineRows + '</tbody></table>' +
      '<div class="pd-summary"><div class="pd-tax"><table><thead><tr><th>Tax breakdown</th><th class="num">Taxable</th><th class="num">Tax</th></tr></thead><tbody>' + taxRows + '</tbody></table><div class="pd-note" style="border-top:0;padding-top:.35rem;margin-top:.2rem">Amount in words: <strong>' + esc(amountInWords(c.total)) + '</strong></div></div><div class="pd-totals"><div class="row"><span>Subtotal</span><span>' + money(c.subtotal, false) + '</span></div><div class="row"><span>Discount</span><span>−' + money(c.discount, false) + '</span></div><div class="row"><span>VAT</span><span>' + money(c.taxTotal, false) + '</span></div><div class="row grand"><span>Total due</span><span>' + money(c.total, false) + '</span></div></div></div>' +
      '<div class="pd-fiscal">' + cfg.print.fiscalLabels.map(function (f) { return '<div class="f' + (f[1].length > 18 ? ' mono' : '') + '"><h4>' + esc(f[0]) + '</h4><p>' + esc(f[1]) + '</p></div>'; }).join('') + '<div class="qr">' + qrSvg(v.receipt.qrSeed) + '</div></div>' +
      '<div class="pd-note"><strong>' + esc(cfg.print.note) + '</strong><br>Verification: ' + esc(v.receipt.verify) + '<br>This document is a fictional demo. It is not a valid tax invoice and must not be used for accounting, VAT or customs purposes.</div>' +
      '<div class="pd-foot"><span>' + esc(cfg.company.name) + ' · ' + esc(cfg.company.branch) + '</span><span>' + esc(cfg.invoice.no) + ' · Page 1 of 1</span></div>' +
    '</div>';
  }

  function tourTargets() {
    return ['document-form', 'invoice-lines', 'validateBtn', 'fiscal-section', 'printBtn'];
  }

  function startTour() {
    state.tourStep = 0;
    state.activeTab = 'document';
    applyTab();
    closeWelcome();
    var t = document.getElementById('tour');
    if (t) t.classList.add('open');
    paintTour();
  }

  function paintTour() {
    var total = cfg.tour.length;
    var idx = Math.min(state.tourStep, total - 1);
    var label = document.getElementById('tourStepLabel');
    if (!label) return;
    label.textContent = 'Step ' + (idx + 1) + ' of ' + total;
    document.getElementById('tourText').textContent = cfg.tour[idx];
    document.getElementById('tourBar').style.width = ((idx + 1) / total * 100) + '%';
    document.getElementById('tourNext').textContent = idx === total - 1 ? 'Finish' : 'Next';
    document.querySelector('[data-action="tour-prev"]').style.visibility = idx === 0 ? 'hidden' : 'visible';
    document.querySelectorAll('.spotlight').forEach(function (e) { e.classList.remove('spotlight'); });
    var target = document.getElementById(tourTargets()[idx]);
    if (target) {
      target.classList.add('spotlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function tourNext() {
    if (state.tourStep >= cfg.tour.length - 1) { endTour(); return; }
    state.tourStep++;
    paintTour();
  }

  function tourPrev() {
    if (state.tourStep === 0) return;
    state.tourStep--;
    paintTour();
  }

  function endTour() {
    document.querySelectorAll('.spotlight').forEach(function (e) { e.classList.remove('spotlight'); });
    var t = document.getElementById('tour');
    if (t) t.classList.remove('open');
    state.tourStep = 0;
  }

  render();
  var params = new URLSearchParams(location.search);
  if (params.get('validated') === '1') {
    state.validated = true;
    state.activeTab = params.get('tab') || 'document';
    render();
  }
  if (params.get('welcome') !== '0') {
    setTimeout(function () {
      var w = document.getElementById('welcomeModal');
      if (w) w.classList.add('open');
    }, 450);
  }
  if (params.get('autovalidate') === '1') setTimeout(runValidation, 500);
  if (params.get('print') === '1') {
    setTimeout(function () {
      if (!state.validated) {
        state.validated = true;
        refreshFiscalUI();
      }
      openInvoice();
    }, 700);
  }
})();
