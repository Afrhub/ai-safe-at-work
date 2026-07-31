// Foundation checkout. Bands "1-25" and "26-50" are bought online by Bacs Direct
// Debit through Stripe Checkout; "Over 50" is quoted on headcount, so that band
// still submits the Netlify `order` form exactly as before.
//
// ponytail: no Stripe.js. Production CSP is script-src 'self', so an external SDK
// would be blocked on the live site. The function creates the session server-side
// and we navigate to Stripe's hosted page, which needs no script at all.
//
// Also handles the one line on checkout-thanks.html that would otherwise promise
// an invoice to someone who has just set up a Direct Debit.
(function () {
  // ── checkout-thanks.html: swap the lede after a Direct Debit checkout ──
  var ddNote = document.getElementById("dd-note");
  if (ddNote) {
    if (/[?&]dd=1/.test(location.search)) {
      var invoiceNote = document.getElementById("invoice-note");
      if (invoiceNote) invoiceNote.hidden = true;
      ddNote.hidden = false;
    }
    return; // nothing else on this page
  }

  // ── checkout.html: intercept the order form ──
  var form = document.querySelector('form[name="order"]');
  if (!form) return;

  var msg = document.getElementById("pay-msg");
  var say = function (text) {
    if (msg) msg.textContent = text;
  };

  form.addEventListener("submit", function (e) {
    var headcount = (form.elements.headcount && form.elements.headcount.value) || "";

    // Over 50 is a quote, not a sale. Let the Netlify form submit as it always has.
    if (!/^(1-25|26-50)/.test(headcount)) return;

    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    say("Taking you to the payment page…");

    // If anything at all goes wrong, fall back to the invoice-me form rather than
    // leaving a dead button. The buyer still reaches us, exactly as they do today.
    var fallback = function (reason) {
      say(reason + " Sending your details instead, we will email you an invoice.");
      form.submit(); // .submit() does not re-fire this handler
    };

    fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: form.elements.company.value,
        name: form.elements.name.value,
        email: form.elements.email.value,
        headcount: headcount,
      }),
    })
      .then(function (r) {
        return r.json().then(function (d) {
          return { ok: r.ok, data: d };
        });
      })
      .then(function (res) {
        if (res.ok && res.data.url) {
          location.href = res.data.url;
          return;
        }
        fallback(
          res.data && res.data.error === "not_configured"
            ? "Card and Direct Debit payment is not switched on yet."
            : "We could not open the payment page."
        );
      })
      .catch(function () {
        fallback("We could not reach the payment page.");
      });
  });
})();
