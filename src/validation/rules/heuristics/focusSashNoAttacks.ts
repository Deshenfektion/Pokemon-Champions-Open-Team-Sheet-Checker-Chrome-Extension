import { FOCUS_SASH } from '../../../shared/data/items';
import { COMMON_STATUS_MOVES } from '../../../shared/data/statusMoves';
import { toId } from '../../../shared/utils/names';
import { nonEmptyMoves } from '../../helpers';
import { perPokemonRule } from '../../ruleKit';

export const focusSashNoAttacksRule = perPokemonRule('focus-sash-no-attacks', (pokemon) => {
  if (pokemon.species === '' || pokemon.item === undefined || toId(pokemon.item) !== FOCUS_SASH) {
    return null;
  }
  const moves = nonEmptyMoves(pokemon);
  if (moves.length === 0 || moves.some((move) => !COMMON_STATUS_MOVES.has(toId(move)))) {
    return null;
  }
  return {
    severity: 'info',
    title: 'Focus Sash without attacks',
    description: `${pokemon.species} holds a Focus Sash but seems to run only status moves. That can be fine for dedicated leads — just making sure it is deliberate (move classification is approximate).`,
  };
});
