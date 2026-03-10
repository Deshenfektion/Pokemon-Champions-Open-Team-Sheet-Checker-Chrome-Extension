import { useMemo, useState } from 'react';
import { parseTeam } from '../../parser/parseTeam';
import { DEFAULT_SETTINGS } from '../../shared/types/settings';
import type { ValidationMessage } from '../../shared/types/validation';
import { getDisplayName } from '../../shared/utils/names';
import { runValidation } from '../../validation/engine';
import { allRules } from '../../validation/rules';
import { EmptyState } from './components/EmptyState';
import { ParserNotes } from './components/ParserNotes';
import { PokemonCard } from './components/PokemonCard';
import { SummaryBar } from './components/SummaryBar';
import { TeamInput } from './components/TeamInput';

export const App = () => {
  const [teamText, setTeamText] = useState('');

  const parsed = useMemo(() => parseTeam(teamText), [teamText]);
  const report = useMemo(
    () => runValidation(parsed.team, DEFAULT_SETTINGS, allRules),
    [parsed.team],
  );

  const teamMessages = report.messages.filter((message) => message.pokemonIndex === undefined);
  const messagesFor = (index: number): readonly ValidationMessage[] =>
    report.messages.filter((message) => message.pokemonIndex === index);

  const hasTeam = parsed.team.pokemon.length > 0;

  return (
    <div className="min-h-[300px] bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="bg-indigo-700 px-4 py-3 dark:bg-indigo-950">
        <h1 className="text-base font-bold text-white">Showdown Team Check</h1>
        <p className="text-xs text-indigo-200">Catches accidental mistakes before you battle</p>
      </header>

      <main className="space-y-3 p-3">
        <TeamInput value={teamText} onChange={setTeamText} />

        {hasTeam ? (
          <>
            <SummaryBar report={report} />
            <ParserNotes issues={parsed.issues} />
            <div className="space-y-2">
              {teamMessages.length > 0 && (
                <PokemonCard name="Whole team" messages={teamMessages} />
              )}
              {parsed.team.pokemon.map((pokemon, index) => (
                <PokemonCard
                  key={index}
                  name={getDisplayName(pokemon, index)}
                  subtitle={
                    pokemon.nickname !== undefined && pokemon.species !== ''
                      ? `“${pokemon.nickname}”`
                      : undefined
                  }
                  messages={messagesFor(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};
