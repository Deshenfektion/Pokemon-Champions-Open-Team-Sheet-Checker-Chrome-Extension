export interface IdentityLine {
  readonly species: string;
  readonly nickname?: string;
  readonly item?: string;
  readonly issues: readonly string[];
}

const splitItem = (
  line: string,
): { readonly rest: string; readonly item?: string; readonly issue?: string } => {
  const atIndex = line.lastIndexOf('@');
  if (atIndex === -1) {
    return { rest: line };
  }
  const item = line.slice(atIndex + 1).trim();
  const rest = line.slice(0, atIndex).trim();
  if (item === '') {
    return { rest, issue: 'An item marker "@" is present but no item follows it.' };
  }
  return { rest, item };
};

// Gender isn't tracked (Open Team Sheets for Pokémon Champions don't need it
// checked), but the marker still has to be stripped here or splitNickname
// below would mistake "(M)"/"(F)" for a nickname-wrapped species.
const stripGenderMarker = (line: string): string => {
  const match = /^(.*)\((M|F)\)$/.exec(line.trim());
  return match?.[1] !== undefined ? match[1].trim() : line.trim();
};

const splitNickname = (line: string): { readonly species: string; readonly nickname?: string } => {
  if (!line.endsWith(')')) {
    return { species: line };
  }
  const openIndex = line.lastIndexOf('(');
  if (openIndex <= 0) {
    return { species: line.slice(1, -1).trim() };
  }
  return {
    species: line.slice(openIndex + 1, -1).trim(),
    nickname: line.slice(0, openIndex).trim(),
  };
};

export const parseIdentityLine = (line: string): IdentityLine => {
  const issues: string[] = [];
  const { rest: withoutItem, item, issue } = splitItem(line.trim());
  if (issue !== undefined) {
    issues.push(issue);
  }
  const withoutGender = stripGenderMarker(withoutItem);
  const { species, nickname } = splitNickname(withoutGender);
  if (species === '') {
    issues.push('Could not read a species name from this line.');
  }
  return {
    species,
    ...(nickname !== undefined && nickname !== '' ? { nickname } : {}),
    ...(item !== undefined ? { item } : {}),
    issues,
  };
};
