import { CHOICE_ITEMS } from '../../../shared/data/items';
import { COMMON_STATUS_MOVES } from '../../../shared/data/statusMoves';
import { toId } from '../../../shared/utils/names';
import { nonEmptyMoves } from '../../helpers';
import { perPokemonRule } from '../../ruleKit';

export const choiceItemStatusMovesRule = perPokemonRule('choice-item-status-moves', (pokemon) => {
  if (
    pokemon.species === '' ||
    pokemon.item === undefined ||
    !CHOICE_ITEMS.has(toId(pokemon.item))
  ) {
    return null;
  }
  const moves = nonEmptyMoves(pokemon);
  const attacks = moves.filter((move) => !COMMON_STATUS_MOVES.has(toId(move)));
  if (moves.length < 2 || attacks.length > 1) {
    return null;
  }
  return {
    severity: 'info',
    title: 'Choice item with few attacks',
    description: `${pokemon.species} holds ${pokemon.item} but seems to have ${
      attacks.length === 0 ? 'no attacking moves' : 'only one attacking move'
    }. A Choice item locks it into the first move it uses — just double-checking this is the plan (move classification is approximate).`,
  };
});
