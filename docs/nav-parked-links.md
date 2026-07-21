# Parked nav links

Removed from the `.topbar-nav` on 21 Jul 2026 (76 pages) pending a decision on
where they belong. **The pages themselves are untouched and still live** — only
the top-nav entries were pulled.

| Label | Target | Status |
|---|---|---|
| Frameworks | `standards-map.html` | live, reachable by direct URL and in-page links |
| Resources | `resources.html` | live, reachable by direct URL and in-page links |

Exact markup, in nav order (sat between Products and Business Types, and
between Business Types and Plans respectively):

```html
 <a href="standards-map.html">Frameworks</a>
 <a href="resources.html">Resources</a>
```

Paths were relative to the page, so `portal/` and `v2/` pages used `../` or
absolute variants — restore with the same relative depth as their neighbours.

To restore everywhere, re-run the removal script in reverse or `git revert` the
commit that removed them.

## Open decision

Where these go: a footer group, a "Resources" dropdown under Products, or back
in the top nav once the nav has room. Nothing else depends on this.
