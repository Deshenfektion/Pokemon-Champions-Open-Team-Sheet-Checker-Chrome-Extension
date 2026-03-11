import type { ValidationSettings } from '../../shared/types/settings';
import { DEFAULT_SETTINGS } from '../../shared/types/settings';

const STORAGE_KEY = 'validationSettings';

const hasChromeStorage = (): boolean =>
  typeof chrome !== 'undefined' && chrome.storage?.sync !== undefined;

const sanitize = (value: unknown): ValidationSettings => {
  if (typeof value !== 'object' || value === null) {
    return DEFAULT_SETTINGS;
  }
  const record = value as Partial<Record<keyof ValidationSettings, unknown>>;
  return {
    requiredLevel:
      typeof record.requiredLevel === 'number' || record.requiredLevel === null
        ? record.requiredLevel
        : DEFAULT_SETTINGS.requiredLevel,
    itemClause:
      typeof record.itemClause === 'boolean' ? record.itemClause : DEFAULT_SETTINGS.itemClause,
    flagDuplicateNicknames:
      typeof record.flagDuplicateNicknames === 'boolean'
        ? record.flagDuplicateNicknames
        : DEFAULT_SETTINGS.flagDuplicateNicknames,
    suggestProtect:
      typeof record.suggestProtect === 'boolean'
        ? record.suggestProtect
        : DEFAULT_SETTINGS.suggestProtect,
  };
};

export const loadSettings = async (): Promise<ValidationSettings> => {
  try {
    if (hasChromeStorage()) {
      const stored = await chrome.storage.sync.get(STORAGE_KEY);
      return sanitize(stored[STORAGE_KEY]);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? DEFAULT_SETTINGS : sanitize(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: ValidationSettings): Promise<void> => {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  } catch {
    // Settings that fail to persist still apply for the current session.
  }
};
