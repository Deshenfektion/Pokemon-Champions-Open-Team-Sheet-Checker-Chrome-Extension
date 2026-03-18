import { describe, expect, it } from 'vitest';
import { makePokemon, makeSettings, makeTeam } from '../../../testing/builders';
import { choiceItemStatusMovesRule } from './choiceItemStatusMoves';
import { focusSashNoAttacksRule } from './focusSashNoAttacks';
import { missingProtectRule } from './missingProtect';
import { nicknameMatchesSpeciesRule } from './nicknameMatchesSpecies';

const settings = makeSettings();

describe('choiceItemStatusMovesRule', () => {
  it('suggests reviewing a Choice item on a mostly-status set', () => {
    const pokemon = makePokemon({
      item: 'Choice Specs',
      moves: ['Trick', 'Thunder Wave', 'Protect', 'Thunderbolt'],
    });
    const messages = choiceItemStatusMovesRule.validate(makeTeam(pokemon), settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('info');
  });

  it('stays silent with two or more attacks', () => {
    const pokemon = makePokemon({
      item: 'Choice Scarf',
      moves: ['Earthquake', 'Rock Slide', 'Protect', 'Substitute'],
    });
    expect(choiceItemStatusMovesRule.validate(makeTeam(pokemon), settings)).toEqual([]);
  });

  it('stays silent on barely-built sets', () => {
    const pokemon = makePokemon({ item: 'Choice Band', moves: ['Protect'] });
    expect(choiceItemStatusMovesRule.validate(makeTeam(pokemon), settings)).toEqual([]);
  });
});

describe('focusSashNoAttacksRule', () => {
  it('suggests reviewing a Focus Sash with only status moves', () => {
    const pokemon = makePokemon({
      item: 'Focus Sash',
      moves: ['Spore', 'Rage Powder', 'Protect', 'Tailwind'],
    });
    const messages = focusSashNoAttacksRule.validate(makeTeam(pokemon), settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('info');
  });

  it('stays silent once any attack is present', () => {
    const pokemon = makePokemon({ item: 'Focus Sash', moves: ['Spore', 'Sludge Bomb'] });
    expect(focusSashNoAttacksRule.validate(makeTeam(pokemon), settings)).toEqual([]);
  });
});

describe('nicknameMatchesSpeciesRule', () => {
  it('notes a nickname identical to the species', () => {
    const pokemon = makePokemon({ nickname: 'garchomp' });
    const messages = nicknameMatchesSpeciesRule.validate(makeTeam(pokemon), settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('info');
  });

  it('accepts a real nickname', () => {
    const pokemon = makePokemon({ nickname: 'Chompy' });
    expect(nicknameMatchesSpeciesRule.validate(makeTeam(pokemon), settings)).toEqual([]);
  });
});

describe('missingProtectRule', () => {
  const incineroar = makePokemon({
    species: 'Incineroar',
    moves: ['Fake Out', 'Flare Blitz', 'Knock Off', 'Parting Shot'],
  });

  it('nudges a common support Pokémon without a Protect-like move', () => {
    const messages = missingProtectRule.validate(makeTeam(incineroar), settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('info');
  });

  it('accepts Detect as a Protect equivalent', () => {
    const withDetect = makePokemon({
      species: 'Incineroar',
      moves: ['Fake Out', 'Flare Blitz', 'Knock Off', 'Detect'],
    });
    expect(missingProtectRule.validate(makeTeam(withDetect), settings)).toEqual([]);
  });

  it('stays silent for unfinished movesets', () => {
    const unfinished = makePokemon({ species: 'Incineroar', moves: ['Fake Out'] });
    expect(missingProtectRule.validate(makeTeam(unfinished), settings)).toEqual([]);
  });

  it('can be disabled in settings', () => {
    const messages = missingProtectRule.validate(
      makeTeam(incineroar),
      makeSettings({ suggestProtect: false }),
    );
    expect(messages).toEqual([]);
  });

  it('ignores non-support species', () => {
    expect(missingProtectRule.validate(makeTeam(makePokemon()), settings)).toEqual([]);
  });
});
