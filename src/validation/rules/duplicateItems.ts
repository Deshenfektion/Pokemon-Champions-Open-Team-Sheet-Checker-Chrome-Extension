import type { ValidationRule } from '../../shared/types/validation';
import { toId } from '../../shared/utils/names';
import { teamMessage } from '../ruleKit';

export const duplicateItemsRule: ValidationRule = {
  id: 'duplicate-items',
  validate: (team, settings) => {
    if (!settings.itemClause) {
      return [];
    }
    const holders = new Map<string, { readonly item: string; readonly species: string[] }>();
    for (const pokemon of team.pokemon) {
      if (pokemon.species === '' || pokemon.item === undefined) {
        continue;
      }
      const id = toId(pokemon.item);
      const entry = holders.get(id) ?? { item: pokemon.item, species: [] };
      entry.species.push(pokemon.species);
      holders.set(id, entry);
    }
    return [...holders.values()]
      .filter((entry) => entry.species.length > 1)
      .map((entry) =>
        teamMessage(
          'duplicate-items',
          'warning',
          'Duplicate held item',
          `${entry.species.join(' and ')} both hold ${entry.item}. Item Clause (active in VGC) allows each item only once per team.`,
        ),
      );
  },
};
