# Showdown Team Check

A Chrome extension that checks your Pokémon Showdown team for accidental mistakes before you
battle — think "Grammarly for Showdown teams".

This is not a legality checker (Showdown already has one). It looks for forgotten fields, typos,
and suspicious oversights: a missing held item, a Pokémon with only three moves, a forgotten
Tera Type.

## Development

```sh
npm install
npm run dev     # popup UI in the browser
npm run build   # production build into dist/
npm test        # run the test suite
```

Load the `dist/` folder as an unpacked extension via `chrome://extensions`.
