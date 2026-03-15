import type { Pokemon } from '../shared/types/pokemon';

export const nonEmptyMoves = (pokemon: Pokemon): readonly string[] =>
  pokemon.moves.filter((move) => move.trim() !== '');

export const isSkeletonEntry = (pokemon: Pokemon): boolean =>
  pokemon.ability === undefined &&
  pokemon.item === undefined &&
  nonEmptyMoves(pokemon).length === 0;
