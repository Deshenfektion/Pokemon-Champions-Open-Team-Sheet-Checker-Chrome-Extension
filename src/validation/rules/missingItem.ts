import { isSkeletonEntry } from '../helpers';
import { perPokemonRule } from '../ruleKit';

export const missingItemRule = perPokemonRule('missing-item', (pokemon) => {
  if (pokemon.species === '' || isSkeletonEntry(pokemon) || pokemon.item !== undefined) {
    return null;
  }
  return {
    severity: 'warning',
    title: 'No held item',
    description: `${pokemon.species} has no held item. Tournament Pokémon almost always hold one — was this intentional?`,
  };
});
