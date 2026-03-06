import type { Team } from '../../shared/types/pokemon';
import type { ValidationMessage, ValidationRule } from '../../shared/types/validation';
import { baseSpecies, toId } from '../../shared/utils/names';
import { teamMessage } from '../ruleKit';

const groupBy = (
  team: Team,
  key: (species: string) => string,
): ReadonlyMap<string, readonly string[]> => {
  const groups = new Map<string, string[]>();
  for (const pokemon of team.pokemon) {
    if (pokemon.species === '') {
      continue;
    }
    const id = key(pokemon.species);
    groups.set(id, [...(groups.get(id) ?? []), pokemon.species]);
  }
  return groups;
};

export const duplicatePokemonRule: ValidationRule = {
  id: 'duplicate-pokemon',
  validate: (team) => {
    const messages: ValidationMessage[] = [];
    const exactDuplicates = new Set<string>();

    for (const [, names] of groupBy(team, toId)) {
      const [name] = names;
      if (names.length > 1 && name !== undefined) {
        exactDuplicates.add(toId(baseSpecies(name)));
        messages.push(
          teamMessage(
            'duplicate-pokemon',
            'warning',
            'Duplicate Pokémon',
            `${name} appears ${String(names.length)} times on this team. Species Clause forbids this in most formats.`,
          ),
        );
      }
    }

    for (const [base, names] of groupBy(team, (species) => toId(baseSpecies(species)))) {
      const distinct = [...new Set(names)];
      if (distinct.length > 1 && !exactDuplicates.has(base)) {
        messages.push(
          teamMessage(
            'duplicate-pokemon',
            'info',
            'Possibly related formes',
            `${distinct.join(' and ')} may be formes of the same Pokémon, which Species Clause would forbid. Ignore this if they are actually different species.`,
          ),
        );
      }
    }

    return messages;
  },
};
