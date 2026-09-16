// AI governance, security and policy feed for the front page (16 Sep 2026).
//
// The site's CSP is connect-src 'self', so the browser cannot read feeds directly; this
// function fetches them, merges, sorts and caches at the CDN. Sources were verified live on
// 16 Sep 2026 after Perplexity's recommended single feed (IAPP Daily Dashboard) and both
// runners-up (Tech Policy Press, Euractiv) turned out to serve HTML, not XML, to a server.
// No single working feed covers governance + security + policy worldwide, so three
// authoritative, non-vendor ones are merged and tagged by source. NCSC is filtered to AI.
//
// ponytail: regex parsing of RSS 2.0 and Atom, no dependency; fields are title, link, date,
// source. If a feed changes shape it simply contributes nothing and the others carry on.

export const SOURCES = [
  { name: "UK Government", url: "https://www.gov.uk/search/all.atom?keywords=artificial%20intelligence&order=updated-newest" },
  { name: "European Commission", url: "https://digital-strategy.ec.europa.eu/en/rss.xml" },
  { name: "NCSC", url: "https://www.ncsc.gov.uk/api/1/services/v1/all-rss-feed.xml", filter: /\bAI\b|artificial intelligence|machine learning|\bLLM|language model|chatbot/i },
];

const UA = "Mozilla/5.0 (compatible; AttestAI-news/1.0; +https://attest-ai.com)";
const MAX_ITEMS = 12;

const unescape = (s) => String(s || "")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#8217;/g, "’").replace(/&#8216;/g, "‘").replace(/&#8220;/g, "“").replace(/&#8221;/g, "”").replace(/&#8211;/g, "–").replace(/&#8212;/g, "—").replace(/&nbsp;/g, " ")
  .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return m ? m[1] : "";
};

// Atom <link href="..."/> (may be several; prefer rel="alternate" or the first).
const atomLink = (block) => {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>/gi)].map((m) => m[1]);
  const pick = links.find((a) => /rel=["']alternate["']/i.test(a)) || links.find((a) => !/rel=/i.test(a)) || links[0] || "";
  const href = pick.match(/href=["']([^"']+)["']/i);
  return href ? unescape(href[1]) : "";
};

export function parseFeed(xml, source) {
  const out = [];
  const items = [...String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((m) => ["rss", m[1]])
    .concat([...String(xml).matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((m) => ["atom", m[1]]));
  for (const [kind, block] of items) {
    const title = unescape(tag(block, "title"));
    const link = kind === "rss" ? unescape(tag(block, "link") || tag(block, "guid")) : atomLink(block);
    const dateRaw = tag(block, "pubDate") || tag(block, "updated") || tag(block, "published") || tag(block, "dc:date");
    const date = new Date(unescape(dateRaw));
    if (!title || !/^https?:\/\//.test(link) || isNaN(date)) continue;
    out.push({ title, link, date: date.toISOString(), source });
  }
  return out;
}

export function merge(lists, max = MAX_ITEMS) {
  const seen = new Set();
  return lists.flat()
    .filter((i) => (seen.has(i.link) ? false : seen.add(i.link)))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, max);
}

async function fetchSource(s) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(s.url, { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" }, signal: ctrl.signal });
    if (!r.ok) return [];
    const items = parseFeed(await r.text(), s.name);
    return s.filter ? items.filter((i) => s.filter.test(i.title)) : items;
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

export default async () => {
  const lists = await Promise.all(SOURCES.map(fetchSource));
  const items = merge(lists);
  return new Response(JSON.stringify({ items, fetched: new Date().toISOString() }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Browsers: 10 min. CDN: 30 min, serve stale for a day while revalidating, so a slow
      // or down source never stalls the front page.
      "Cache-Control": "public, max-age=600",
      "Netlify-CDN-Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
    },
  });
};
