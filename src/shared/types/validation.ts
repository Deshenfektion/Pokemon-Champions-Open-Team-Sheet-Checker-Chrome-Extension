import type { Team } from './pokemon';
import type { ValidationSettings } from './settings';

export type Severity = 'info' | 'warning' | 'error';

export const SEVERITY_ORDER: Readonly<Record<Severity, number>> = {
  error: 0,
  warning: 1,
  info: 2,
};

export interface ValidationMessage {
  readonly ruleId: string;
  readonly severity: Severity;
  readonly pokemonIndex?: number;
  readonly pokemonName?: string;
  readonly title: string;
  readonly description: string;
}

export interface ValidationRule {
  readonly id: string;
  readonly validate: (team: Team, settings: ValidationSettings) => readonly ValidationMessage[];
}

export interface SeverityCounts {
  readonly info: number;
  readonly warning: number;
  readonly error: number;
}

export interface ValidationReport {
  readonly messages: readonly ValidationMessage[];
  readonly pokemonCount: number;
  readonly rulesExecuted: number;
  readonly counts: SeverityCounts;
}
