import type { GetTeamResponse } from '../../shared/messages';
import { GET_TEAM_MESSAGE } from '../../shared/messages';

export interface TeamSource {
  readonly read: () => Promise<string | null>;
}

export const activePageTeamSource: TeamSource = {
  read: async () => {
    if (typeof chrome === 'undefined' || chrome.tabs === undefined) {
      return null;
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id === undefined) {
      return null;
    }
    try {
      const response = (await chrome.tabs.sendMessage(tab.id, {
        type: GET_TEAM_MESSAGE,
      })) as GetTeamResponse | undefined;
      return response?.teamText ?? null;
    } catch {
      return null;
    }
  },
};
