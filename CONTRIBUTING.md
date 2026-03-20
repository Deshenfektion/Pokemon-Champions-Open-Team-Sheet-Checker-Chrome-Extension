# Developer Guide

## Setup

```sh
npm install
```

## Run locally

```sh
npm run dev
```

Opens the popup in a browser tab for fast iteration. `chrome.*` APIs are unavailable here — team
extraction falls back to `null`, so use the paste box.

## Test in the actual extension

```sh
npm run build
```

Then in Chrome:

1. Go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**, select the `dist/` folder.
4. Open [play.pokemonshowdown.com](https://play.pokemonshowdown.com), open a team in the
   Teambuilder, click the extension icon.

Rebuild after every change — there is no watch mode for the packed extension.

## Checks

```sh
npm test           # vitest
npm run lint       # eslint
npm run format     # prettier --write
npm run build      # typecheck + bundle
```

Run all four before committing.

## Adding a validation rule

1. Create a file in `src/validation/rules/` (or `rules/heuristics/` for an INFO-only suggestion).
2. Implement it with `perPokemonRule` (per-Pokémon checks) or a plain `ValidationRule` object
   (team-wide checks like duplicates). See any existing file in that folder for the shape.
3. Register it in `src/validation/rules/index.ts`: import it, add it to the `allRules` array.
   Array position controls message order within a Pokémon.
4. Add a test alongside the existing rule tests (`completeness.test.ts`, `duplicates.test.ts`, or
   `heuristics/heuristics.test.ts`) covering the firing case and the not-applicable case.
5. Pick a severity honestly:
   - `error` — objectively broken (duplicate moves, empty move slots).
   - `warning` — probably an oversight, but could be intentional.
   - `info` — a suggestion. Never phrase these as mistakes.
6. If the rule should be toggleable, add a field to `ValidationSettings`
   (`src/shared/types/settings.ts`), default it in `DEFAULT_SETTINGS`, and expose a control in
   `SettingsPanel.tsx`.
7. **Never validate EVs, IVs, gender or Tera Type.** None of them appear on a Pokémon Champions
   Open Team Sheet — this is a hard rule for this project, not a style preference.

## Removing a rule

1. Delete the rule file (and its test).
2. Remove its import and array entry from `rules/index.ts`.

That's the entire footprint — rules are self-contained and don't reference each other.

## Project structure

```
src/
  parser/              Showdown export text -> domain objects. Never throws;
                       collects recoverable ParseIssues instead.
  validation/
    engine.ts          Runs rules, isolates failures, aggregates a report.
    ruleKit.ts         perPokemonRule() helper + shared rule-building types.
    rules/             One file per rule.
    rules/heuristics/  INFO-only suggestion rules.
  shared/
    types/             Domain models (Pokemon, Team, ValidationMessage, Settings).
    data/              Curated data sets (status moves, VGC support species, ...).
    utils/             Name normalization, export-text detection.
  extension/
    popup/             React popup UI, hooks, settings storage.
    content/           Content script that reads the open team from the page.
  testing/             Shared test builders (makePokemon, makeTeam, makeSettings).
```

## Data sets

Curated lists in `src/shared/data/` (status moves, VGC support species, choice items) are
intentionally incomplete and only back heuristic/info-level rules. Extend them as gaps come up;
don't block a rule on making a list exhaustive.

## Non-negotiables

- No EV, IV, gender or Tera Type validation, anywhere. None of them appear on a Pokémon Champions
  Open Team Sheet.
- `info` findings must read as questions, not verdicts.
- A rule must never throw — the engine catches it, but a defensive rule is a correct rule.
- Keep parsing and validation separate: rules only ever see the parsed `Team`, never raw text.
