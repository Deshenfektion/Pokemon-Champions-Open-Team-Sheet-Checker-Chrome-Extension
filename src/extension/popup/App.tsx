import { useState } from 'react';
import { AllClearBanner } from './components/AllClearBanner';
import { EmptyState } from './components/EmptyState';
import { ParserNotes } from './components/ParserNotes';
import { PokemonCard } from './components/PokemonCard';
import { SettingsPanel } from './components/SettingsPanel';
import { SourceBanner } from './components/SourceBanner';
import { SummaryBar } from './components/SummaryBar';
import { TeamInput } from './components/TeamInput';
import { usePageTeam } from './hooks/usePageTeam';
import { useSettings } from './hooks/useSettings';
import { useTeamReport } from './hooks/useTeamReport';

export const App = () => {
  const [teamText, setTeamText] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();
  const pageTeam = usePageTeam(setTeamText);
  const view = useTeamReport(teamText, settings);

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
        <SourceBanner status={pageTeam.status} onRefresh={pageTeam.refresh} />
        <TeamInput value={teamText} onChange={setTeamText} />

        {view.hasTeam ? (
          <>
            <SummaryBar report={view.report} />
            {view.allClear && (
              <AllClearBanner
                pokemonCount={view.report.pokemonCount}
                infoCount={view.report.counts.info}
              />
            )}
            <ParserNotes issues={view.parseIssues} />
            <div className="space-y-2">
              {view.teamMessages.length > 0 && (
                <PokemonCard name="Whole team" messages={view.teamMessages} />
              )}
              {view.groups.map((group, index) => (
                <PokemonCard
                  key={`${group.name}-${String(index)}`}
                  name={group.name}
                  subtitle={group.subtitle}
                  messages={group.messages}
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
