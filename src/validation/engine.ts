import type { Team } from '../shared/types/pokemon';
import type { ValidationSettings } from '../shared/types/settings';
import type {
  SeverityCounts,
  ValidationMessage,
  ValidationReport,
  ValidationRule,
} from '../shared/types/validation';
import { SEVERITY_ORDER } from '../shared/types/validation';

const collectMessages = (
  team: Team,
  settings: ValidationSettings,
  rules: readonly ValidationRule[],
): readonly ValidationMessage[] =>
  rules.flatMap((rule) => {
    try {
      return rule.validate(team, settings);
    } catch (error) {
      console.warn(`Validation rule "${rule.id}" failed and was skipped`, error);
      return [];
    }
  });

const sortMessages = (messages: readonly ValidationMessage[]): readonly ValidationMessage[] =>
  [...messages].sort((a, b) => {
    const indexA = a.pokemonIndex ?? -1;
    const indexB = b.pokemonIndex ?? -1;
    if (indexA !== indexB) {
      return indexA - indexB;
    }
    return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
  });

const countBySeverity = (messages: readonly ValidationMessage[]): SeverityCounts =>
  messages.reduce<SeverityCounts>(
    (counts, message) => ({ ...counts, [message.severity]: counts[message.severity] + 1 }),
    { info: 0, warning: 0, error: 0 },
  );

export const runValidation = (
  team: Team,
  settings: ValidationSettings,
  rules: readonly ValidationRule[],
): ValidationReport => {
  const messages = sortMessages(collectMessages(team, settings, rules));
  return {
    messages,
    pokemonCount: team.pokemon.length,
    rulesExecuted: rules.length,
    counts: countBySeverity(messages),
  };
};
