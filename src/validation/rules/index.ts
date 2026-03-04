import type { ValidationRule } from '../../shared/types/validation';
import { incompleteEntryRule } from './incompleteEntry';
import { missingAbilityRule } from './missingAbility';
import { missingItemRule } from './missingItem';
import { missingSpeciesRule } from './missingSpecies';

export const allRules: readonly ValidationRule[] = [
  missingSpeciesRule,
  incompleteEntryRule,
  missingItemRule,
  missingAbilityRule,
];
