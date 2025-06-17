import { useState } from 'react';
import { addPlayer } from './addPlayer';
import type { Player } from '../../types';

export const useAddPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPlayer = async (name: string): Promise<Player | null> => {
    setLoading(true);
    setError(null);
    const result = await addPlayer(name);
    if (!result) {
      setError('Erreur lors de l’ajout du joueur');
    }
    setLoading(false);
    return result;
  };

  return { submitPlayer, loading, error };
};