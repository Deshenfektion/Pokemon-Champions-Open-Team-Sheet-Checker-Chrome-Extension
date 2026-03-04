import { isSkeletonEntry } from '../helpers';
import { perPokemonRule } from '../ruleKit';

export const missingNatureRule = perPokemonRule('missing-nature', (pokemon) => {
  if (pokemon.species === '' || isSkeletonEntry(pokemon) || pokemon.nature !== undefined) {
    return null;
  }
  return {
    severity: 'warning',
    title: 'Missing nature',
    description: `${pokemon.species} has no nature set, so it will default to a neutral one. Most tournament sets rely on a specific nature.`,
  };
});
