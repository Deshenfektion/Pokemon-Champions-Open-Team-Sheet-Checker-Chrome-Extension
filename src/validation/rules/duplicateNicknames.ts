import type { ValidationRule } from '../../shared/types/validation';
import { teamMessage } from '../ruleKit';

export const duplicateNicknamesRule: ValidationRule = {
  id: 'duplicate-nicknames',
  validate: (team, settings) => {
    if (!settings.flagDuplicateNicknames) {
      return [];
    }
    const byNickname = new Map<string, string[]>();
    for (const pokemon of team.pokemon) {
      if (pokemon.nickname === undefined) {
        continue;
      }
      const key = pokemon.nickname.trim().toLowerCase();
      byNickname.set(key, [...(byNickname.get(key) ?? []), pokemon.nickname]);
    }
    return [...byNickname.values()]
      .filter((nicknames) => nicknames.length > 1)
      .map((nicknames) =>
        teamMessage(
          'duplicate-nicknames',
          'info',
          'Duplicate nickname',
          `${String(nicknames.length)} Pokémon share the nickname "${nicknames[0] ?? ''}". This is legal, but it can make battles confusing.`,
        ),
      );
  },
};
