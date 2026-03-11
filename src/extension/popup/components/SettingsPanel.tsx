import type { ValidationSettings } from '../../../shared/types/settings';

interface SettingsPanelProps {
  readonly settings: ValidationSettings;
  readonly onChange: (patch: Partial<ValidationSettings>) => void;
}

interface ToggleProps {
  readonly label: string;
  readonly hint: string;
  readonly checked: boolean;
  readonly onToggle: (checked: boolean) => void;
}

const Toggle = ({ label, hint, checked, onToggle }: ToggleProps) => (
  <label className="flex cursor-pointer items-start justify-between gap-3 py-2">
    <span>
      <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <span className="block text-xs text-slate-500 dark:text-slate-400">{hint}</span>
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onToggle(event.target.checked)}
      className="mt-1 h-4 w-4 accent-indigo-600"
    />
  </label>
);

export const SettingsPanel = ({ settings, onChange }: SettingsPanelProps) => (
  <div className="rounded-lg border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-center justify-between gap-3 py-2">
      <span>
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Expected level
        </span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">
          Warn when a Pokémon has no level set
        </span>
      </span>
      <select
        value={settings.requiredLevel === null ? 'off' : String(settings.requiredLevel)}
        onChange={(event) =>
          onChange({
            requiredLevel:
              event.target.value === 'off' ? null : Number.parseInt(event.target.value, 10),
          })
        }
        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
      >
        <option value="50">Level 50 (VGC)</option>
        <option value="100">Level 100</option>
        <option value="off">Don't check</option>
      </select>
    </div>
    <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-700/60 dark:border-slate-700/60">
      <Toggle
        label="Item Clause"
        hint="Warn when two Pokémon hold the same item (VGC)"
        checked={settings.itemClause}
        onToggle={(itemClause) => onChange({ itemClause })}
      />
      <Toggle
        label="Duplicate nicknames"
        hint="Note when several Pokémon share a nickname"
        checked={settings.flagDuplicateNicknames}
        onToggle={(flagDuplicateNicknames) => onChange({ flagDuplicateNicknames })}
      />
      <Toggle
        label="Protect suggestions"
        hint="Nudge when a common VGC support Pokémon lacks Protect"
        checked={settings.suggestProtect}
        onToggle={(suggestProtect) => onChange({ suggestProtect })}
      />
    </div>
  </div>
);
