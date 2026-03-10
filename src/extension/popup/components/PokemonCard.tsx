import { useState } from 'react';
import type { ValidationMessage } from '../../../shared/types/validation';
import { MessageRow } from './MessageRow';
import { SEVERITY_STYLES } from './severityStyles';

interface PokemonCardProps {
  readonly name: string;
  readonly subtitle?: string;
  readonly messages: readonly ValidationMessage[];
}

const CountBadges = ({ messages }: { readonly messages: readonly ValidationMessage[] }) => {
  const severities = ['error', 'warning', 'info'] as const;
  return (
    <span className="flex items-center gap-1">
      {severities.map((severity) => {
        const count = messages.filter((message) => message.severity === severity).length;
        if (count === 0) {
          return null;
        }
        return (
          <span
            key={severity}
            className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${SEVERITY_STYLES[severity].badge}`}
          >
            {count}
          </span>
        );
      })}
    </span>
  );
};

export const PokemonCard = ({ name, subtitle, messages }: PokemonCardProps) => {
  const hasProblems = messages.some((message) => message.severity !== 'info');
  const [expanded, setExpanded] = useState(hasProblems);
  const clean = messages.length === 0;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        disabled={clean}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left enabled:cursor-pointer enabled:hover:bg-slate-50 dark:enabled:hover:bg-slate-700/50"
      >
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {name}
          </span>
          {subtitle !== undefined && (
            <span className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
          )}
        </span>
        {clean ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            ✓ Looks good
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <CountBadges messages={messages} />
            <span
              className={`text-slate-400 transition-transform dark:text-slate-500 ${expanded ? 'rotate-90' : ''}`}
            >
              ›
            </span>
          </span>
        )}
      </button>
      {expanded && !clean && (
        <ul className="divide-y divide-slate-100 border-t border-slate-200 dark:divide-slate-700/60 dark:border-slate-700">
          {messages.map((message, index) => (
            <MessageRow key={`${message.ruleId}-${String(index)}`} message={message} />
          ))}
        </ul>
      )}
    </section>
  );
};
