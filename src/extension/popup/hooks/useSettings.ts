import { useCallback, useEffect, useState } from 'react';
import type { ValidationSettings } from '../../../shared/types/settings';
import { DEFAULT_SETTINGS } from '../../../shared/types/settings';
import { loadSettings, saveSettings } from '../settingsStorage';

export interface UseSettingsResult {
  readonly settings: ValidationSettings;
  readonly updateSettings: (patch: Partial<ValidationSettings>) => void;
}

export const useSettings = (): UseSettingsResult => {
  const [settings, setSettings] = useState<ValidationSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    void loadSettings().then((loaded) => {
      if (!cancelled) {
        setSettings(loaded);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<ValidationSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
};
