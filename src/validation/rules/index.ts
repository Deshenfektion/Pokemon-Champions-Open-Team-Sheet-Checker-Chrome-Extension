import type { ValidationRule } from '../../shared/types/validation';
import { duplicateMovesRule } from './duplicateMoves';
import { duplicatePokemonRule } from './duplicatePokemon';
import { emptyMoveRule } from './emptyMove';
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
  emptyMoveRule,
  duplicateMovesRule,
  duplicatePokemonRule,
];
