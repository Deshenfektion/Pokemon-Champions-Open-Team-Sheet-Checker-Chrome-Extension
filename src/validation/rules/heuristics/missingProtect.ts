import { COMMON_VGC_SUPPORT_SPECIES, PROTECT_LIKE_MOVES } from '../../../shared/data/vgcSupport';
import { baseSpecies, toId } from '../../../shared/utils/names';
import { isSkeletonEntry, nonEmptyMoves } from '../../helpers';
import { perPokemonRule } from '../../ruleKit';

const isCommonSupport = (species: string): boolean =>
  COMMON_VGC_SUPPORT_SPECIES.has(toId(species)) ||
  COMMON_VGC_SUPPORT_SPECIES.has(toId(baseSpecies(species)));

export const missingProtectRule = perPokemonRule('missing-protect', (pokemon, { settings }) => {
  if (
    !settings.suggestProtect ||
    pokemon.species === '' ||
    isSkeletonEntry(pokemon) ||
    !isCommonSupport(pokemon.species)
  ) {
    return null;
  }
  const moves = nonEmptyMoves(pokemon);
  if (moves.length < 4 || moves.some((move) => PROTECT_LIKE_MOVES.has(toId(move)))) {
    return null;
  }
  return {
    severity: 'info',
    title: 'No Protect',
    description: `${pokemon.species} is a common VGC support Pokémon but has no Protect-like move. Plenty of sets skip it on purpose — this is only a nudge to double-check.`,
  };
});
