export const GET_TEAM_MESSAGE = 'showdown-team-check/get-team';

export interface GetTeamRequest {
  readonly type: typeof GET_TEAM_MESSAGE;
}

export interface GetTeamResponse {
  readonly teamText: string | null;
}

export const isGetTeamRequest = (value: unknown): value is GetTeamRequest =>
  typeof value === 'object' &&
  value !== null &&
  (value as { type?: unknown }).type === GET_TEAM_MESSAGE;
