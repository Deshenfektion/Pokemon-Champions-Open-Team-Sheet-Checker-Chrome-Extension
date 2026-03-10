export const EmptyState = () => (
  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center dark:border-slate-600">
    <p className="text-2xl">🔍</p>
    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      No team to check yet
    </p>
    <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
      In the Showdown Teambuilder, open your team, press{' '}
      <span className="font-semibold">Import/Export</span>, copy the text and paste it above.
    </p>
  </div>
);
