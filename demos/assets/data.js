/* Fiscalisation demo data — every company, person, TIN, SKU, price and
   authority response below is fictional. No live tax authority is contacted. */
(function () {
  'use strict';

  var DEMOS = {
    ke: {
      id: 'ke',
      country: 'Kenya',
      flag: '🇰🇪',
      authority: 'KRA',
      authorityLong: 'Kenya Revenue Authority',
      system: 'eTIMS',
      systemLong: 'Electronic Tax Invoice Management System',
      accent: '#0B6B53',
      accentDark: '#075141',
      accentSoft: '#E7F2EE',
      accentLine: '#B9D9CF',
      layout: 'split',
      customPlacement: 'header',
      screen: { module: 'Sales', group: 'Receivables', title: 'Invoices', id: 'AR-3010' },
      company: {
        name: 'Mwangaza Trading Ltd',
        branch: 'Nairobi — Industrial Area',
        address: 'Plot 14, Enterprise Road, Nairobi 00500, Kenya',
        tinLabel: 'PIN',
        tin: 'P051234567X',
        vatLabel: 'VAT No.',
        vat: 'P051234567X',
        phone: '+254 20 555 0142',
        email: 'accounts@mwangaza.example',
        licence: 'Demo tenant · KE-04'
      },
      customer: {
        name: 'Tembo Retail Group Ltd',
        tinLabel: 'Customer PIN',
        tin: 'P051987654Y',
        address: 'Karen Business Park, Nairobi 00100, Kenya',
        contact: 'A. Wanjiku · ap@temboretail.example',
        terms: 'Net 30'
      },
      invoice: {
        no: 'INV-2026-004182',
        date: '17 Nov 2026',
        due: '17 Dec 2026',
        currency: 'KES',
        locale: 'en-KE',
        decimals: 2,
        reference: 'PO-TRG-88214',
        salesperson: 'J. Mwangi',
        location: 'Nairobi — Industrial Area',
        priceList: 'Wholesale — Trade',
        project: '—'
      },
      custom: [
        { label: 'Customer PIN', value: 'P051987654Y', mono: true },
        { label: 'eTIMS Invoice No.', value: 'Assigned on validation', id: 'fiscalInvoice' },
        { label: 'Control Unit No.', value: 'KRA-CU-2026-0193', mono: true },
        { label: 'Receipt Type', value: 'Normal tax invoice' }
      ],
      lineMeta: 'Item class',
      lines: [
        { sku: 'SLR-INV-5K', desc: 'Hybrid solar inverter, 5 kW', cls: '8517.62.00', qty: 4, uom: 'PCS', price: 92500, disc: 0, tax: 'VAT 16% (A)', rate: 16 },
        { sku: 'BAT-LI-48', desc: 'Lithium battery module, 48 V / 100 Ah', cls: '8507.60.00', qty: 6, uom: 'PCS', price: 48000, disc: 2, tax: 'VAT 16% (A)', rate: 16 },
        { sku: 'MNT-RAIL-AL', desc: 'Mounting rail set, anodised aluminium', cls: '7616.99.90', qty: 6, uom: 'SET', price: 7800, disc: 0, tax: 'VAT 16% (A)', rate: 16 },
        { sku: 'LED-IND-150', desc: 'Industrial LED high-bay, 150 W', cls: '9405.42.00', qty: 10, uom: 'PCS', price: 6200, disc: 5, tax: 'VAT 16% (A)', rate: 16 },
        { sku: 'SVC-COMM-01', desc: 'Installation and commissioning service', cls: '9954.90.00', qty: 1, uom: 'JOB', price: 35000, disc: 0, tax: 'VAT 16% (A)', rate: 16 }
      ],
      validation: {
        action: 'Validate with KRA eTIMS',
        short: 'eTIMS',
        steps: [
          { title: 'Pre-flight checks', detail: 'Branch, item classification, customer PIN and tax codes verified against the fiscal register.', ms: 650 },
          { title: 'Signing payload', detail: 'Invoice payload signed with the tenant control-unit certificate.', ms: 700 },
          { title: 'Submitting to KRA sandbox', detail: 'Signed JSON posted to the eTIMS virtual sales control endpoint.', ms: 900 },
          { title: 'Authority acceptance', detail: 'KRA returned an acceptance code and fiscal receipt reference.', ms: 800 },
          { title: 'Storing response', detail: 'Receipt number, signature and QR payload written back to the invoice.', ms: 500 }
        ],
        checks: [
          'Branch mapped to control unit KRA-CU-2026-0193',
          '5 of 5 stock items carry an item classification code',
          'Customer PIN P051987654Y passes format check',
          'VAT 16% maps to eTIMS tax type A',
          'Invoice currency KES supported by the device'
        ],
        fields: [
          { label: 'eTIMS result', value: 'VALIDATED', tone: 'ok' },
          { label: 'Result message', value: 'Invoice accepted by KRA sandbox', wide: true },
          { label: 'Validation date', value: '17 Nov 2026 14:42:08 EAT' },
          { label: 'eTIMS invoice no.', value: 'KE2-0012-00004182', mono: true },
          { label: 'Control unit no.', value: 'KRA-CU-2026-0193', mono: true },
          { label: 'Receipt signature', value: 'H8sQ2m4Yx9Lp7Tn1Vb6Kc3Rw5Jd0Fa2Ue8Gi4No6Pq=', mono: true, wide: true, truncate: true },
          { label: 'Receipt type', value: 'Normal tax invoice' },
          { label: 'Original receipt', value: '—' }
        ],
        receipt: {
          number: 'KE2-0012-00004182',
          secondary: 'Control unit KRA-CU-2026-0193',
          verify: 'https://sandbox.kra.example/verify?cu=KE2-0012-00004182',
          qrSeed: 719431,
          signature: 'H8sQ2m4Yx9Lp7Tn1Vb6Kc3Rw5Jd0Fa2Ue8Gi4No6Pq='
        },
        request: {
          invoiceNumber: 'INV-2026-004182',
          customerPin: 'P051987654Y',
          branchId: 'KE-NRB-IND',
          currency: 'KES',
          documentType: 'NORMAL',
          taxType: 'A',
          totals: { taxable: 795650, tax: 127304, total: 922954 },
          items: [
            { itemCd: 'SLR-INV-5K', qty: 4, prc: 92500, taxTyCd: 'A' },
            { itemCd: 'BAT-LI-48', qty: 6, prc: 48000, taxTyCd: 'A' }
          ]
        },
        response: {
          resultCd: '000',
          resultMsg: 'SUCCESS',
          rcptNo: '004182',
          intrlData: 'KE2-0012-00004182',
          rcptSign: 'H8sQ2m4Yx9Lp7Tn1Vb6Kc3Rw5Jd0Fa2Ue8Gi4No6Pq=',
          sdcId: 'KRA-CU-2026-0193',
          mrcNo: 'KRA-SDC-NRB-0012',
          tvDate: '20261117144208'
        }
      },
      print: {
        variant: 'ke',
        docTitle: 'TAX INVOICE',
        subtitle: 'Fiscal tax invoice issued through KRA eTIMS',
        note: 'Payment is due within 30 days. Quote the invoice number on all remittances.',
        fiscalLabels: [
          ['Fiscal receipt', 'KE2-0012-00004182'],
          ['Control unit', 'KRA-CU-2026-0193'],
          ['Signature', 'H8sQ2m4Yx9Lp7Tn1Vb6Kc…']
        ]
      },
      tour: [
        'This is the invoice header. Customer PIN, branch and the control unit are the fields KRA checks first.',
        'Every line needs an item classification code and a mapped tax type. Change a quantity and the tax recalculates.',
        'Now run Validate. The demo walks through the same five stages a production eTIMS call goes through.',
        'The fiscal panel now holds the KRA receipt number, control unit, signature and QR payload.',
        'Print the tax invoice to see the layout a finance team hands to the customer.'
      ]
    },

    rw: {
      id: 'rw',
      country: 'Rwanda',
      flag: '🇷🇼',
      authority: 'RRA',
      authorityLong: 'Rwanda Revenue Authority',
      system: 'VSDC',
      systemLong: 'Virtual Sales Data Controller',
      accent: '#0E7490',
      accentDark: '#155E75',
      accentSoft: '#E6F4F7',
      accentLine: '#B6DDE5',
      layout: 'wide',
      customPlacement: 'section',
      screen: { module: 'Sales', group: 'Receivables', title: 'Invoices', id: 'AR-3010' },
      company: {
        name: 'Kigali Highlands Supply Ltd',
        branch: 'Kigali — Gikondo',
        address: 'KG 7 Ave, Gikondo, Kigali, Rwanda',
        tinLabel: 'TIN',
        tin: '102345678',
        vatLabel: 'VAT No.',
        vat: '102345678',
        phone: '+250 788 555 018',
        email: 'finance@kigalihighlands.example',
        licence: 'Demo tenant · RW-11'
      },
      customer: {
        name: 'Amahoro Hotels Ltd',
        tinLabel: 'Customer TIN',
        tin: '103876542',
        address: 'KN 3 Rd, Nyarugenge, Kigali, Rwanda',
        contact: 'C. Uwase · accounts@amahorohotels.example',
        terms: 'Net 15'
      },
      invoice: {
        no: 'INV-RW-2026-0184',
        date: '17 Nov 2026',
        due: '02 Dec 2026',
        currency: 'RWF',
        locale: 'en-RW',
        decimals: 0,
        reference: 'LPO-AHL-4471',
        salesperson: 'P. Niyonsaba',
        location: 'Kigali — Gikondo',
        priceList: 'Trade — Rwanda',
        project: '—'
      },
      custom: [
        { label: 'Customer TIN', value: '103876542', mono: true },
        { label: 'RRA invoice no.', value: 'Assigned on validation', id: 'fiscalInvoice' },
        { label: 'SDC ID', value: 'RRA-SDC-10294', mono: true },
        { label: 'Receipt type', value: 'Normal invoice' },
        { label: 'Original receipt no.', value: '—' }
      ],
      lineMeta: 'Classification',
      lines: [
        { sku: 'CEM-425-50', desc: 'Portland cement, 42.5R — 50 kg bag', cls: '2523.29.00', qty: 200, uom: 'BAG', price: 8500, disc: 0, tax: 'VAT 18% (A)', rate: 18 },
        { sku: 'STL-12MM', desc: 'Deformed steel bar, 12 mm — 12 m', cls: '7214.20.00', qty: 120, uom: 'BAR', price: 14200, disc: 3, tax: 'VAT 18% (A)', rate: 18 },
        { sku: 'PLY-MRN-18', desc: 'Marine plywood, 18 mm — 2.4 × 1.2 m', cls: '4412.31.00', qty: 40, uom: 'SHT', price: 28500, disc: 0, tax: 'VAT 18% (A)', rate: 18 },
        { sku: 'TRN-KGL-01', desc: 'Delivery — Kigali metropolitan area', cls: '9965.12.00', qty: 1, uom: 'TRIP', price: 45000, disc: 0, tax: 'VAT 18% (A)', rate: 18 }
      ],
      validation: {
        action: 'Validate with RRA VSDC',
        short: 'VSDC',
        steps: [
          { title: 'VSDC handshake', detail: 'Terminal identity and branch certificate checked against the RRA device register.', ms: 600 },
          { title: 'Payload assembled', detail: 'Header, customer TIN, line classifications and VAT groups serialised.', ms: 650 },
          { title: 'Queued for transmission', detail: 'Invoice placed in the offline-safe outbox and signed for submission.', ms: 700 },
          { title: 'RRA acknowledgement', detail: 'VSDC accepted the invoice and returned its fiscal receipt block.', ms: 850 },
          { title: 'Reconciled locally', detail: 'Receipt total matched to the invoice total; response archived in the fiscal log.', ms: 500 }
        ],
        checks: [
          'Branch Gikondo mapped to SDC RRA-SDC-10294',
          'Customer TIN 103876542 passes RRA checksum',
          'All 4 line items carry a classification code',
          'VAT 18% grouped correctly for the VSDC payload',
          'Device queue empty — online submission available'
        ],
        fields: [
          { label: 'VSDC result', value: 'VALIDATED', tone: 'ok' },
          { label: 'Result message', value: 'Invoice accepted by RRA sandbox', wide: true },
          { label: 'RRA invoice no.', value: '000184', mono: true },
          { label: 'SDC ID', value: 'RRA-SDC-10294', mono: true },
          { label: 'Validation date', value: '17 Nov 2026 14:39:51 CAT' },
          { label: 'Receipt signature', value: 'K2yR7mQp4Lx8TdV1Nb6Fc3Wz5Hd0Ja9Ue2Gi7No4Pq=', mono: true, wide: true, truncate: true },
          { label: 'Receipt type', value: 'Normal invoice' },
          { label: 'Original receipt no.', value: '—' }
        ],
        receipt: {
          number: '000184',
          secondary: 'SDC RRA-SDC-10294',
          verify: 'https://sandbox.rra.example/verify?rcpt=000184',
          qrSeed: 228417,
          signature: 'K2yR7mQp4Lx8TdV1Nb6Fc3Wz5Hd0Ja9Ue2Gi7No4Pq='
        },
        request: {
          invoiceNumber: 'INV-RW-2026-0184',
          customerTin: '103876542',
          branchId: 'RW-KGL-GIK',
          currency: 'RWF',
          documentType: 'NORMAL',
          totals: { taxable: 4049200, tax: 728856, total: 4778056 },
          items: [
            { itemCd: 'CEM-425-50', qty: 200, prc: 8500, taxTyCd: 'A' },
            { itemCd: 'STL-12MM', qty: 120, prc: 14200, taxTyCd: 'A' }
          ]
        },
        response: {
          resultCd: '000',
          resultMsg: 'SUCCESS',
          rcptNo: '000184',
          sdcId: 'RRA-SDC-10294',
          rcptSign: 'K2yR7mQp4Lx8TdV1Nb6Fc3Wz5Hd0Ja9Ue2Gi7No4Pq=',
          qrCode: 'RRA|000184|RRA-SDC-10294|20261117143951',
          tvDate: '20261117143951'
        }
      },
      print: {
        variant: 'rw',
        docTitle: 'FACTURE FISCALE',
        subtitle: 'Tax invoice validated through the RRA VSDC',
        note: 'Payment due within 15 days. Bank transfer reference must quote the invoice number.',
        fiscalLabels: [
          ['RRA receipt', '000184'],
          ['SDC ID', 'RRA-SDC-10294'],
          ['Signature', 'K2yR7mQp4Lx8TdV1Nb6Fc…']
        ]
      },
      tour: [
        'Rwanda places the fiscal fields in their own band under the header. Note the customer TIN and SDC ID.',
        'The VSDC payload is built from these lines. Classification codes are mandatory for RRA.',
        'Run Validate. The demo shows the handshake, queue, acknowledgement and reconciliation stages.',
        'The RRA receipt number, signature and QR payload are written back to the invoice.',
        'Open the fiscal invoice layout. It is the document the customer receives.'
      ]
    },

    zm: {
      id: 'zm',
      country: 'Zambia',
      flag: '🇿🇲',
      authority: 'ZRA',
      authorityLong: 'Zambia Revenue Authority',
      system: 'Smart Invoice',
      systemLong: 'Smart Invoice via Virtual Sales Data Controller',
      accent: '#A16207',
      accentDark: '#854D0E',
      accentSoft: '#FBF3E2',
      accentLine: '#E8D2A6',
      layout: 'split',
      customPlacement: 'side',
      screen: { module: 'Sales', group: 'Receivables', title: 'Invoices', id: 'AR-3010' },
      company: {
        name: 'Copperbelt Merchants Ltd',
        branch: 'Kitwe — Industrial',
        address: 'Chibuluma Road, Kitwe 10101, Zambia',
        tinLabel: 'TPIN',
        tin: '1002345678',
        vatLabel: 'VAT No.',
        vat: '1002345678',
        phone: '+260 212 555 014',
        email: 'accounts@copperbeltmerchants.example',
        licence: 'Demo tenant · ZM-07'
      },
      customer: {
        name: 'Zambezi Retail Ltd',
        tinLabel: 'Customer TPIN',
        tin: '1007654321',
        address: 'Great East Road, Lusaka 10101, Zambia',
        contact: 'M. Banda · finance@zambeziretail.example',
        terms: 'Net 30'
      },
      invoice: {
        no: 'INV-ZM-2026-00931',
        date: '17 Nov 2026',
        due: '17 Dec 2026',
        currency: 'ZMW',
        locale: 'en-ZM',
        decimals: 2,
        reference: 'PO-ZRL-19042',
        salesperson: 'T. Mulenga',
        location: 'Kitwe — Industrial',
        priceList: 'Trade — Copperbelt',
        project: '—'
      },
      custom: [
        { label: 'Customer TPIN', value: '1007654321', mono: true },
        { label: 'ZRA receipt no.', value: 'Assigned on validation', id: 'fiscalInvoice' },
        { label: 'Sales type', value: '1 — Normal sales invoice' },
        { label: 'Payment type', value: 'Cash' },
        { label: 'Sales category', value: 'Standard' },
        { label: 'Receipt code', value: 'ZRA-RCP-00931', mono: true }
      ],
      lineMeta: 'Product code',
      lines: [
        { sku: 'CU-CBL-25', desc: 'Copper cable, 2.5 mm² — 100 m drum', cls: '8544.49.00', qty: 20, uom: 'DRUM', price: 1850, disc: 0, tax: 'VAT 16% (S)', rate: 16 },
        { sku: 'TRF-100KVA', desc: 'Distribution transformer, 100 kVA', cls: '8504.21.00', qty: 1, uom: 'PCS', price: 48500, disc: 0, tax: 'VAT 16% (S)', rate: 16 },
        { sku: 'MCB-63A', desc: 'Miniature circuit breaker, 63 A', cls: '8536.20.00', qty: 40, uom: 'PCS', price: 320, disc: 2, tax: 'VAT 16% (S)', rate: 16 },
        { sku: 'LMP-SOL-60', desc: 'Solar street light, 60 W integrated', cls: '9405.40.00', qty: 12, uom: 'PCS', price: 2100, disc: 0, tax: 'VAT 16% (S)', rate: 16 },
        { sku: 'SVC-FLD-01', desc: 'Field inspection and testing', cls: '9954.90.00', qty: 1, uom: 'JOB', price: 4800, disc: 0, tax: 'VAT 16% (S)', rate: 16 }
      ],
      validation: {
        action: 'Validate with ZRA Smart Invoice',
        short: 'Smart Invoice',
        steps: [
          { title: 'VSDC session opened', detail: 'Device ZRA-VSDC-4471 authenticated against the Smart Invoice sandbox.', ms: 600 },
          { title: 'Invoice mapped', detail: 'Sales type, payment type, product codes and sales category resolved.', ms: 650 },
          { title: 'Submitted to ZRA', detail: 'Signed invoice transmitted through the VSDC bridge.', ms: 900 },
          { title: 'Smart Invoice accepted', detail: 'ZRA returned a receipt number, signature and verification QR.', ms: 800 },
          { title: 'Response posted', detail: 'Fiscal fields and raw payload logged against the invoice.', ms: 500 }
        ],
        checks: [
          'Branch Kitwe mapped to VSDC ZRA-VSDC-4471',
          'Sales type 1 (normal) selected',
          'All 5 products have a ZRA product code',
          'Customer TPIN 1007654321 passes format check',
          'Stock in/out type matches a sales invoice'
        ],
        fields: [
          { label: 'Smart Invoice result', value: 'VALIDATED', tone: 'ok' },
          { label: 'Result message', value: 'Invoice accepted by ZRA sandbox', wide: true },
          { label: 'ZRA receipt no.', value: 'ZRA-RCP-00931', mono: true },
          { label: 'VSDC receipt no.', value: '00931', mono: true },
          { label: 'Validation date', value: '17 Nov 2026 14:44:19 CAT' },
          { label: 'Receipt signature', value: 'P4nL8vR2xQ7mT1bK6cW3zH5dJ0fU9eGi4No8Pq2Rw=', mono: true, wide: true, truncate: true },
          { label: 'Sales type', value: '1 — Normal sales invoice' },
          { label: 'Payment type', value: 'Cash' }
        ],
        receipt: {
          number: 'ZRA-RCP-00931',
          secondary: 'VSDC ZRA-VSDC-4471',
          verify: 'https://sandbox.zra.example/verify?rcpt=00931',
          qrSeed: 911735,
          signature: 'P4nL8vR2xQ7mT1bK6cW3zH5dJ0fU9eGi4No8Pq2Rw='
        },
        request: {
          invoiceNumber: 'INV-ZM-2026-00931',
          customerTpin: '1007654321',
          branchId: 'ZM-KTW-IND',
          currency: 'ZMW',
          salesType: '1',
          paymentType: 'CASH',
          totals: { taxable: 112426, tax: 17988, total: 130414 },
          items: [
            { itemCd: 'CU-CBL-25', qty: 20, prc: 1850, taxTyCd: 'S' },
            { itemCd: 'TRF-100KVA', qty: 1, prc: 48500, taxTyCd: 'S' }
          ]
        },
        response: {
          resultCd: '000',
          resultMsg: 'SUCCESS',
          rcptNo: '00931',
          sdcId: 'ZRA-VSDC-4471',
          rcptSign: 'P4nL8vR2xQ7mT1bK6cW3zH5dJ0fU9eGi4No8Pq2Rw=',
          qrCode: 'ZRA|00931|ZRA-VSDC-4471|20261117144419',
          tvDate: '20261117144419'
        }
      },
      print: {
        variant: 'zm',
        docTitle: 'TAX INVOICE',
        subtitle: 'Smart Invoice issued through the ZRA VSDC',
        note: 'Goods remain the property of the seller until paid in full. Retain this fiscal invoice for VAT input claims.',
        fiscalLabels: [
          ['ZRA receipt', 'ZRA-RCP-00931'],
          ['VSDC device', 'ZRA-VSDC-4471'],
          ['Signature', 'P4nL8vR2xQ7mT1bK6cW…']
        ]
      },
      tour: [
        'Zambia adds sales type, payment type and sales category to the header. These drive the ZRA payload.',
        'Each product also carries a ZRA product code, shown under the description.',
        'Run Validate to follow the VSDC session, mapping, submission and acceptance stages.',
        'The ZRA receipt, VSDC receipt and signature are now attached to the document.',
        'Print the tax invoice to inspect the customer-facing layout.'
      ]
    },

    tz: {
      id: 'tz',
      country: 'Tanzania',
      flag: '🇹🇿',
      authority: 'TRA',
      authorityLong: 'Tanzania Revenue Authority',
      system: 'VFD',
      systemLong: 'Virtual Fiscal Device',
      accent: '#7E22CE',
      accentDark: '#581C87',
      accentSoft: '#F4EAFB',
      accentLine: '#DDC6EF',
      layout: 'compact',
      customPlacement: 'section',
      screen: { module: 'Sales', group: 'Receivables', title: 'Invoices', id: 'AR-3010' },
      company: {
        name: 'Kilimanjaro Retail Group Ltd',
        branch: 'Dar es Salaam — Mikocheni',
        address: 'Plot 22, Mikocheni Light Industrial Area, Dar es Salaam, Tanzania',
        tinLabel: 'TIN',
        tin: '123-456-789',
        vatLabel: 'VAT No.',
        vat: '123-456-789',
        phone: '+255 22 555 0192',
        email: 'finance@kilimanjaroretail.example',
        licence: 'Demo tenant · TZ-09'
      },
      customer: {
        name: 'Serengeti Hospitality Ltd',
        tinLabel: 'Customer TIN',
        tin: '987-654-321',
        address: 'Nyerere Road, Arusha, Tanzania',
        contact: 'S. Mushi · ap@serengetihospitality.example',
        terms: 'Net 30'
      },
      invoice: {
        no: 'INV-TZ-2026-04512',
        date: '17 Nov 2026',
        due: '17 Dec 2026',
        currency: 'TZS',
        locale: 'en-TZ',
        decimals: 0,
        reference: 'PO-SHL-77410',
        salesperson: 'H. Mwakalinga',
        location: 'Dar es Salaam — Mikocheni',
        priceList: 'Wholesale — Tanzania',
        project: '—'
      },
      custom: [
        { label: 'Customer TIN', value: '987-654-321', mono: true },
        { label: 'EFD receipt no.', value: 'Assigned on validation', id: 'fiscalInvoice' },
        { label: 'e-Payment channel', value: 'M-Pesa' },
        { label: 'e-Payment reference', value: 'MP-7721-4410', mono: true },
        { label: 'EFD serial', value: 'EFD-02-118742', mono: true }
      ],
      lineMeta: 'Tax code',
      lines: [
        { sku: 'RICE-25KG', desc: 'Premium rice, 25 kg bag', cls: '1006.30.00', qty: 150, uom: 'BAG', price: 62000, disc: 0, tax: 'VAT 18% (A)', rate: 18 },
        { sku: 'OIL-20L', desc: 'Sunflower cooking oil, 20 L jerrycan', cls: '1512.19.00', qty: 80, uom: 'JCN', price: 48000, disc: 2, tax: 'VAT 18% (A)', rate: 18 },
        { sku: 'SUG-50KG', desc: 'Refined sugar, 50 kg bag', cls: '1701.99.00', qty: 60, uom: 'BAG', price: 128000, disc: 0, tax: 'VAT 18% (A)', rate: 18 },
        { sku: 'PKG-CRTN', desc: 'Packaging cartons — bundle of 25', cls: '4819.10.00', qty: 40, uom: 'BND', price: 12500, disc: 0, tax: 'VAT 18% (A)', rate: 18 },
        { sku: 'FRT-DSM-DOD', desc: 'Freight — Dar es Salaam to Dodoma', cls: '9965.12.00', qty: 1, uom: 'TRIP', price: 850000, disc: 0, tax: 'VAT 18% (A)', rate: 18 }
      ],
      validation: {
        action: 'Validate with TRA VFD',
        short: 'VFD',
        steps: [
          { title: 'VFD terminal online', detail: 'EFD serial EFD-02-118742 reported ready to the TRA sandbox.', ms: 600 },
          { title: 'Receipt formatted', detail: 'Header, line tax codes and e-payment reference assembled into the VFD receipt.', ms: 650 },
          { title: 'Transmitted to TRA', detail: 'Receipt submitted over the virtual fiscal device channel.', ms: 900 },
          { title: 'Verification code issued', detail: 'TRA returned the receipt number, verification code and QR payload.', ms: 800 },
          { title: 'Receipt stored', detail: 'Fiscal receipt linked to the invoice and queued for printing.', ms: 500 }
        ],
        checks: [
          'Branch Mikocheni mapped to EFD serial EFD-02-118742',
          'Customer TIN 987-654-321 passes TRA format check',
          'All 5 lines carry a TRA tax code',
          'e-Payment reference captured for reconciliation',
          'VFD terminal is online'
        ],
        fields: [
          { label: 'VFD result', value: 'VALIDATED', tone: 'ok' },
          { label: 'Result message', value: 'Receipt accepted by TRA sandbox', wide: true },
          { label: 'EFD receipt no.', value: '04512', mono: true },
          { label: 'Verification code', value: '8F2A-91CD-7E30', mono: true },
          { label: 'EFD serial', value: 'EFD-02-118742', mono: true },
          { label: 'Validation date', value: '17 Nov 2026 14:47:02 EAT' },
          { label: 'e-Payment ref.', value: 'MP-7721-4410', mono: true },
          { label: 'Receipt signature', value: 'T7wQ2mK9xL4pR1dV8bN6cF3zH5jU0eGa7No2Pq4Rw=', mono: true, wide: true, truncate: true }
        ],
        receipt: {
          number: '04512',
          secondary: 'EFD serial EFD-02-118742',
          verify: 'https://sandbox.tra.example/verify?rcpt=04512&code=8F2A91CD7E30',
          qrSeed: 334098,
          signature: 'T7wQ2mK9xL4pR1dV8bN6cF3zH5jUeGa7No2Pq4Rw='
        },
        request: {
          invoiceNumber: 'INV-TZ-2026-04512',
          customerTin: '987-654-321',
          branchId: 'TZ-DSM-MIK',
          currency: 'TZS',
          paymentChannel: 'MPESA',
          paymentRef: 'MP-7721-4410',
          totals: { taxable: 24900000, tax: 4482000, total: 29382000 },
          items: [
            { itemCd: 'RICE-25KG', qty: 150, prc: 62000, taxTyCd: 'A' },
            { itemCd: 'FRT-DSM-DOD', qty: 1, prc: 850000, taxTyCd: 'A' }
          ]
        },
        response: {
          resultCd: '000',
          resultMsg: 'SUCCESS',
          receiptNo: '04512',
          verificationCode: '8F2A-91CD-7E30',
          efdSerial: 'EFD-02-118742',
          rcptSign: 'T7wQ2mK9xL4pR1dV8bN6cF3zH5jUeGa7No2Pq4Rw=',
          qrCode: 'TRA|04512|EFD-02-118742|20261117144702',
          tvDate: '20261117144702'
        }
      },
      print: {
        variant: 'tz',
        docTitle: 'FISCAL RECEIPT',
        subtitle: 'Tax invoice issued through a TRA virtual fiscal device',
        note: 'This receipt is machine-generated. Verify the code above on the TRA verification service.',
        fiscalLabels: [
          ['EFD receipt', '04512'],
          ['Verification', '8F2A-91CD-7E30'],
          ['EFD serial', 'EFD-02-118742']
        ]
      },
      tour: [
        'Tanzania groups payment and EFD details together. The e-payment reference is captured before validation.',
        'Line tax codes are mandatory. Change a quantity and the VAT and totals update immediately.',
        'Run Validate to step through the VFD handshake, transmission and verification-code issue.',
        'The receipt number, verification code and EFD serial are now stored on the invoice.',
        'Print the fiscal receipt layout customers receive in Tanzania.'
      ]
    },

    zw: {
      id: 'zw',
      country: 'Zimbabwe',
      flag: '🇿🇼',
      authority: 'ZIMRA',
      authorityLong: 'Zimbabwe Revenue Authority',
      system: 'FDMS',
      systemLong: 'Fiscalisation Data Management System',
      accent: '#B91C1C',
      accentDark: '#991B1B',
      accentSoft: '#FBEAEA',
      accentLine: '#EFC4C4',
      layout: 'wide',
      customPlacement: 'section',
      screen: { module: 'Sales', group: 'Receivables', title: 'Invoices', id: 'AR-3010' },
      company: {
        name: 'Matobo Distributors (Pvt) Ltd',
        branch: 'Harare — Msasa',
        address: '14 Kelvin Road North, Msasa, Harare, Zimbabwe',
        tinLabel: 'BP No.',
        tin: '2001234567',
        vatLabel: 'VAT No.',
        vat: '2001234567',
        phone: '+263 24 255 5017',
        email: 'accounts@matobodist.example',
        licence: 'Demo tenant · ZW-03'
      },
      customer: {
        name: 'Great Zimbabwe Hotels (Pvt) Ltd',
        tinLabel: 'Customer BP No.',
        tin: '2007654321',
        address: 'Jason Moyo Avenue, Harare, Zimbabwe',
        contact: 'R. Chikafu · finance@gzhotels.example',
        terms: 'Net 30'
      },
      invoice: {
        no: 'INV-ZW-2026-00777',
        date: '17 Nov 2026',
        due: '17 Dec 2026',
        currency: 'USD',
        locale: 'en-US',
        decimals: 2,
        reference: 'PO-GZH-55108',
        salesperson: 'L. Moyo',
        location: 'Harare — Msasa',
        priceList: 'Trade — USD',
        project: '—'
      },
      custom: [
        { label: 'Customer BP No.', value: '2007654321', mono: true },
        { label: 'ZIMRA receipt ID', value: 'Assigned on validation', id: 'fiscalInvoice' },
        { label: 'Device ID', value: 'ZIMRA-DEV-4471', mono: true },
        { label: 'Fiscal day', value: 'Day 318 — open' },
        { label: 'Receipt type', value: 'Fiscal tax invoice' },
        { label: 'Operation ID', value: 'OP-20261117-0777', mono: true }
      ],
      lineMeta: 'HS code',
      lines: [
        { sku: 'MZE-25KG', desc: 'Maize meal, 25 kg bag', cls: '1102.20.00', qty: 100, uom: 'BAG', price: 14.5, disc: 0, tax: 'VAT 15% (S)', rate: 15 },
        { sku: 'ELEC-FIT-KIT', desc: 'Electrical fittings kit — commercial', cls: '8536.69.00', qty: 25, uom: 'KIT', price: 86, disc: 2, tax: 'VAT 15% (S)', rate: 15 },
        { sku: 'SOL-PMP-15', desc: 'Solar borehole pump, 1.5 kW', cls: '8413.70.00', qty: 4, uom: 'PCS', price: 620, disc: 0, tax: 'VAT 15% (S)', rate: 15 },
        { sku: 'TNK-5000L', desc: 'Water storage tank, 5,000 L', cls: '3925.10.00', qty: 6, uom: 'PCS', price: 210, disc: 0, tax: 'VAT 15% (S)', rate: 15 },
        { sku: 'SVC-SITE-01', desc: 'Site assessment and installation', cls: '9954.90.00', qty: 1, uom: 'JOB', price: 350, disc: 0, tax: 'VAT 15% (S)', rate: 15 }
      ],
      validation: {
        action: 'Validate with ZIMRA FDMS',
        short: 'FDMS',
        steps: [
          { title: 'Fiscal day verified', detail: 'Device ZIMRA-DEV-4471 confirms fiscal day 318 is open.', ms: 600 },
          { title: 'Receipt signed', detail: 'Invoice signed with the device certificate and queued for FDMS.', ms: 700 },
          { title: 'Submitted to ZIMRA', detail: 'Fiscal receipt transmitted to the FDMS sandbox endpoint.', ms: 900 },
          { title: 'Receipt registered', detail: 'ZIMRA returned a receipt ID and QR verification payload.', ms: 800 },
          { title: 'Fiscal counters updated', detail: 'Device counters and fiscal day totals reconciled.', ms: 500 }
        ],
        checks: [
          'Device ZIMRA-DEV-4471 certificate valid',
          'Fiscal day 318 is open',
          'Customer BP No. 2007654321 passes format check',
          'All 5 lines carry an HS code',
          'Receipt type is fiscal tax invoice'
        ],
        fields: [
          { label: 'FDMS result', value: 'VALIDATED', tone: 'ok' },
          { label: 'Result message', value: 'Receipt accepted by ZIMRA sandbox', wide: true },
          { label: 'ZIMRA receipt ID', value: '000777', mono: true },
          { label: 'Device ID', value: 'ZIMRA-DEV-4471', mono: true },
          { label: 'Fiscal day', value: '318' },
          { label: 'Operation ID', value: 'OP-20261117-0777', mono: true },
          { label: 'Validation date', value: '17 Nov 2026 14:51:36 CAT' },
          { label: 'Receipt signature', value: 'Z9kQ4mV7xL2pR8dV1bN6cF3zH5jU0eGa7No4Pq2Rw=', mono: true, wide: true, truncate: true }
        ],
        receipt: {
          number: '000777',
          secondary: 'Device ZIMRA-DEV-4471 · Fiscal day 318',
          verify: 'https://sandbox.zimra.example/verify?rcpt=000777&device=ZIMRA-DEV-4471',
          qrSeed: 605512,
          signature: 'Z9kQ4mV7xL2pR8dV1bN6cF3zH5jUeGa7No4Pq2Rw='
        },
        request: {
          invoiceNumber: 'INV-ZW-2026-00777',
          customerBp: '2007654321',
          deviceId: 'ZIMRA-DEV-4471',
          fiscalDayNo: 318,
          currency: 'USD',
          receiptType: 'FISCAL_TAX_INVOICE',
          totals: { taxable: 4999.72, tax: 749.96, total: 5749.68 },
          items: [
            { itemCd: 'MZE-25KG', qty: 100, prc: 14.5, taxTyCd: 'S' },
            { itemCd: 'SOL-PMP-15', qty: 4, prc: 620, taxTyCd: 'S' }
          ]
        },
        response: {
          resultCd: '000',
          resultMsg: 'SUCCESS',
          receiptId: '000777',
          deviceId: 'ZIMRA-DEV-4471',
          fiscalDayNo: 318,
          rcptSign: 'Z9kQ4mV7xL2pR8dV1bN6cF3zH5jUeGa7No4Pq2Rw=',
          qrCode: 'ZIMRA|000777|ZIMRA-DEV-4471|318',
          tvDate: '20261117145136'
        }
      },
      print: {
        variant: 'zw',
        docTitle: 'FISCAL TAX INVOICE',
        subtitle: 'Registered through the ZIMRA Fiscalisation Data Management System',
        note: 'Retain this fiscal invoice for input tax claims. Verify the receipt ID and device number on ZIMRA e-services.',
        fiscalLabels: [
          ['ZIMRA receipt', '000777'],
          ['Device', 'ZIMRA-DEV-4471'],
          ['Fiscal day', '318']
        ]
      },
      tour: [
        'Zimbabwe carries a device identity and fiscal day on the invoice. Check that the day is open.',
        'HS codes sit under each line. These are what ZIMRA registers against the receipt.',
        'Run Validate to follow the fiscal-day check, signing, submission and registration stages.',
        'The ZIMRA receipt ID, device ID and signature are now written to the document.',
        'Print the fiscal tax invoice layout used in Zimbabwe.'
      ]
    }
  };

  window.ERP_DEMOS = DEMOS;
})();
