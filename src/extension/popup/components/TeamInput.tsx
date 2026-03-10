interface TeamInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

const PLACEHOLDER = `Paste your team here, e.g.

Garchomp @ Choice Scarf
Ability: Rough Skin
Level: 50
Jolly Nature
- Earthquake
- Dragon Claw
- Rock Slide
- Protect`;

export const TeamInput = ({ value, onChange }: TeamInputProps) => (
  <div className="relative">
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={PLACEHOLDER}
      spellCheck={false}
      rows={value.trim() === '' ? 8 : 4}
      className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900"
    />
    {value !== '' && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="absolute top-2 right-2 rounded px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
      >
        Clear
      </button>
    )}
  </div>
);
