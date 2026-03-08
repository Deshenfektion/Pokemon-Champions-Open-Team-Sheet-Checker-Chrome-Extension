import type { ValidationRule } from '../../shared/types/validation';
import { duplicateItemsRule } from './duplicateItems';
import { duplicateMovesRule } from './duplicateMoves';
import { duplicateNicknamesRule } from './duplicateNicknames';
import { duplicatePokemonRule } from './duplicatePokemon';
import { emptyMoveRule } from './emptyMove';
import { choiceItemStatusMovesRule } from './heuristics/choiceItemStatusMoves';
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
  duplicateItemsRule,
  duplicateNicknamesRule,
  choiceItemStatusMovesRule,
];
