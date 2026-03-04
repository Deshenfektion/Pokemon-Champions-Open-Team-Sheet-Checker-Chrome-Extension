import { isSkeletonEntry } from '../helpers';
import { perPokemonRule } from '../ruleKit';

export const missingAbilityRule = perPokemonRule('missing-ability', (pokemon) => {
  if (pokemon.species === '' || isSkeletonEntry(pokemon) || pokemon.ability !== undefined) {
    return null;
  }
  return {
    severity: 'warning',
    title: 'Missing ability',
    description: `${pokemon.species} has no ability set. Showdown will pick a default, which may not be the one you want on your team sheet.`,
  };
});
