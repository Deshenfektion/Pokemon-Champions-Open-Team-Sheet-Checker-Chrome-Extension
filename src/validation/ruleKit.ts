import type { Pokemon, Team } from '../shared/types/pokemon';
import type { ValidationSettings } from '../shared/types/settings';
import type { Severity, ValidationMessage, ValidationRule } from '../shared/types/validation';
import { getDisplayName } from '../shared/utils/names';

export interface RuleFinding {
  readonly severity: Severity;
  readonly title: string;
  readonly description: string;
}

export interface PokemonContext {
  readonly index: number;
  readonly team: Team;
  readonly settings: ValidationSettings;
}

export const perPokemonRule = (
  id: string,
  check: (pokemon: Pokemon, context: PokemonContext) => RuleFinding | null,
): ValidationRule => ({
  id,
  validate: (team, settings) =>
    team.pokemon.flatMap((pokemon, index) => {
      const finding = check(pokemon, { index, team, settings });
      if (finding === null) {
        return [];
      }
      return [
        {
          ruleId: id,
          pokemonIndex: index,
          pokemonName: getDisplayName(pokemon, index),
          ...finding,
        },
      ];
    }),
});

export const teamMessage = (
  ruleId: string,
  severity: Severity,
  title: string,
  description: string,
): ValidationMessage => ({ ruleId, severity, title, description });
