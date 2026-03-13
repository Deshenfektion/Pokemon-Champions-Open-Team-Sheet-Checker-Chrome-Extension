import type { GetTeamResponse } from '../../shared/messages';
import { isGetTeamRequest } from '../../shared/messages';
import { extractTeamText } from './extractTeam';

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  if (!isGetTeamRequest(message)) {
    return;
  }
  const response: GetTeamResponse = { teamText: extractTeamText() };
  sendResponse(response);
});
