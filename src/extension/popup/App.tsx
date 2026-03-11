import { useMemo, useState } from 'react';
import { parseTeam } from '../../parser/parseTeam';
import type { ValidationMessage } from '../../shared/types/validation';
import { getDisplayName } from '../../shared/utils/names';
import { runValidation } from '../../validation/engine';
import { allRules } from '../../validation/rules';
import { EmptyState } from './components/EmptyState';
import { ParserNotes } from './components/ParserNotes';
import { PokemonCard } from './components/PokemonCard';
import { SettingsPanel } from './components/SettingsPanel';
import { SummaryBar } from './components/SummaryBar';
import { TeamInput } from './components/TeamInput';
import { useSettings } from './hooks/useSettings';

export const App = () => {
  const [teamText, setTeamText] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const parsed = useMemo(() => parseTeam(teamText), [teamText]);
  const report = useMemo(
    () => runValidation(parsed.team, settings, allRules),
    [parsed.team, settings],
  );

  const teamMessages = report.messages.filter((message) => message.pokemonIndex === undefined);
  const messagesFor = (index: number): readonly ValidationMessage[] =>
    report.messages.filter((message) => message.pokemonIndex === index);

  const hasTeam = parsed.team.pokemon.length > 0;

  return (
    <div className="min-h-[300px] bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between bg-indigo-700 px-4 py-3 dark:bg-indigo-950">
        <div>
          <h1 className="text-base font-bold text-white">Showdown Team Check</h1>
          <p className="text-xs text-indigo-200">Catches accidental mistakes before you battle</p>
        </div>
        <button
          type="button"
          onClick={() => setSettingsOpen((open) => !open)}
          aria-label="Settings"
          aria-expanded={settingsOpen}
          className={`rounded-full p-1.5 text-lg leading-none transition-colors ${
            settingsOpen
              ? 'bg-indigo-900 text-white dark:bg-indigo-800'
              : 'text-indigo-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-900'
          }`}
        >
          ⚙
        </button>
      </header>

      <main className="space-y-3 p-3">
        {settingsOpen && <SettingsPanel settings={settings} onChange={updateSettings} />}
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
