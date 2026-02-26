export interface ValidationSettings {
  readonly requiredLevel: number | null;
  readonly itemClause: boolean;
  readonly flagDuplicateNicknames: boolean;
  readonly suggestProtect: boolean;
}

export const DEFAULT_SETTINGS: ValidationSettings = {
  requiredLevel: 50,
  itemClause: true,
  flagDuplicateNicknames: true,
  suggestProtect: true,
};
