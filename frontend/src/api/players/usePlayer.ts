import { useEffect, useState } from 'react';
import type { Player } from '../../types';
import { getPlayers } from './getPlayers';

export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayers().then((data) => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  return { players, loading };
};