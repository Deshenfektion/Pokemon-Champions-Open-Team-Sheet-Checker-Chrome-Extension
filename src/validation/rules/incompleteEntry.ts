import { isSkeletonEntry } from '../helpers';
import { perPokemonRule } from '../ruleKit';

export const incompleteEntryRule = perPokemonRule('incomplete-entry', (pokemon) => {
  if (pokemon.species === '' || !isSkeletonEntry(pokemon)) {
    return null;
  }
  return {
    severity: 'warning',
    title: 'Entry looks unfinished',
    description: `${pokemon.species} has no item, no ability and no moves yet. Did you finish building this Pokémon?`,
  };
});
