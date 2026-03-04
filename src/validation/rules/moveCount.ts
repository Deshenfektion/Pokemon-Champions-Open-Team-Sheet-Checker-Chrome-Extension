import { isSkeletonEntry, nonEmptyMoves } from '../helpers';
import { perPokemonRule } from '../ruleKit';

export const moveCountRule = perPokemonRule('move-count', (pokemon) => {
  if (pokemon.species === '' || isSkeletonEntry(pokemon)) {
    return null;
  }
  const count = nonEmptyMoves(pokemon).length;
  if (count >= 4) {
    return null;
  }
  return {
    severity: 'warning',
    title: count === 0 ? 'No moves' : `Only ${String(count)} ${count === 1 ? 'move' : 'moves'}`,
    description:
      count === 0
        ? `${pokemon.species} has no moves at all. It will only know Struggle in battle.`
        : `${pokemon.species} only has ${String(count)} of 4 possible moves. Was this intentional?`,
  };
});
