# Menu platform: status

Last session: 2026-11-25 (late). Design: [MENU_PLATFORM_DESIGN.md](MENU_PLATFORM_DESIGN.md) (three systems: ETL
server, product database, scheduling + validation; decisions in section 9). Focus is infrastructure,
table schema and the workflow for populating schedules; the product database can be new.

## Status: waiting for approval (v2.0)

The design is now the shareable build reference (v2.0): agent guide, schema, flows F1–F15, APIs and
response formats, offline package, security, service levels, UI representation and numbered
requirements (§16). **Awaiting approval.** Review page: https://claude.ai/artifact/G4TdReMkf1fWtSDo52N9na
(rebuild with `npm run build-page`).

To confirm (design §19, P1–P11): sign-in for people, device tokens, partner credentials, roles, speed
targets, rate limits, attribute profiles, AIMS push window, offline horizon, uncached wait, source
limits. After approval: change the status line, then build phase 1 (design §17).

## Next steps

- Write the first playground migration: `product`, `etl` and `schedule` schemas, hierarchy,
  `store_sources`, `menu_targets` (design section 8).
- Turn `supabase/functions/populate-menu-data` into the ETL function (`seed` for one menu cycle,
  `refresh`, `source-menu`, `validate`) with the this-week + next-week validation cache.
- Move week resolution out of `src/lib/weekSchedule.ts` / `deviceWeekProjection.ts` into the
  scheduling function.
