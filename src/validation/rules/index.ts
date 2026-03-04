import type { ValidationRule } from '../../shared/types/validation';
import { missingSpeciesRule } from './missingSpecies';

export const allRules: readonly ValidationRule[] = [missingSpeciesRule];
