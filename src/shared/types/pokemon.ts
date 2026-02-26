export interface Pokemon {
  readonly species: string;
  readonly nickname?: string;
  readonly item?: string;
  readonly ability?: string;
  readonly nature?: string;
  readonly level?: number;
  readonly shiny?: boolean;
  readonly moves: readonly string[];
}

export interface Team {
  readonly pokemon: readonly Pokemon[];
}

export const EMPTY_TEAM: Team = { pokemon: [] };
