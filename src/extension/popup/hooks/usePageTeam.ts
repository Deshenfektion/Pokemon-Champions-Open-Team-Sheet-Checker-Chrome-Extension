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

  const applyResult = useCallback(
    (teamText: string | null) => {
      setStatus(teamText === null ? 'unavailable' : 'loaded');
      if (teamText !== null) {
        onTeam(teamText);
      }
    },
    [onTeam],
  );

  useEffect(() => {
    let cancelled = false;
    void source.read().then((teamText) => {
      if (!cancelled) {
        applyResult(teamText);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [source, applyResult]);

  const refresh = useCallback(() => {
    setStatus('reading');
    void source.read().then(applyResult);
  }, [source, applyResult]);

  return { status, refresh };
};
