import { describe, expect, it } from 'vitest';
import { makePokemon, makeSettings, makeTeam } from '../../testing/builders';
import { emptyMoveRule } from './emptyMove';
import { incompleteEntryRule } from './incompleteEntry';
import { missingAbilityRule } from './missingAbility';
import { missingItemRule } from './missingItem';
import { missingLevelRule } from './missingLevel';
import { missingNatureRule } from './missingNature';
import { missingSpeciesRule } from './missingSpecies';
import { moveCountRule } from './moveCount';

const settings = makeSettings();

describe('missingSpeciesRule', () => {
  it('flags entries without a species as errors', () => {
    const team = makeTeam(makePokemon({ species: '' }));
    const messages = missingSpeciesRule.validate(team, settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('error');
  });

  it('stays silent for named species', () => {
    expect(missingSpeciesRule.validate(makeTeam(makePokemon()), settings)).toEqual([]);
  });
});

describe('incompleteEntryRule', () => {
  it('flags a species-only skeleton entry once', () => {
    const skeleton = makePokemon({
      item: undefined,
      ability: undefined,
      moves: [],
    });
    const messages = incompleteEntryRule.validate(makeTeam(skeleton), settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('warning');
  });

  it('does not flag an entry that has any substance', () => {
    const started = makePokemon({ item: undefined, ability: undefined, moves: ['Tackle'] });
    expect(incompleteEntryRule.validate(makeTeam(started), settings)).toEqual([]);
  });
});

describe('missing-field rules', () => {
  it.each([
    ['item', missingItemRule, makePokemon({ item: undefined })],
    ['ability', missingAbilityRule, makePokemon({ ability: undefined })],
    ['nature', missingNatureRule, makePokemon({ nature: undefined })],
  ] as const)('warns about a missing %s', (_label, rule, pokemon) => {
    const messages = rule.validate(makeTeam(pokemon), settings);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('warning');
  });

  it.each([
    ['item', missingItemRule],
    ['ability', missingAbilityRule],
    ['nature', missingNatureRule],
  ] as const)('stays silent on skeleton entries for %s', (_label, rule) => {
    const skeleton = makePokemon({
      item: undefined,
      ability: undefined,
      nature: undefined,
      moves: [],
    });
    expect(rule.validate(makeTeam(skeleton), settings)).toEqual([]);
  });
});

describe('missingLevelRule', () => {
  it('warns when the format expects a level and none is set', () => {
    const messages = missingLevelRule.validate(
      makeTeam(makePokemon({ level: undefined })),
      makeSettings({ requiredLevel: 50 }),
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.description).toContain('50');
  });

  it('stays silent when no level is required', () => {
    const messages = missingLevelRule.validate(
      makeTeam(makePokemon({ level: undefined })),
      makeSettings({ requiredLevel: null }),
    );
    expect(messages).toEqual([]);
  });
});

describe('moveCountRule', () => {
  it('warns about fewer than four moves', () => {
    const messages = moveCountRule.validate(
      makeTeam(makePokemon({ moves: ['Earthquake', 'Protect', ''] })),
      settings,
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.title).toContain('2');
  });

  it('accepts a full moveset', () => {
    expect(moveCountRule.validate(makeTeam(makePokemon()), settings)).toEqual([]);
  });
});

describe('emptyMoveRule', () => {
  it('reports empty move slots as errors', () => {
    const messages = emptyMoveRule.validate(
      makeTeam(makePokemon({ moves: ['Earthquake', ' ', ''] })),
      settings,
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.severity).toBe('error');
    expect(messages[0]?.description).toContain('2');
  });
});
