import { perPokemonRule } from '../ruleKit';

export const emptyMoveRule = perPokemonRule('empty-move', (pokemon) => {
  if (pokemon.species === '') {
    return null;
  }
  const emptySlots = pokemon.moves.filter((move) => move.trim() === '').length;
  if (emptySlots === 0) {
    return null;
  }
  return {
    severity: 'error',
    title: 'Empty move slot',
    description: `${pokemon.species} has ${String(emptySlots)} empty move ${
      emptySlots === 1 ? 'slot' : 'slots'
    } — a move line exists but no move is filled in.`,
  };
});
