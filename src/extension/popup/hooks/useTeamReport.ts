import { useMemo } from 'react';
import { parseTeam } from '../../../parser/parseTeam';
import type { ParseIssue } from '../../../shared/types/parsing';
import type { ValidationSettings } from '../../../shared/types/settings';
import type { ValidationMessage, ValidationReport } from '../../../shared/types/validation';
import { getDisplayName } from '../../../shared/utils/names';
import { runValidation } from '../../../validation/engine';
import { allRules } from '../../../validation/rules';

export interface PokemonGroup {
  readonly name: string;
  readonly subtitle?: string;
  readonly messages: readonly ValidationMessage[];
}

export interface TeamReportView {
  readonly hasTeam: boolean;
  readonly report: ValidationReport;
  readonly parseIssues: readonly ParseIssue[];
  readonly teamMessages: readonly ValidationMessage[];
  readonly groups: readonly PokemonGroup[];
  readonly allClear: boolean;
}

export const useTeamReport = (teamText: string, settings: ValidationSettings): TeamReportView =>
  useMemo(() => {
    const { team, issues } = parseTeam(teamText);
    const report = runValidation(team, settings, allRules);

    const byIndex = new Map<number, ValidationMessage[]>();
    const teamMessages: ValidationMessage[] = [];
    for (const message of report.messages) {
      if (message.pokemonIndex === undefined) {
        teamMessages.push(message);
      } else {
        byIndex.set(message.pokemonIndex, [...(byIndex.get(message.pokemonIndex) ?? []), message]);
      }
    }

    const groups = team.pokemon.map((pokemon, index): PokemonGroup => {
      const nickname =
        pokemon.nickname !== undefined && pokemon.species !== ''
          ? `“${pokemon.nickname}”`
          : undefined;
      return {
        name: getDisplayName(pokemon, index),
        ...(nickname !== undefined ? { subtitle: nickname } : {}),
        messages: byIndex.get(index) ?? [],
      };
    });

    return {
      hasTeam: team.pokemon.length > 0,
      report,
      parseIssues: issues,
      teamMessages,
      groups,
      allClear: report.counts.error === 0 && report.counts.warning === 0,
    };
  }, [teamText, settings]);
