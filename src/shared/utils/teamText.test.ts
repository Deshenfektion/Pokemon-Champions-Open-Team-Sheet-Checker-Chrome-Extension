import { describe, expect, it } from 'vitest';
import { looksLikeTeamExport } from './teamText';

describe('looksLikeTeamExport', () => {
  it('recognizes a standard export', () => {
    expect(looksLikeTeamExport('Garchomp @ Choice Scarf\nAbility: Rough Skin\n- Earthquake')).toBe(
      true,
    );
  });

  it('recognizes a minimal export with only moves', () => {
    expect(looksLikeTeamExport('Pikachu\n- Thunderbolt')).toBe(true);
  });

  it('rejects empty and whitespace-only text', () => {
    expect(looksLikeTeamExport('')).toBe(false);
    expect(looksLikeTeamExport('   \n  ')).toBe(false);
  });

  it('rejects ordinary chat text', () => {
    expect(looksLikeTeamExport('hello, want to battle later?')).toBe(false);
  });

  it('rejects markdown-style lists without team structure', () => {
    expect(looksLikeTeamExport('-')).toBe(false);
  });
});
