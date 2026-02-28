import type { ParseIssue, ParseResult } from '../shared/types/parsing';
import type { Pokemon } from '../shared/types/pokemon';
import { toId } from '../shared/utils/names';
import { parseIdentityLine } from './identityLine';

interface NumberedLine {
  readonly number: number;
  readonly text: string;
}

interface DraftPokemon {
  species: string;
  nickname?: string;
  item?: string;
  ability?: string;
  nature?: string;
  level?: number;
  shiny?: boolean;
  moves: string[];
}

const TEAM_HEADER = /^===.*===$/;
const KEYED_LINE = /^([A-Za-z][A-Za-z ]*):\s*(.*)$/;
const NATURE_LINE = /^(.*?)\s*Nature$/i;

// EVs, IVs and Tera Type are recognized and skipped on purpose: Open Team
// Sheets for Pokémon Champions don't show them, so this extension treats
// them as out of scope. The remaining entries are legacy or cosmetic export
// fields that carry no information worth validating.
const IGNORED_FIELDS: ReadonlySet<string> = new Set([
  'evs',
  'ivs',
  'teratype',
  'happiness',
  'dynamaxlevel',
  'gigantamax',
  'hiddenpowertype',
]);

const KNOWN_KEYS: ReadonlySet<string> = new Set(['ability', 'trait', 'level', 'shiny']);

// Only lines with a known key count as attributes, so that species names
// containing a colon (e.g. "Type: Null") still parse as identity lines.
const isAttributeLine = (text: string): boolean => {
  if (text.startsWith('-') || NATURE_LINE.test(text)) {
    return true;
  }
  const keyed = KEYED_LINE.exec(text);
  if (keyed?.[1] === undefined) {
    return false;
  }
  const key = toId(keyed[1]);
  return KNOWN_KEYS.has(key) || IGNORED_FIELDS.has(key);
};

const applyKeyedLine = (
  draft: DraftPokemon,
  key: string,
  value: string,
  reportIssue: (message: string) => void,
): boolean => {
  switch (toId(key)) {
    case 'ability':
    case 'trait':
      draft.ability = value === '' ? undefined : value;
      return true;
    case 'level': {
      if (!/^\d+$/.test(value)) {
        reportIssue(`"${value}" is not a valid level.`);
        return true;
      }
      draft.level = Number.parseInt(value, 10);
      return true;
    }
    case 'shiny':
      draft.shiny = value.toLowerCase() === 'yes';
      return true;
    default:
      return IGNORED_FIELDS.has(toId(key));
  }
};

const applyBodyLine = (
  draft: DraftPokemon,
  text: string,
  reportIssue: (message: string) => void,
): void => {
  if (text.startsWith('-')) {
    draft.moves.push(text.slice(1).trim());
    return;
  }
  const keyed = KEYED_LINE.exec(text);
  if (keyed?.[1] !== undefined && keyed[2] !== undefined) {
    if (applyKeyedLine(draft, keyed[1], keyed[2].trim(), reportIssue)) {
      return;
    }
  }
  const nature = NATURE_LINE.exec(text);
  if (nature?.[1] !== undefined) {
    if (nature[1] === '') {
      reportIssue('A nature line is present but the nature itself is missing.');
    } else {
      draft.nature = nature[1];
    }
    return;
  }
  reportIssue('This line was not recognized and has been ignored.');
};

const finalizeDraft = (draft: DraftPokemon): Pokemon => ({
  species: draft.species,
  ...(draft.nickname !== undefined ? { nickname: draft.nickname } : {}),
  ...(draft.item !== undefined ? { item: draft.item } : {}),
  ...(draft.ability !== undefined ? { ability: draft.ability } : {}),
  ...(draft.nature !== undefined ? { nature: draft.nature } : {}),
  ...(draft.level !== undefined ? { level: draft.level } : {}),
  ...(draft.shiny !== undefined ? { shiny: draft.shiny } : {}),
  moves: [...draft.moves],
});

const parseBlock = (
  block: readonly [NumberedLine, ...NumberedLine[]],
  issues: ParseIssue[],
): Pokemon => {
  const [first, ...rest] = block;
  const draft: DraftPokemon = { species: '', moves: [] };
  let body: readonly NumberedLine[] = rest;

  if (isAttributeLine(first.text)) {
    issues.push({
      line: first.number,
      content: first.text,
      message: 'This entry does not start with a Pokémon name line.',
    });
    body = block;
  } else {
    const identity = parseIdentityLine(first.text);
    draft.species = identity.species;
    draft.nickname = identity.nickname;
    draft.item = identity.item;
    for (const message of identity.issues) {
      issues.push({ line: first.number, content: first.text, message });
    }
  }

  for (const line of body) {
    applyBodyLine(draft, line.text, (message) =>
      issues.push({ line: line.number, content: line.text, message }),
    );
  }
  return finalizeDraft(draft);
};

export const parseTeam = (text: string): ParseResult => {
  const issues: ParseIssue[] = [];
  const pokemon: Pokemon[] = [];
  let block: NumberedLine[] = [];

  const flushBlock = (): void => {
    const [first, ...rest] = block;
    if (first !== undefined) {
      pokemon.push(parseBlock([first, ...rest], issues));
    }
    block = [];
  };

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const trimmed = rawLine.trim();
    if (trimmed === '' || TEAM_HEADER.test(trimmed)) {
      flushBlock();
      return;
    }
    block.push({ number: index + 1, text: trimmed });
  });
  flushBlock();

  return { team: { pokemon }, issues };
};
