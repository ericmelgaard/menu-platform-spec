# Instructions for AI agents

This repository is the specification for the Operator Hub menu platform: the product database, the ETL
server and scheduling + validation. It holds no application code.

- `MENU_PLATFORM_DESIGN.md` is the source of truth. Start with its "Using this document" section: it maps
  questions (infrastructure, SQL tables, APIs, UI, requirements, milestones) to sections.
- Answer from the design and cite the section, flow (`F…`), decision (`D…`) or requirement (`R-…`).
- Use table and column definitions exactly as written. Don't invent tables, columns, states or
  endpoints; if something isn't specified, say so and point to §19 (open items).
- Items marked **Proposed — confirm** are the current plan but await the owner's decision.
- Building a milestone: §17 lists each phase with the requirement IDs it must satisfy and its "done
  when". Check the work against those requirements before calling the phase done.
- Changing the spec: edit `MENU_PLATFORM_DESIGN.md` first (version, change log, decisions,
  requirements), then rebuild the review page. Code follows the spec, not the other way round.
- `STATUS.md` says where the work stands.
