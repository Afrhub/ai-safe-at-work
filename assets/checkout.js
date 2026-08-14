/* Plan-aware checkout.
 *
 * "Order Attest AI Platform" links here with ?plan=platform. Without this the
 * page always said Foundation, so a Platform buyer saw the wrong product at the
 * wrong price and their order was recorded as a Foundation order.
 *
 * One Netlify form serves both plans deliberately: Netlify registers forms by
 * parsing the static HTML at deploy, so a form-name swapped at runtime would
 * never be registered and the submission would 404. The plan travels as a
 * hidden field instead, which also means notifications only need setting up
 * once.
 *
 * CSP-safe: external file, no inline handlers.
 */
(function () {
  var PLANS = {
    foundation: {
      eyebrow: 'Order · Foundation',
      title: 'Order <em>Foundation</em>.',
      lede: 'Train your people and get the core governance documents in place, priced by the size of your organisation and renewed annually. Delivered through the Attest AI portal.',
      priceHead: 'Foundation &middot; &pound;990 <span style="font-size:0.7em;color:var(--text3);font-weight:400">per year, 1 to 25 staff</span>',
      priceNote: '&pound;1,750 per year for 26 to 50 staff. More than 50, we will quote on headcount. All prices exclude VAT.',
      bands: [
        ['1-25 (£990/yr)', '1 to 25 staff — £990 per year'],
        ['26-50 (£1,750/yr)', '26 to 50 staff — £1,750 per year'],
        ['Over 50 (quote)', 'More than 50 staff — we will quote']
      ],
      submit: 'Buy Foundation →',
      features: [
        'The AI Safe@Work course, all eleven modules',
        'Knowledge assessment at the end of each module',
        'Completion certificates for every member of staff',
        'Annual refresher training',
        'Starter governance templates to fill in yourself (Acceptable Use Policy, core registers and risk assessment)',
        'Training completion records you can hand to an auditor',
        'Team management through the Attest AI portal'
      ]
    },
    platform: {
      eyebrow: 'Order · Attest AI Platform',
      title: 'Order the <em>Attest AI Platform</em>.',
      lede: 'Continuous AI governance, with the staff training included, priced by the size of your organisation and billed annually. Delivered through the Attest AI portal.',
      priceHead: 'Attest AI Platform &middot; &pound;249 <span style="font-size:0.7em;color:var(--text3);font-weight:400">per month, 1 to 25 staff</span>',
      priceNote: '&pound;499 per month for 26 to 50 staff. Billed annually at &pound;2,490 and &pound;4,990. More than 50, we will quote on headcount. All prices exclude VAT.',
      bands: [
        ['1-25 (£249/mo, £2,490/yr)', '1 to 25 staff — £249 per month'],
        ['26-50 (£499/mo, £4,990/yr)', '26 to 50 staff — £499 per month'],
        ['Over 50 (quote)', 'More than 50 staff — we will quote']
      ],
      submit: 'Request your Platform order →',
      features: [
        'Everything in Foundation, including the staff training',
        'Live governance documents and registers, kept current',
        'Governance dashboard reporting what is outstanding',
        'Staff policy acknowledgement tracking, by version',
        'Risk, incident, use-case and vendor registers',
        'Risk assessments that set a use case&rsquo;s rating automatically',
        'Reporting that organises your records the way an auditor asks for them',
        'Content reviewed and updated at least quarterly'
      ]
    }
  };

  function param() {
    try {
      var p = new URLSearchParams(location.search).get('plan');
      return p && PLANS[p.toLowerCase()] ? p.toLowerCase() : 'foundation';
    } catch (e) { return 'foundation'; }
  }

  function apply() {
    var key = param();
    var cfg = PLANS[key];
    var main = document.getElementById('main');
    if (!main || !cfg) return;

    var eyebrow = main.querySelector('.eyebrow');
    if (eyebrow) eyebrow.textContent = cfg.eyebrow;
    var title = main.querySelector('.page-title');
    if (title) title.innerHTML = cfg.title;
    var lede = main.querySelector('.lede');
    if (lede) lede.textContent = cfg.lede;

    var card = main.querySelector('.module-card');
    if (card) {
      // The plan heading is an h2 styled as h3 since the A11Y-04 fix; match either.
      var h3 = card.querySelector('.h3-style, h3');
      if (h3) h3.innerHTML = cfg.priceHead;
      var note = card.querySelector('p');
      if (note) note.innerHTML = cfg.priceNote;
      var ul = card.querySelector('ul');
      if (ul) {
        ul.innerHTML = '';
        cfg.features.forEach(function (f) {
          var li = document.createElement('li');
          li.innerHTML = f;
          ul.appendChild(li);
        });
      }
    }

    var sel = main.querySelector('select[name="headcount"]');
    if (sel) {
      sel.innerHTML = '';
      var first = document.createElement('option');
      first.value = ''; first.textContent = 'Please choose';
      sel.appendChild(first);
      cfg.bands.forEach(function (b) {
        var o = document.createElement('option');
        o.value = b[0]; o.textContent = b[1];
        sel.appendChild(o);
      });
    }

    var btn = main.querySelector('form button[type="submit"]');
    if (btn) btn.textContent = cfg.submit;

    // record which plan was ordered; one form serves both, see header note
    var form = main.querySelector('form');
    if (form && !form.querySelector('input[name="plan"]')) {
      var hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'plan';
      hidden.value = key === 'platform' ? 'Attest AI Platform' : 'Foundation';
      form.appendChild(hidden);
    }
    document.title = cfg.eyebrow.replace('Order · ', 'Order ') + ' · Attest AI';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
