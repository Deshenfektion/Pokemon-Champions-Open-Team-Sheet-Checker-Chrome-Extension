import { looksLikeTeamExport } from '../../shared/utils/teamText';

// The Teambuilder's import/export view renders the team as a plain textarea.
// Matching on content rather than Showdown's internal class names keeps this
// working across client updates; if nothing matches, the popup falls back to
// its manual paste workflow.
export const extractTeamText = (root: ParentNode = document): string | null => {
  const textareas = [...root.querySelectorAll('textarea')];
  const candidates = textareas
    .map((textarea) => textarea.value)
    .filter((value) => looksLikeTeamExport(value));
  return candidates.reduce<string | null>(
    (best, value) => (best === null || value.length > best.length ? value : best),
    null,
  );
};
