import { toId } from '../../../shared/utils/names';
import { perPokemonRule } from '../../ruleKit';

export const nicknameMatchesSpeciesRule = perPokemonRule('nickname-matches-species', (pokemon) => {
  if (
    pokemon.species === '' ||
    pokemon.nickname === undefined ||
    toId(pokemon.nickname) !== toId(pokemon.species)
  ) {
    return null;
  }
  return {
    severity: 'info',
    title: 'Nickname equals species',
    description: `${pokemon.species} is nicknamed "${pokemon.nickname}", which is identical to its species name. Harmless — but possibly a leftover from importing.`,
  };
});
