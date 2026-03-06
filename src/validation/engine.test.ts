import { describe, expect, it, vi } from 'vitest';
import type { ValidationRule } from '../shared/types/validation';
import { makePokemon, makeSettings, makeTeam } from '../testing/builders';
import { runValidation } from './engine';
import { allRules } from './rules';

const settings = makeSettings();

describe('runValidation', () => {
  it('reports a clean team as message-free', () => {
    const team = makeTeam(makePokemon());
    const report = runValidation(team, settings, allRules);
    expect(report.messages).toEqual([]);
    expect(report.pokemonCount).toBe(1);
    expect(report.rulesExecuted).toBe(allRules.length);
    expect(report.counts).toEqual({ info: 0, warning: 0, error: 0 });
  });

  it('aggregates severity counts', () => {
    const team = makeTeam(
      makePokemon({ item: undefined }),
      makePokemon({ species: 'Dragonite', moves: ['Extreme Speed', ''] }),
    );
    const report = runValidation(team, settings, allRules);
    expect(report.counts.warning).toBeGreaterThan(0);
    expect(report.counts.error).toBeGreaterThan(0);
    expect(report.messages).toHaveLength(
      report.counts.info + report.counts.warning + report.counts.error,
    );
  });

  it('sorts team-level messages first, then by Pokémon and severity', () => {
    const team = makeTeam(
      makePokemon({ nickname: 'Bob', moves: ['Protect', 'Protect'] }),
      makePokemon({ species: 'Dragonite', nickname: 'Bob' }),
    );
    const report = runValidation(team, settings, allRules);
    const indexes = report.messages.map((message) => message.pokemonIndex ?? -1);
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b));
    const first = report.messages.filter((message) => message.pokemonIndex === 0);
    expect(first[0]?.severity).toBe('error');
  });

  it('survives a rule that throws', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const brokenRule: ValidationRule = {
      id: 'broken',
      validate: () => {
        throw new Error('boom');
      },
    };
    const report = runValidation(makeTeam(makePokemon()), settings, [brokenRule, ...allRules]);
    expect(report.messages).toEqual([]);
    expect(report.rulesExecuted).toBe(allRules.length + 1);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it('handles an empty team', () => {
    const report = runValidation(makeTeam(), settings, allRules);
    expect(report.messages).toEqual([]);
    expect(report.pokemonCount).toBe(0);
  });
});
