import type { Team } from './pokemon';

export interface ParseIssue {
  readonly line: number;
  readonly content: string;
  readonly message: string;
}

export interface ParseResult {
  readonly team: Team;
  readonly issues: readonly ParseIssue[];
}
