import { describe, expect, it } from 'vitest';
import { parseTeam } from './parseTeam';

const FULL_EXPORT = `Chompy (Garchomp) (M) @ Choice Scarf
Ability: Rough Skin
Level: 50
Shiny: Yes
Tera Type: Steel
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
IVs: 0 SpA
- Earthquake
- Dragon Claw
- Rock Slide
- Protect

Flutter Mane @ Booster Energy
Ability: Protosynthesis
Level: 50
Tera Type: Fairy
Timid Nature
- Moonblast
- Shadow Ball
- Dazzling Gleam
- Protect`;

describe('parseTeam', () => {
  it('parses a complete two-Pokémon export', () => {
    const { team, issues } = parseTeam(FULL_EXPORT);
    expect(issues).toEqual([]);
    expect(team.pokemon).toHaveLength(2);

    const chompy = team.pokemon[0];
    expect(chompy).toEqual({
      species: 'Garchomp',
      nickname: 'Chompy',
      item: 'Choice Scarf',
      ability: 'Rough Skin',
      level: 50,
      shiny: true,
      nature: 'Jolly',
      moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Protect'],
    });
  });

  it('returns an empty team for empty input', () => {
    expect(parseTeam('')).toEqual({ team: { pokemon: [] }, issues: [] });
    expect(parseTeam('\n\n  \n')).toEqual({ team: { pokemon: [] }, issues: [] });
  });

  it('ignores EV lines without reporting issues', () => {
    const { team, issues } = parseTeam('Pikachu\nEVs: 252 Atk / 999 Spe / 12 Nonsense');
    expect(issues).toEqual([]);
    expect(team.pokemon[0]?.species).toBe('Pikachu');
  });

  it('ignores Tera Type and IV lines without reporting issues', () => {
    const { team, issues } = parseTeam('Pikachu\nTera Type: Fairy\nIVs: 0 Atk / 99 Spe');
    expect(issues).toEqual([]);
    expect(team.pokemon[0]).toEqual({ species: 'Pikachu', moves: [] });
  });

  it('strips a gender marker without exposing it on the Pokemon', () => {
    const { team, issues } = parseTeam('Incineroar (M)\n- Fake Out');
    expect(issues).toEqual([]);
    expect(team.pokemon[0]).toEqual({ species: 'Incineroar', moves: ['Fake Out'] });
  });

  it('skips team header lines from multi-team exports', () => {
    const { team, issues } = parseTeam('=== [gen9vgc2026] My Team ===\n\nPikachu');
    expect(issues).toEqual([]);
    expect(team.pokemon).toHaveLength(1);
  });

  it('keeps an empty move slot so the validator can flag it', () => {
    const { team } = parseTeam('Pikachu\n- Thunderbolt\n-');
    expect(team.pokemon[0]?.moves).toEqual(['Thunderbolt', '']);
  });

  it('collects an issue for an invalid level but keeps parsing', () => {
    const { team, issues } = parseTeam('Pikachu\nLevel: banana\n- Thunderbolt');
    expect(team.pokemon[0]?.level).toBeUndefined();
    expect(team.pokemon[0]?.moves).toEqual(['Thunderbolt']);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.line).toBe(2);
  });

  it('collects an issue for unrecognized lines instead of throwing', () => {
    const { team, issues } = parseTeam('Pikachu\nsome random note\n- Thunderbolt');
    expect(team.pokemon[0]?.moves).toEqual(['Thunderbolt']);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain('not recognized');
  });

  it('parses a block that is missing its identity line', () => {
    const { team, issues } = parseTeam('Ability: Levitate\n- Shadow Ball');
    expect(team.pokemon).toHaveLength(1);
    expect(team.pokemon[0]).toMatchObject({ species: '', ability: 'Levitate' });
    expect(issues.some((issue) => issue.message.includes('does not start'))).toBe(true);
  });

  it('parses Type: Null as a species, not an attribute line', () => {
    const { team, issues } = parseTeam('Type: Null @ Eviolite\nAbility: Battle Armor');
    expect(issues).toEqual([]);
    expect(team.pokemon[0]).toMatchObject({ species: 'Type: Null', item: 'Eviolite' });
  });

  it('handles Windows line endings', () => {
    const { team } = parseTeam('Pikachu\r\n- Thunderbolt\r\n\r\nEevee\r\n- Tackle');
    expect(team.pokemon.map((p) => p.species)).toEqual(['Pikachu', 'Eevee']);
  });

  it('treats a lone nature word line as a nature', () => {
    const { team } = parseTeam('Pikachu\nModest Nature');
    expect(team.pokemon[0]?.nature).toBe('Modest');
  });

  it('reports a nature line without a nature', () => {
    const { issues } = parseTeam('Pikachu\nNature');
    expect(issues).toHaveLength(1);
  });

  it('reads the legacy Trait key as ability', () => {
    const { team } = parseTeam('Pikachu\nTrait: Static');
    expect(team.pokemon[0]?.ability).toBe('Static');
  });

  it('parses six sparse entries without crashing', () => {
    const blocks = Array.from({ length: 6 }, (_, i) => `Pokemon${String(i)}`).join('\n\n');
    const { team, issues } = parseTeam(blocks);
    expect(team.pokemon).toHaveLength(6);
    expect(issues).toEqual([]);
  });
});
