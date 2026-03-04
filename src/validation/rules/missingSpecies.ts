import { perPokemonRule } from '../ruleKit';

export const missingSpeciesRule = perPokemonRule('missing-species', (pokemon) => {
  if (pokemon.species !== '') {
    return null;
  }
  return {
    severity: 'error',
    title: 'Missing species',
    description:
      'This entry has no readable species name. It may be a leftover fragment from editing your team.',
  };
});
