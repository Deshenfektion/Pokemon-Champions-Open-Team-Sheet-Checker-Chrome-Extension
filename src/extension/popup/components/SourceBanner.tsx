import type { PageTeamStatus } from '../hooks/usePageTeam';

interface SourceBannerProps {
  readonly status: PageTeamStatus;
  readonly onRefresh: () => void;
}

const STATUS_TEXT: Readonly<Record<PageTeamStatus, string>> = {
  reading: 'Looking for an open team on this page…',
  loaded: 'Team read from this Showdown tab',
  unavailable: 'No open team found on this page — paste your export below',
};

export const SourceBanner = ({ status, onRefresh }: SourceBannerProps) => (
  <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
    <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'loaded'
            ? 'bg-emerald-500'
            : status === 'reading'
              ? 'animate-pulse bg-slate-400'
              : 'bg-slate-300 dark:bg-slate-600'
        }`}
      />
      {STATUS_TEXT[status]}
    </span>
    <button
      type="button"
      onClick={onRefresh}
      className="shrink-0 rounded px-1.5 py-0.5 text-xs text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-700"
    >
      ↻ Read again
    </button>
  </div>
);
