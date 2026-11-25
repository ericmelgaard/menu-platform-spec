# Menu Platform Spec

The source of truth for the Operator Hub menu platform: the **product database**, the **ETL server**
and **scheduling + validation**, specified together because they share identities, events and data.

**Read it rendered:** https://ericmelgaard.github.io/menu-platform-spec/ (rebuilt from
`MENU_PLATFORM_DESIGN.md` on every push to `main`).

| File | What it is |
|---|---|
| [`MENU_PLATFORM_DESIGN.md`](MENU_PLATFORM_DESIGN.md) | The design: infrastructure, SQL tables, logic flows, APIs, security, service levels, UI representation, numbered requirements, build plan, decisions |
| [`STATUS.md`](STATUS.md) | Where the work stands and what's next |
| [`CLAUDE.md`](CLAUDE.md) / [`AGENTS.md`](AGENTS.md) | How AI coding agents should use this spec |
| [`review-page/`](review-page/) | Builds the design into a single HTML review page |

## Using it from another repo

Clone it next to the repo you're working in, so agents can read it locally:

```sh
git clone https://github.com/ericmelgaard/menu-platform-spec.git
```

Then add one line to that repo's `CLAUDE.md` (or `AGENTS.md`):

> Menu platform (product database, ETL, scheduling): the source of truth is
> `../menu-platform-spec/MENU_PLATFORM_DESIGN.md` (https://github.com/ericmelgaard/menu-platform-spec).
> Read its "Using this document" section first.

Without a clone, an agent can read it with the GitHub CLI:

```sh
gh api repos/ericmelgaard/menu-platform-spec/contents/MENU_PLATFORM_DESIGN.md -H "Accept: application/vnd.github.raw"
```

## Changing the spec

1. Edit `MENU_PLATFORM_DESIGN.md` first: bump the version, add a change log row, add or update
   decisions (`D…`) and requirements (`R-…`).
2. Push to `main`: the GitHub Pages copy rebuilds itself. If you use the Claude review page, rebuild and republish it too.
3. Then change code to match.

## Rendered page

Every push to `main` rebuilds the page and publishes it to GitHub Pages
(`.github/workflows/pages.yml`): https://ericmelgaard.github.io/menu-platform-spec/

To build it locally:

```sh
npm install
npm run build-site    # complete page with diagrams, open in a browser
npm run build-page    # content only, for the Claude artifact viewer
```

Both write `review-page/menu-platform-design.html` (not committed).
