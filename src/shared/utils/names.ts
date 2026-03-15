import type { Pokemon } from '../types/pokemon';

export const toId = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]/g, '');

export const baseSpecies = (species: string): string => {
  const dashIndex = species.indexOf('-');
  return dashIndex === -1 ? species : species.slice(0, dashIndex);
};

export const getDisplayName = (pokemon: Pokemon, index: number): string =>
  pokemon.species !== '' ? pokemon.species : (pokemon.nickname ?? `Pokémon #${String(index + 1)}`);
