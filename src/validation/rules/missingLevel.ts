import { isSkeletonEntry } from '../helpers';
import { perPokemonRule } from '../ruleKit';

export const missingLevelRule = perPokemonRule('missing-level', (pokemon, { settings }) => {
  if (
    settings.requiredLevel === null ||
    pokemon.species === '' ||
    isSkeletonEntry(pokemon) ||
    pokemon.level !== undefined
  ) {
    return null;
  }
  return {
    severity: 'warning',
    title: 'No level set',
    description: `${pokemon.species} has no level, so Showdown will default it to 100. Teams for your selected format are usually built at level ${String(settings.requiredLevel)}.`,
  };
});
