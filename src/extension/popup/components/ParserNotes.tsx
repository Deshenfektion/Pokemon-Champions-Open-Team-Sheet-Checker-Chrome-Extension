import type { ParseIssue } from '../../../shared/types/parsing';

interface ParserNotesProps {
  readonly issues: readonly ParseIssue[];
}

export const ParserNotes = ({ issues }: ParserNotesProps) => {
  if (issues.length === 0) {
    return null;
  }
  return (
    <details className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      <summary className="cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
        {issues.length} {issues.length === 1 ? 'line' : 'lines'} could not be fully read
      </summary>
      <ul className="mt-2 space-y-1.5">
        {issues.map((issue, index) => (
          <li key={index} className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-mono text-slate-400 dark:text-slate-500">L{issue.line}</span>{' '}
            <span className="font-mono">{issue.content}</span> — {issue.message}
          </li>
        ))}
      </ul>
    </details>
  );
};
