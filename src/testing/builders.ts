import type { Pokemon, Team } from '../shared/types/pokemon';
import type { ValidationSettings } from '../shared/types/settings';
import { DEFAULT_SETTINGS } from '../shared/types/settings';

export const makePokemon = (overrides: Partial<Pokemon> = {}): Pokemon => ({
  species: 'Garchomp',
  item: 'Choice Scarf',
  ability: 'Rough Skin',
  nature: 'Jolly',
  level: 50,
  moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Protect'],
  ...overrides,
});

export const makeTeam = (...pokemon: readonly Pokemon[]): Team => ({ pokemon });

export const makeSettings = (overrides: Partial<ValidationSettings> = {}): ValidationSettings => ({
  ...DEFAULT_SETTINGS,
  ...overrides,
});
