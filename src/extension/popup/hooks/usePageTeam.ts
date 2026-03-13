import { useCallback, useEffect, useState } from 'react';
import type { TeamSource } from '../teamSource';
import { activePageTeamSource } from '../teamSource';

export type PageTeamStatus = 'reading' | 'loaded' | 'unavailable';

export interface UsePageTeamResult {
  readonly status: PageTeamStatus;
  readonly refresh: () => void;
}

export const usePageTeam = (
  onTeam: (teamText: string) => void,
  source: TeamSource = activePageTeamSource,
): UsePageTeamResult => {
  const [status, setStatus] = useState<PageTeamStatus>('reading');

  const read = useCallback(async () => {
    const teamText = await source.read();
    setStatus(teamText === null ? 'unavailable' : 'loaded');
    if (teamText !== null) {
      onTeam(teamText);
    }
  }, [source, onTeam]);

  useEffect(() => {
    void read();
  }, [read]);

  const refresh = useCallback(() => {
    setStatus('reading');
    void read();
  }, [read]);

  return { status, refresh };
};
