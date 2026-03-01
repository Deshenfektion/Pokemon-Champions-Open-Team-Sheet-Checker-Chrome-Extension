import { describe, expect, it } from 'vitest';
import { parseIdentityLine } from './identityLine';

describe('parseIdentityLine', () => {
  it('parses a bare species', () => {
    expect(parseIdentityLine('Garchomp')).toEqual({ species: 'Garchomp', issues: [] });
  });

  it('parses species with item', () => {
    const result = parseIdentityLine('Garchomp @ Choice Scarf');
    expect(result.species).toBe('Garchomp');
    expect(result.item).toBe('Choice Scarf');
  });

  it('parses nickname, species and item, stripping the gender marker', () => {
    const result = parseIdentityLine('Chompy (Garchomp) (F) @ Rocky Helmet');
    expect(result).toEqual({
      species: 'Garchomp',
      nickname: 'Chompy',
      item: 'Rocky Helmet',
      issues: [],
    });
  });

  it('strips a gender marker without a nickname', () => {
    const result = parseIdentityLine('Incineroar (M) @ Sitrus Berry');
    expect(result.species).toBe('Incineroar');
    expect(result.nickname).toBeUndefined();
  });

  it('keeps hyphenated forme names intact', () => {
    const result = parseIdentityLine('Urshifu-Rapid-Strike @ Focus Sash');
    expect(result.species).toBe('Urshifu-Rapid-Strike');
  });

  it('supports nicknames containing parentheses', () => {
    const result = parseIdentityLine('Cool (very) (Snorlax)');
    expect(result.species).toBe('Snorlax');
    expect(result.nickname).toBe('Cool (very)');
  });

  it('reports a dangling item marker instead of throwing', () => {
    const result = parseIdentityLine('Garchomp @');
    expect(result.species).toBe('Garchomp');
    expect(result.item).toBeUndefined();
    expect(result.issues).toHaveLength(1);
  });

  it('reports an unreadable species', () => {
    const result = parseIdentityLine('@ Leftovers');
    expect(result.species).toBe('');
    expect(result.item).toBe('Leftovers');
    expect(result.issues).toHaveLength(1);
  });
});
