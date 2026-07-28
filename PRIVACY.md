# Privacy Policy — Showdown Team Check

_Last updated: 2026-07-28_

Showdown Team Check is a Chrome extension that checks a Pokémon Showdown team for
accidental mistakes (missing items, abilities, moves, etc.) before battle.

**This extension does not collect, store, transmit, or sell any personal data.**

## What the extension does

- **Reading your team:** on `play.pokemonshowdown.com` and `psim.us`, the extension's
  content script reads the team text already displayed on the page (the Teambuilder
  Import/Export view) so it can be checked for common mistakes. This happens entirely
  in your browser — the team text is never sent anywhere.
- **Pasted teams:** if you paste a team export into the popup on any other page, that
  text is processed locally in memory to run the same checks and is never transmitted.
- **Settings storage:** your validation preferences (e.g. required level, whether to
  flag missing items, duplicate nicknames, Protect suggestions) are saved using
  Chrome's built-in `storage` API (`chrome.storage.sync`), so your settings follow you
  between devices signed into the same Chrome profile. This data stays within Google's
  Chrome sync infrastructure and is not accessible to the developer.

## What the extension does not do

- No analytics, tracking, or advertising SDKs.
- No network requests to any server operated by the developer or any third party.
- No account, sign-in, or personal information is requested or required.

## Contact

Questions about this policy can be sent to deyi.rao@gmx.de.
