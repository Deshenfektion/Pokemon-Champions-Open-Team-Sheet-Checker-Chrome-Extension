interface AllClearBannerProps {
  readonly pokemonCount: number;
  readonly infoCount: number;
}

export const AllClearBanner = ({ pokemonCount, infoCount }: AllClearBannerProps) => (
  <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900 dark:bg-emerald-950/50">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
      ✓
    </span>
    <div>
      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        No mistakes found
      </p>
      <p className="text-xs text-emerald-700 dark:text-emerald-400">
        All {pokemonCount} Pokémon passed every check
        {infoCount > 0
          ? `, with ${String(infoCount)} optional ${infoCount === 1 ? 'suggestion' : 'suggestions'} below.`
          : '.'}
      </p>
    </div>
  </div>
);
