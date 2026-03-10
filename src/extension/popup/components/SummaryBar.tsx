import type { ValidationReport } from '../../../shared/types/validation';

interface SummaryBarProps {
  readonly report: ValidationReport;
}

interface TileProps {
  readonly value: number;
  readonly label: string;
  readonly tone: 'neutral' | 'warning' | 'error';
}

const TONES: Readonly<Record<TileProps['tone'], string>> = {
  neutral: 'text-slate-700 dark:text-slate-200',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
};

const Tile = ({ value, label, tone }: TileProps) => {
  const active = tone === 'neutral' || value > 0;
  return (
    <div className="flex flex-col items-center rounded-lg bg-white px-2 py-1.5 shadow-sm dark:bg-slate-800">
      <span
        className={`text-lg font-bold ${active ? TONES[tone] : 'text-emerald-600 dark:text-emerald-400'}`}
      >
        {value}
      </span>
      <span className="text-[11px] text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
};

export const SummaryBar = ({ report }: SummaryBarProps) => (
  <div>
    <div className="grid grid-cols-4 gap-2">
      <Tile value={report.pokemonCount} label="Pokémon" tone="neutral" />
      <Tile value={report.rulesExecuted} label="Checks" tone="neutral" />
      <Tile value={report.counts.warning} label="Warnings" tone="warning" />
      <Tile value={report.counts.error} label="Errors" tone="error" />
    </div>
    {report.counts.info > 0 && (
      <p className="mt-1.5 text-center text-[11px] text-slate-500 dark:text-slate-400">
        plus {report.counts.info} optional {report.counts.info === 1 ? 'suggestion' : 'suggestions'}
      </p>
    )}
  </div>
);
