# Parked content

Content removed from live pages but kept because it is likely wanted again.
Nothing here is deleted knowledge — copy it back when the moment arrives.

See also [`nav-parked-links.md`](nav-parked-links.md) for nav entries pulled from
the top bar.

---

## Partner page DRAFT banner

**Removed from** `msp.html` (Become a Partner), 24 Jul 2026, at founder request.
**Sat** directly under the "Start: Partner / IT Admin track" line, above the
programme description.

The `.draft-banner` CSS is deliberately still in `msp.html`, so restoring this
is a paste, not a re-style. The same class also exists in `pricing.html`.

```html
 <div class="draft-banner">
 Partner page is a draft (<code>noindex</code>) until the commercial entity, payment processor and partner agreement are in place. Commercial terms are shared with approved partners in the partner portal.
 </div>
```

### Why it is worth keeping

The wording encodes the three real preconditions for opening the partner
programme, which have not gone away just because the banner has:

1. **Commercial entity** — the trading entity the partner agreement is signed by.
2. **Payment processor** — no card path exists; orders are invoiced by hand.
   HANDOFF blocker 0b.
3. **Partner agreement** — no signed template exists. Referenced by the MSP/IT
   Admin course track, which now points partners at the portal instead.

`msp.html` is still `noindex, nofollow` in its meta tags. Removing the visible
banner did not change that — the page remains hidden from search engines. If the
page is ever meant to be found, that meta tag is the thing to change, and the
banner is probably worth restoring until the three items above are done.

### Where this pattern may be wanted again

- Restored on `msp.html` if partners start arriving before the agreement exists
- On any page describing something sold but not yet deliverable
- `pricing.html` carried one until the grid was locked on 21 Jul 2026


---

## Partner page NFR licences section

**Removed from** `msp.html` (Become a Partner), 24 Jul 2026, at founder request.
**Sat** under Partner Benefits, between "Margin on every seat and pack" and
"Deal registration".

### Why removing it was right beyond the ask

The table named **Rebate Tier 1–4** on a public page. Those tier names are the
rungs of the rebate ladder, so the page was disclosing the shape of the partner
commercial model — how many tiers exist and that they escalate — even though the
percentages and wholesale prices had already been moved behind the portal login
on 21 Jul. That cuts against the standing rule recorded in DOCTRINE:

> partner pricing, rebates, wholesale and margin figures never appear on a
> public page — one "Partner pricing available" line is the public limit.

The benefit itself is still mentioned in the Partner Benefits intro, without
numbers: approved partners get free NFR licences for internal use. The
entitlement is a selling point; the allowance table is partner-only detail.

### Where it should probably live instead

`portal/reseller.html`, alongside the rebate tables, which is where a partner
learns what their tier actually entitles them to. Note the allowances are keyed
to the same Rebate Tier structure that is currently marked **under review**
there, because the tiers were built on retired per-seat pricing. Restore the
allowances and the tiers together, not separately.

### The markup

```html
 <h2 style="margin-top:2.2rem">Free NFR licences</h2>
 <p>Every partner gets free not-for-resale (NFR) licences for internal use: run the training on your own staff, self-certify before client conversations, and demo the platform to prospects. NFR licences cannot be resold or assigned to client accounts. The allowance scales with your tier.</p>
 <div style="overflow-x:auto">
 <table class="split-table">
 <thead><tr><th>Tier</th><th>Training NFR seats</th><th>Platform NFR deployments</th></tr></thead>
 <tbody>
 <tr><td>Standard</td><td>5</td><td>1</td></tr>
 <tr><td>Rebate Tier 1</td><td>10</td><td>1</td></tr>
 <tr><td>Rebate Tier 2</td><td>20</td><td>2</td></tr>
 <tr><td>Rebate Tier 3</td><td>35</td><td>3</td></tr>
 <tr><td>Rebate Tier 4</td><td>50</td><td>5</td></tr>
 </tbody>
 </table>
 </div>
```
