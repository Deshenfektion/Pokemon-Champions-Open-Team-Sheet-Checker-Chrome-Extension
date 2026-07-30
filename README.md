# Open Team Sheet Check - specifically designed for Pokémon Champions

## Download available [here](https://chromewebstore.google.com/detail/showdown-team-check/dhnicfligedphfpbekpdhkhncoohlaio?authuser=0&hl=de)

A Chrome extension (Manifest V3) that checks your Pokémon Showdown team for accidental mistakes
before you battle — think "Grammarly for Showdown teams".

This is **not** a legality checker; Showdown already has one. Team Check looks for forgotten
fields, typos and suspicious oversights: a missing held item, a Pokémon with only three moves,
two Pokémon holding the same item.

It is built for competitive players preparing **Open Team Sheets (OTS)** for Pokémon Champions.
Because OTS don't display EVs, IVs, gender or Tera Type, the extension deliberately performs **no
validation** of any of them.

## How it works

Open your team in the Showdown Teambuilder (the Import/Export view) and click the extension icon —
the content script reads the open team automatically. On any other page, paste a Showdown export
into the popup instead. Results update live and are grouped per Pokémon.

Every finding has one of three severities:

| Severity   | Meaning                                                        |
| ---------- | -------------------------------------------------------------- |
| Error      | Objectively broken: duplicate moves, empty move slots          |
| Warning    | Probably an oversight: missing item, ability, nature, level    |
| Suggestion | Purely informational nudges that are often intentional choices |

Suggestions are never presented as mistakes. The extension always assumes you might know exactly
what you are doing.

## Checks

**Completeness** — missing species, item, ability, nature, level (configurable: 50 / 100 / off),
fewer than four moves, empty move slots, entries abandoned mid-edit.

**Duplicates** — duplicate moves on one set, duplicate species (Species Clause), formes sharing a
base species, duplicate held items (Item Clause, configurable), duplicate nicknames
(informational, configurable).

**Heuristic suggestions (INFO only)** — Choice item on a mostly-status set, Focus Sash with no
attacks, nickname identical to the species, missing Protect on common VGC support Pokémon
(configurable).

## Development

```sh
npm install
npm run dev     # popup UI on a dev server
npm run build   # typecheck + production build into dist/
npm test        # vitest suite
npm run lint    # eslint
npm run format  # prettier
```

Load the `dist/` folder as an unpacked extension via `chrome://extensions` (enable Developer
mode). See [CONTRIBUTING.md](CONTRIBUTING.md) for the full local-testing and rule-authoring guide.

## Architecture

```
src/
  parser/              Showdown export text → domain objects; never throws,
                       collects recoverable ParseIssues instead
  validation/
    engine.ts          runs rules, isolates failures, aggregates a report
    rules/             one file per rule; all rules are independent plug-ins
    rules/heuristics/  INFO-only suggestion rules
  shared/
    types/             domain models (Pokemon, Team, ValidationMessage, settings)
    data/              curated data sets (status moves, VGC support species, ...)
    utils/             name normalization, export detection
  extension/
    popup/             React popup (components, hooks, storage)
    content/           content script that reads the open team from the page
  testing/             shared test builders
```

Key decisions:

- **Parsing and validation are strictly separated.** The parser produces plain domain objects and
  a list of recoverable issues; every rule consumes only the domain model.
- **Rules are pluggable.** A rule is `{ id, validate(team, settings) }`. Adding a check means
  adding one file and registering it in `rules/index.ts`; a throwing rule is skipped, never fatal.
- **Team extraction sits behind a `TeamSource` abstraction**, so the DOM-scraping strategy can
  change (or become a Showdown API) without touching the UI.
- **EVs, IVs, gender and Tera Type are intentionally out of scope** — none of them appear on a
  Pokémon Champions Open Team Sheet. The parser recognizes and discards their export lines (a
  gender marker is still stripped internally so it doesn't corrupt species/nickname parsing, but
  the value itself is never stored or checked), and no rule may inspect them.

## Extending

Ideas that fit the current architecture naturally: generation-specific rule profiles, legality
data, auto-fix suggestions, highlighting lines inside the Teambuilder, custom user rules,
localization. Contributions are welcome — please keep new heuristics INFO-only and phrase
messages as questions, not verdicts.

## License

MIT
