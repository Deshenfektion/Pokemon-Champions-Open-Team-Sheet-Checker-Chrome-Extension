import type { ValidationRule } from '../../shared/types/validation';
import { incompleteEntryRule } from './incompleteEntry';
import { missingAbilityRule } from './missingAbility';
import { missingItemRule } from './missingItem';
import { missingLevelRule } from './missingLevel';
import { missingNatureRule } from './missingNature';
import { missingSpeciesRule } from './missingSpecies';
import { moveCountRule } from './moveCount';

export const allRules: readonly ValidationRule[] = [
  missingSpeciesRule,
  incompleteEntryRule,
  missingItemRule,
  missingAbilityRule,
  missingNatureRule,
  missingLevelRule,
  moveCountRule,
];
