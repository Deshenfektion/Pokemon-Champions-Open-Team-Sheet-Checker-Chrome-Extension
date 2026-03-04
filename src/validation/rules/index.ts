import type { ValidationRule } from '../../shared/types/validation';
import { incompleteEntryRule } from './incompleteEntry';
import { missingSpeciesRule } from './missingSpecies';

export const allRules: readonly ValidationRule[] = [missingSpeciesRule, incompleteEntryRule];
