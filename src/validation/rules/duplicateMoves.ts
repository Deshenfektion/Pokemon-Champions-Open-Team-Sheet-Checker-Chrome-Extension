import { toId } from '../../shared/utils/names';
import { nonEmptyMoves } from '../helpers';
import { perPokemonRule } from '../ruleKit';

export const duplicateMovesRule = perPokemonRule('duplicate-moves', (pokemon) => {
  if (pokemon.species === '') {
    return null;
  }
  const seen = new Map<string, string>();
  const duplicates = new Set<string>();
  for (const move of nonEmptyMoves(pokemon)) {
    const id = toId(move);
    const original = seen.get(id);
    if (original !== undefined) {
      duplicates.add(original);
    } else {
      seen.set(id, move);
    }
  }
  if (duplicates.size === 0) {
    return null;
  }
  return {
    severity: 'error',
    title: 'Duplicate moves',
    description: `${pokemon.species} lists ${[...duplicates].join(', ')} more than once. One of the slots was probably meant to be a different move.`,
  };
});
