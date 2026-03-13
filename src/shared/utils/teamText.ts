export const looksLikeTeamExport = (text: string): boolean => {
  if (text.trim() === '') {
    return false;
  }
  return /^\s*-\s+\S/m.test(text) || /^\s*Ability:/m.test(text) || text.includes(' @ ');
};
