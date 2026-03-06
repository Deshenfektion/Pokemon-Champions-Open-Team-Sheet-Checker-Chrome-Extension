import { describe, expect, it } from 'vitest';
import { makePokemon, makeSettings, makeTeam } from '../../testing/builders';
import { duplicateItemsRule } from './duplicateItems';
import { duplicateMovesRule } from './duplicateMoves';
import { duplicateNicknamesRule } from './duplicateNicknames';
import { duplicatePokemonRule } from './duplicatePokemon';

const settings = makeSettings();

describe('duplicateMovesRule', () => {
  it('flags a repeated move as an error', () => {
    const pokemon = makePokemon({ moves: ['Protect', 'Earthquake', 'protect', 'Rock Slide'] });
    const messages = duplicateMovesRule.validate(makeTeam(pokemon), settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('error');
    expect(messages[0]?.description).toContain('Protect');
  });

  it('ignores repeated empty slots', () => {
    const pokemon = makePokemon({ moves: ['', ''] });
    expect(duplicateMovesRule.validate(makeTeam(pokemon), settings)).toEqual([]);
  });
});

describe('duplicatePokemonRule', () => {
  it('warns when the same species appears twice', () => {
    const team = makeTeam(makePokemon(), makePokemon({ item: 'Leftovers' }));
    const messages = duplicatePokemonRule.validate(team, settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('warning');
  });

  it('hints when two formes share a base species', () => {
    const team = makeTeam(
      makePokemon({ species: 'Rotom-Wash' }),
      makePokemon({ species: 'Rotom-Heat' }),
    );
    const messages = duplicatePokemonRule.validate(team, settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('info');
  });

  it('does not double-report formes when the species are exact duplicates', () => {
    const team = makeTeam(
      makePokemon({ species: 'Rotom-Wash' }),
      makePokemon({ species: 'Rotom-Wash' }),
    );
    const messages = duplicatePokemonRule.validate(team, settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('warning');
  });

  it('accepts hyphenated species that merely start alike', () => {
    const team = makeTeam(
      makePokemon({ species: 'Chi-Yu' }),
      makePokemon({ species: 'Chien-Pao' }),
    );
    expect(duplicatePokemonRule.validate(team, settings)).toEqual([]);
  });
});

describe('duplicateItemsRule', () => {
  it('warns when two Pokémon hold the same item', () => {
    const team = makeTeam(makePokemon(), makePokemon({ species: 'Dragonite' }));
    const messages = duplicateItemsRule.validate(team, settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.description).toContain('Choice Scarf');
  });

  it('stays silent when the item clause check is disabled', () => {
    const team = makeTeam(makePokemon(), makePokemon({ species: 'Dragonite' }));
    expect(duplicateItemsRule.validate(team, makeSettings({ itemClause: false }))).toEqual([]);
  });

  it('ignores itemless Pokémon', () => {
    const team = makeTeam(
      makePokemon({ item: undefined }),
      makePokemon({ species: 'Dragonite', item: undefined }),
    );
    expect(duplicateItemsRule.validate(team, settings)).toEqual([]);
  });
});

describe('duplicateNicknamesRule', () => {
  it('notes shared nicknames case-insensitively', () => {
    const team = makeTeam(
      makePokemon({ nickname: 'Bob' }),
      makePokemon({ species: 'Dragonite', nickname: 'bob' }),
    );
    const messages = duplicateNicknamesRule.validate(team, settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('info');
  });

  it('can be disabled', () => {
    const team = makeTeam(
      makePokemon({ nickname: 'Bob' }),
      makePokemon({ species: 'Dragonite', nickname: 'Bob' }),
    );
    const messages = duplicateNicknamesRule.validate(
      team,
      makeSettings({ flagDuplicateNicknames: false }),
    );
    expect(messages).toEqual([]);
  });
});
