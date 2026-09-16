// Runnable check for the feed parser and merge: RSS 2.0 and Atom shapes, CDATA, entities,
// bad rows dropped, newest first, duplicates removed, NCSC-style filter applied by caller.
// Run: node tests/news-parse.mjs
import assert from "node:assert/strict";
import { parseFeed, merge, SOURCES } from "../netlify/functions/news.mjs";

const rss = `<?xml version="1.0"?><rss><channel><title>Feed</title>
<item><title><![CDATA[Commission &amp; AI Act: guidance]]></title><link>https://example.eu/a</link><pubDate>Tue, 15 Sep 2026 12:00:00 GMT</pubDate></item>
<item><title>No link row</title><pubDate>Tue, 15 Sep 2026 12:00:00 GMT</pubDate></item>
<item><title>Bad date</title><link>https://example.eu/b</link><pubDate>yesterday-ish</pubDate></item>
<item><title>Older</title><link>https://example.eu/c</link><pubDate>Mon, 01 Sep 2026 09:00:00 GMT</pubDate></item>
</channel></rss>`;
const atom = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>gov</title>
<entry><title>AI assurance guidance &#8211; updated</title><link rel="alternate" href="https://www.gov.uk/x"/><updated>2026-09-16T00:01:03+01:00</updated></entry>
<entry><title>Dup</title><link href="https://example.eu/a"/><updated>2026-09-10T00:00:00Z</updated></entry>
</feed>`;

const r = parseFeed(rss, "European Commission");
assert.equal(r.length, 2, "rows without a link or with a bad date must be dropped");
assert.equal(r[0].title, "Commission & AI Act: guidance", "CDATA and entities unwrapped");
assert.equal(r[0].source, "European Commission");
const a = parseFeed(atom, "UK Government");
assert.equal(a.length, 2);
assert.equal(a[0].link, "https://www.gov.uk/x", "atom rel=alternate link picked");
assert.equal(a[0].title, "AI assurance guidance \u2013 updated", "numeric entity decoded");

const m = merge([r, a]);
assert.equal(m.length, 3, "duplicate link across feeds removed");
assert.equal(m[0].link, "https://www.gov.uk/x", "newest first");
assert.equal(m[m.length - 1].title, "Older");
assert.equal(merge([r, a], 2).length, 2, "cap honoured");

const ncsc = SOURCES.find((s) => s.name === "NCSC");
assert.ok(ncsc.filter.test("New guidance on securing AI systems"), "NCSC filter keeps AI items");
assert.ok(!ncsc.filter.test("Router firmware advisory"), "NCSC filter drops non-AI items");

console.log("news feed parser: 12 checks passed");
